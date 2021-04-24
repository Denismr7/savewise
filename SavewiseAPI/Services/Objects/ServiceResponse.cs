namespace Savewise.Services.Objects
{
    public class Status
    {
        public bool success { get; set; }
        public string errorMessage { get; set; }
    }
    public class ServiceResponse
    {
        public Status status { get; set; }
    }
}