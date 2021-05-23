namespace Savewise.Services.Objects
{
    public class OMonthInformation
    {
        /// <summary>
        /// Month (1 - 12)
        /// </summary>
        public int month { get; set; }

        /// <summary>
        /// Incomes
        /// </summary>
        public double incomes { get; set; }

        /// <summary>
        /// Incomes
        /// </summary>
        public double expenses { get; set; }
    }

    public class OVaultMonthlyInformation {
        /// <summary>
        /// Month (1 - 12)
        /// </summary>
        public int month { get; set; }

        /// <summary>
        /// Total vault amount in that month
        /// </summary>
        public double amount { get; set; }
    }
}