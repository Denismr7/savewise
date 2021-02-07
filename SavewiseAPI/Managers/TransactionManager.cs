using Microsoft.EntityFrameworkCore;
using Savewise.Models;
using Savewise.Services.Objects;
using System;
using System.Collections.Generic;
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
            transaction.category = new OCategory();
            transaction.category.id = model.tCategoryId;
            transaction.date = model.tDate.ToString();
            transaction.description = model.tDescription;
            transaction.userId = model.tUserId;

            return transaction;
        }

        /// <summary>
        /// Returns all user's transactions between given dates
        /// </summary>
        /// <param name="userId">User ID</param>
        /// <param name="startDate">Start date</param>
        /// <param name="endDate">End date</param>
        public List<OTransaction> getAllByDates(int userId, string startDate, string endDate)
        {
            DateTime fromDate;
            DateTime toDate;
            if (!DateTime.TryParse(startDate, out fromDate) || !DateTime.TryParse(endDate, out toDate))
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

            List<Transaction> transactionsModel = context.Transactions.AsNoTracking()
                                                    .Where(t => t.tUserId == userId)
                                                    .Where(t => t.tDate >= fromDate && t.tDate <= toDate.AddHours(23).AddMinutes(59))
                                                    .OrderBy(t => t.tDate)
                                                    .ToList();;
            List<OTransaction> transactions = new List<OTransaction>();

            foreach (Transaction transaction in transactionsModel)
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
        public List<OTransaction> getTransactions(int userId, int limit = 5)
        {
            if (!userExists(userId))
            {
                throw new Exception($"ERROR: No such user. User ID: [{userId}]");
            }
            List<Transaction> transactionsModel = context.Transactions.AsNoTracking()
                                                    .Where(t => t.tUserId == userId)
                                                    .OrderBy(t => t.tDate)
                                                    .Take(limit)
                                                    .ToList();
            List<OTransaction> transactions = new List<OTransaction>();

            foreach (Transaction transaction in transactionsModel)
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
            Transaction transactionModel = context.Transactions.FirstOrDefault(t => t.tId == transactionId);
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
            if (transaction.id.HasValue) 
            {
                model = getByIdEdition(transaction.id.Value);
            } else {
                model = new Transaction();
            }
            model.tAmount = transaction.amount;
            model.tCategoryId = transaction.category.id.Value;
            model.tDate = DateTime.Parse(transaction.date);
            model.tDescription = transaction.description;
            model.tUserId = transaction.userId;

            // Update or Add if is a new one
            if (transaction.id.HasValue) {
                context.Transactions.Update(model);
            } else {
                context.Transactions.Add(model);
            }
            context.SaveChanges();
            if (!transaction.id.HasValue) transaction.id = model.tId;

            return transaction;
        }

        public bool delete(int transactionId)
        {
            bool deleted = false;

            Transaction transaction = getByIdEdition(transactionId);

            context.Transactions.Remove(transaction);
            context.SaveChanges();

            deleted = true;
            return deleted;
        }
    }
}
