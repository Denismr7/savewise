namespace Savewise.Services.Objects
{
    public class OCategory
    {
        /// <summary>
        /// Category ID
        /// </summary>
        public int? id { get; set; }

        /// <summary>
        /// Category name
        /// </summary>
        public string name { get; set; }

        /// <summary>
        /// User ID
        /// </summary>
        public int? userID { get; set; }

        /// <summary>
        /// Quantity spended between two given dates in the category
        /// </summary>
        public int? amount { get; set; }
    }
}