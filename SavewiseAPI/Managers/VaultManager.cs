using Microsoft.EntityFrameworkCore;
using Savewise.Common;
using Savewise.Models;
using Savewise.Services.Objects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Savewise.Managers
{
    public class VaultManager : Manager
    {
        public VaultManager(SavewiseContext context): base(context)
        {
        }

        public List<OVault> getAll(int userId) {
            if (!userExists(userId)) {
                throw new Exception("Invalid user");
            }

            List<Vault> vaultsModel = context.Vaults.AsNoTracking().Where(v => v.vUserId == userId).ToList();
            List<OVault> vaults = new List<OVault>();
            foreach (Vault model in vaultsModel)
            {
                vaults.Add(convert(model));
            }

            return vaults;
        }

        /// <summary>
        /// Save vault
        /// </summary>
        public OVault Save(OVault vault) {
            bool isNew = !vault.id.HasValue;
            // Validations
            if (vault.amount.HasValue && vault.amount.Value < 0) {
                throw new Exception("Invalid vault amount");
            }
            if (!vault.userID.HasValue) {
                throw new Exception("Vault must have an user id");
            }
            if (isNew && existsVaultWithSameUserAndName(vault.userID.Value, vault.name)) {
                throw new Exception("There is a vault with the same name");
            }

            // Create or edit
            Vault model;
            if (isNew) {
                model = new Vault();
            } else {
                model = context.Vaults.FirstOrDefault(v => v.vId == vault.id.Value);
                if (model == null) {
                    throw new Exception($"Vault {vault.id.Value} not found");
                }
            }
            model.vName = vault.name;
            model.vUserId = vault.userID.Value;
            model.vAmount = vault.amount.Value;

            // Save changes
            if (isNew) {
                context.Vaults.Add(model);
            } else {
                context.Vaults.Update(model);
            }
            context.SaveChanges();

            return convert(model);
        }

        /// <summary>
        /// Delete vault
        /// </summary>
        public void Delete(int vaultId) {
            // Validations
            Vault model = context.Vaults.FirstOrDefault(vault => vault.vId == vaultId);
            if (model == null) {
                throw new Exception("Vault not found");
            }
            if (model.vAmount != 0) {
                throw new Exception("Amount should be 0");
            }

            // Delete all vault transactions
            List<Transaction> vaultTransactions = context.Transactions.Where(tr => tr.tVaultId == vaultId).ToList();
            context.Transactions.RemoveRange(vaultTransactions);

            // Delete vault
            context.Vaults.Remove(model);
            context.SaveChanges();
        }

        /// <summary>
        /// Updates the amount of a vault when a new transaction is saved
        /// </summary>
        public void updateVaultAmount(Transaction transaction, Transaction oldTransaction, bool deletedTransaction = false) {
            // Get the transaction amount and transform value to negative if it's a expense
            double? tAmount = transformAmount(transaction.tAmount, transaction.CategoryNavigation.categoryTypeNavigation.ctId.Value);
            if (!tAmount.HasValue) {
                throw new Exception("Invalid transaction");
            }

            // Gets the old transaction amount if it exists
            double oldTransactionAmount = 0;
            if (oldTransaction != null) {
                double? transformedAmount = transformAmount(oldTransaction.tAmount, oldTransaction.CategoryNavigation.categoryTypeNavigation.ctId.Value);
                oldTransactionAmount = transformedAmount.HasValue ? transformedAmount.Value : 0;

                // If the transaction vault has changed, we must update the previous vault as well
                if (oldTransaction.tVaultId.HasValue && oldTransaction.tVaultId.Value != transaction.tVaultId.Value) {
                    Vault prevVault = getVaultById(oldTransaction.tVaultId.Value);
                    prevVault.vAmount += oldTransactionAmount;
                    context.Vaults.Update(prevVault);
                }
            }

            // Get the vault
            Vault vault = getVaultById(transaction.tVaultId.Value);

            // First add or subtract the previous transaction amount if necessary
            vault.vAmount += oldTransactionAmount;
            // Then add or subtract the updated transaction amount
            if (!deletedTransaction) {
                vault.vAmount += tAmount.Value;
            } else {
                // If the transaction is being deleted we'll do the opposite
                vault.vAmount -= tAmount.Value;
            }
            // Check if new amount is correct
            if (vault.vAmount < 0) {
                throw new Exception("Invalid vault amount. It can't be less than 0");
            }

            // Update vault
            context.Vaults.Update(vault);

            context.SaveChanges();
        }

        /// <summary>
        /// Returns a positive number if transaction category type is Vault Income, negative number if it's Vault Expense and null otherwise
        /// </summary>
        public static double? transformAmount(double transactionAmount, int categoryTypeId) {
            switch (categoryTypeId)
            {
                case (int)CategoryTypesId.VaultsIncomes:
                    return transactionAmount;
                case (int)CategoryTypesId.VaultsExpenses:
                    return transactionAmount * -1;
                default:
                    return null;
            }
        }

        private Vault getVaultById(int vaultId) {
            Vault model = context.Vaults.FirstOrDefault(v => v.vId == vaultId);
            
            if (model == null) {
                throw new Exception("Vault not found");
            }

            return model;
        }

        private OVault convert(Vault model) {
            OVault vault = new OVault();
            vault.amount = model.vAmount;
            vault.id = model.vId;
            vault.name = model.vName;

            return vault;
        }

        private bool existsVaultWithSameUserAndName(int vaultUserId, string vaultName) {
            return context.Vaults.AsNoTracking().FirstOrDefault(vault => vault.vUserId == vaultUserId && vault.vName == vaultName) != null;
        }
    }
}
