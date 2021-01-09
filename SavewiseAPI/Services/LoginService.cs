using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Savewise.Managers;
using Savewise.Models;
using Savewise.Services;
using Savewise.Services.Objects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Savewise.Services
{
    [Route("api/login")]
    public class LoginService : BaseService
    {
        public class LoginInfo
        {
            public string userName { get; set; }
            public string password { get; set; }
        }

        public class LoginResponse : ServiceResponse
        {
            public User login { get; set; }
        }
        public LoginService(SavewiseContext context): base(context)
        {

        }

        // POST api/login
        [HttpPost]
        public IActionResult Login([FromBody] LoginInfo input)
        {
            LoginResponse response = new LoginResponse();
            response.status = new Status();
            response.status.success = false;
            try
            {
                LoginManager manager = new LoginManager(context);
                response.login = manager.checkLogin(input.userName, input.password);
                response.status.success = true;
            }
            catch (Exception exception)
            {
                response.status.errorMessage = exception.Message;
            }
            return Json(response);
        }
    }
}
