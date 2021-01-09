using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Savewise.Common;
using Savewise.Models;
using Savewise.Services.Objects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Savewise.Managers
{
    public class LoginManager : Manager
    {
        public LoginManager(SavewiseContext context): base(context)
        {
        }

        /// <summary>
        /// Check login
        /// </summary>
        public User checkLogin(string username, string password)
        {
            User login = null;
            HashingOptions hashingOptions = new HashingOptions();
            hashingOptions.Iterations = 1000;
            IOptions<HashingOptions> options = Options.Create(hashingOptions);
            PasswordHasher hasher = new PasswordHasher(options);
            User user = context.Users.AsNoTracking()
                                    .FirstOrDefault(u => u.uLogin == username);
            if (user == null)
            {
                throw new Exception("User not found");
            }
            var check = hasher.Check(user.uPassword, password);
            if (!check.Verified)
            {
                throw new Exception("Incorrect password");
            }
            else {
                login = new User();
                login.uId = user.uId;
                login.uLogin = user.uLogin;
                login.uName = user.uName;
                login.uLastName = user.uLastName;
            }

            return login;
        }
    }
}
