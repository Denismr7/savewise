namespace Savewise.Services.Objects
{
    public class OVault
    {
        /// <summary>
        /// Vault ID
        /// </summary>
        public int? id { get; set; }

        /// <summary>
        /// Vault name
        /// </summary>
        public string name { get; set; }

        /// <summary>
        /// User ID
        /// </summary>
        public int? userID { get; set; }

        /// <summary>
        /// Amount saved in the vault
        /// </summary>
        public double? amount { get; set; }
    }
}