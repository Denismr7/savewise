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
    [Route("api/user")]
    public class UserService : BaseService
    {
        public class UserInput
        {
            public OUser user { get; set; }
        }

        public class UserResponse : ServiceResponse
        {
            public OUser user { get; set; }
        }
        public UserService(SavewiseContext context): base(context)
        {

        }

        // POST api/user
        [HttpPost]
        public IActionResult CreateUser([FromBody] UserInput input)
        {
            ServiceResponse response = new ServiceResponse();
            response.status = new Status();
            response.status.success = false;
            try
            {
                using (var transaction = context.Database.BeginTransaction())
                {
                    UserManager manager = new UserManager(context);
                    response.status.success =  manager.Save(input.user);

                    transaction.Commit();
                }
            }
            catch (Exception exception)
            {
                response.status.errorMessage = exception.Message;
            }
            return Json(response);
        }

        // PATCH api/user/{id}
        [HttpPatch("{id}")]
        public IActionResult EditUser([FromBody] UserInput input)
        {
            UserResponse response = new UserResponse();
            response.status = new Status();
            response.status.success = false;
            try
            {
                using (var transaction = context.Database.BeginTransaction())
                {
                    UserManager manager = new UserManager(context);
                    response.user = manager.Edit(input.user);
                    response.status.success =  true;
                    transaction.Commit();
                }
            }
            catch (Exception exception)
            {
                response.status.errorMessage = exception.Message;
            }
            return Json(response);
        }
    }
}
