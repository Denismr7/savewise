using Microsoft.EntityFrameworkCore;
using Savewise.Common;
using Savewise.Models;
using Savewise.Services.Objects;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace Savewise.Managers
{
    public class TransactionManager : Manager
    {
        public TransactionManager(SavewiseContext context): base(context)
        {
        }

        /// <summary>
        /// Transform from Model to Object
        /// </summary>
        private OTransaction convert(Transaction model)
        {
            OTransaction transaction = new OTransaction();
            transaction.id = model.tId;
            transaction.amount = model.tAmount;
            transaction.date = model.tDate.ToString();
            transaction.description = model.tDescription;
            transaction.userId = model.tUserId;
            transaction.category = new OCategory();
            transaction.category.id = model.tCategoryId;
            transaction.vaultId = model.tVaultId;
            if (model.CategoryNavigation != null)
            {
                transaction.category.categoryType = new OCategoryType();
                transaction.category.categoryType.id = model.CategoryNavigation.cTypeId;
            }

            return transaction;
        }

        /// <summary>
        /// Returns all user's transactions between given dates
        /// </summary>
        /// <param name="userId">User ID</param>
        /// <param name="startDate">Start date</param>
        /// <param name="endDate">End date</param>
        /// <param name="vaultId">Gets the transactions related to a specific vault</param>
        public List<OTransaction> getAllByDates(int userId, string startDate, string endDate, int? vaultId)
        {
            DateTime fromDate;
            DateTime toDate;
            if (!DateTime.TryParseExact(startDate, "d'/'M'/'yyyy",
                           CultureInfo.InvariantCulture,
                           DateTimeStyles.None, out fromDate) || !DateTime.TryParseExact(endDate, "d'/'M'/'yyyy",
                           CultureInfo.InvariantCulture,
                           DateTimeStyles.None, out toDate))
            {
                throw new Exception("ERROR: Invalid dates");
            }
            if (toDate < fromDate)
            {
                throw new Exception("ERROR: Incorrect dates");
            }
            if (!userExists(userId))
            {
                throw new Exception($"ERROR: No such user. User ID: [{userId}]");
            }

            IQueryable<Transaction> transactionsModel = context.Transactions.AsNoTracking()
                                                    .Where(t => t.tUserId == userId)
                                                    .Where(t => t.tDate >= fromDate && t.tDate <= toDate.AddHours(23).AddMinutes(59))
                                                    .OrderBy(t => t.tDate)
                                                    .Include(t => t.CategoryNavigation)
                                                    .ThenInclude(c => c.categoryTypeNavigation);

            if (vaultId.HasValue) {
                transactionsModel = transactionsModel.Where(t => t.tVaultId == vaultId.Value);
            }

            List<OTransaction> transactions = new List<OTransaction>();

            foreach (Transaction transaction in transactionsModel.ToList())
            {
                transactions.Add(convert(transaction));
            }

            return transactions;
        }

        
        /// <summary>
        /// Returns the last user's transactions 
        /// </summary>
        /// <param name="userId">User ID</param>
        /// <param name="limit">The maximum number of transactions to be recovered</param>
        public List<OTransaction> getTransactions(int userId, int? vaultId, int limit = 5)
        {
            if (!userExists(userId))
            {
                throw new Exception($"ERROR: No such user. User ID: [{userId}]");
            }
            IQueryable<Transaction> transactionsModel = context.Transactions.AsNoTracking()
                                                    .Where(t => t.tUserId == userId)
                                                    .OrderByDescending(t => t.tDate)
                                                    .Include(t => t.CategoryNavigation);
            List<OTransaction> transactions = new List<OTransaction>();
            
            if (vaultId.HasValue) {
                transactionsModel = transactionsModel.Where(t => t.tVaultId == vaultId.Value);
            }

            foreach (Transaction transaction in transactionsModel.Take(limit).ToList())
            {
                transactions.Add(convert(transaction));
            }

            return transactions;
        }

        /// <summary>
        /// Search transaction with its id
        /// </summary>
        private Transaction getByIdEdition(int transactionId)
        {
            Transaction transactionModel = context.Transactions
                                                .Include(t => t.CategoryNavigation)
                                                .ThenInclude(c => c.categoryTypeNavigation)
                                                .FirstOrDefault(t => t.tId == transactionId);
            if (transactionModel == null)
            {
                throw new Exception($"ERROR: Transaction with ID [{transactionId}] not found");
            }

            return transactionModel;
        }

        public OTransaction saveTransaction(OTransaction transaction)
        {
            // Validations
            if (transaction == null)
            {
                throw new Exception("ERROR: Transaction null");
            }
            

            // Get model and modify properties
            Transaction model;
            Transaction modelBeforeEdited = null;
            if (transaction.id.HasValue) 
            {
                model = getByIdEdition(transaction.id.Value);
                modelBeforeEdited = model;
            } else {
                model = new Transaction();
            }
            model.tAmount = transaction.amount;
            model.tCategoryId = transaction.category.id.Value;
            model.tDate = DateTime.ParseExact(transaction.date, "d'/'M'/'yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None);
            model.tDescription = transaction.description;
            model.tUserId = transaction.userId;
            model.tVaultId = transaction.vaultId;

            // Update or Add if is a new one
            if (transaction.id.HasValue) {
                context.Transactions.Update(model);
            } else {
                context.Transactions.Add(model);
            }
            context.SaveChanges();
            context.Entry(model).Reference(t => t.CategoryNavigation)
                                .Query()
                                .Include(c => c.categoryTypeNavigation).Load();

            // Update vault if necessary
            if (transaction.vaultId.HasValue) {
                VaultManager vaultManager = new VaultManager(context);
                vaultManager.updateVaultAmount(model, modelBeforeEdited);
            }

            return convert(model);
        }

        public bool delete(int transactionId)
        {
            bool deleted = false;

            Transaction transaction = getByIdEdition(transactionId);

            int cagegoryTypeId = transaction.CategoryNavigation.categoryTypeNavigation.ctId.Value;
            if (cagegoryTypeId == (int)CategoryTypesId.VaultsIncomes || cagegoryTypeId == (int)CategoryTypesId.VaultsExpenses) {
                VaultManager vaultManager = new VaultManager(context);
                vaultManager.updateVaultAmount(transaction, null, true);
            }

            context.Transactions.Remove(transaction);
            context.SaveChanges();

            deleted = true;
            return deleted;
        }
    }
}
