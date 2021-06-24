using System;

namespace Savewise.Services.Objects
{
    public class OTransaction
    {
        /// <summary>
        /// ID
        /// </summary>
        public int? id { get; set; }

        /// <summary>
        /// User ID
        /// </summary>
        public int userId { get; set; }

        /// <summary>
        /// Category
        /// </summary>
        public OCategory category { get; set; }

        /// <summary>
        /// Amount
        /// </summary>
        public double amount { get; set; }

        /// <summary>
        /// Transaction date
        /// </summary>
        public string date { get; set; }

        /// <summary>
        /// Transaction description
        /// </summary>
        public string description { get; set; }

        /// <summary>
        /// Vault ID
        /// </summary>
        public int? vaultId { get; set; }
    }
}