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
    public class StatsManager : Manager
    {
        public StatsManager(SavewiseContext context): base(context)
        {
        }

        /// <summary>
        /// Returns all incomes and expenses of a given year, divided in months
        /// </summary>
        public List<OMonthInformation> getMonthIncomeExpenses(int year, int userId)
        {
            if (!userExists(userId))
            {
                throw new Exception("Invalid user");
            }

            List<OMonthInformation> results = new List<OMonthInformation>();

            CategoryManager categoryManager = new CategoryManager(context);
            // Iterate each month
            for (int i = 1; i <= 12; i++)
            {
                double incomes = 0;
                double expenses = 0;

                string month = i < 10 ? $"0{i}" : i.ToString();
                string from = $"01/{month}/{year}";
                string to = $"{DateTime.DaysInMonth(year, i)}/{month}/{year}";
                List<OCategory> categories = categoryManager.getAll(userId, true, from, to, null);
                foreach (OCategory cat in categories)
                {
                    switch (cat.categoryType.id)
                    {
                        case (int)CategoryTypesId.Incomes:
                            incomes += cat.amount.Value;
                            break;
                        case (int)CategoryTypesId.Expenses:
                            expenses += cat.amount.Value;
                            break;
                        default:
                            break;
                    }
                }

                // Save data
                OMonthInformation monthInformation = new OMonthInformation();
                monthInformation.month = i;
                monthInformation.incomes = Math.Round(incomes, 2);
                monthInformation.expenses = Math.Round(expenses, 2);
                results.Add(monthInformation);
            }

            return results;
        }
    }
}
