namespace Savewise.Services.Objects
{
    public class OUser
    {
        /// <summary>
        /// User ID
        /// </summary>
        public int id { get; set; }

        /// <summary>
        /// User login
        /// </summary>
        public string login { get; set; }

        /// <summary>
        /// User first name
        /// </summary>
        public string name { get; set; }

        /// <summary>
        /// User last name
        /// </summary>
        public string lastName { get; set; }

        /// <summary>
        /// User password
        /// </summary>
        public string password { get; set; }
    }
}