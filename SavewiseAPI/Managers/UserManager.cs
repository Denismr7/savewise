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
    public class UserManager : Manager
    {
        public UserManager(SavewiseContext context): base(context)
        {
        }

        /// <summary>
        /// Transform from Model to Object
        /// </summary>
        public OUser convert(User model)
        {
            OUser user = new OUser();
            user.id = model.uId;
            user.name = model.uName;
            user.lastName = model.uLastName;
            user.login = model.uLastName;

            return user;
        }

        /// <summary>
        /// Create new user
        /// </summary>
        public bool Save(OUser input)
        {
            // Check if login exists
            bool loginExists = context.Users.AsNoTracking().FirstOrDefault(u => u.uLogin == input.login) != null;
            if (loginExists)
            {
                throw new Exception("User already exists");
            }

            // Get encrypted password
            string hashedPassword = hashPassword(input.password);

            // Create new user
            User userModel = new User();
            userModel.uName = input.name;
            userModel.uLastName = input.lastName;
            userModel.uLogin = input.login;
            userModel.uPassword = hashedPassword;
            context.Users.Add(userModel);
            context.SaveChanges();

            return true;
        }

        /// <summary>
        /// Edit existing user
        /// </summary>
        public OUser Edit(OUser input)
        {
            // Get user
            User userModel = context.Users.FirstOrDefault(u => u.uId == input.id);
            if (userModel == null)
            {
                throw new Exception("User not found");
            }

            // Edit data
            userModel.uName = input.name;
            userModel.uLastName = input.lastName;
            if (input.password != null)
            {
                userModel.uPassword = hashPassword(input.password);
            }
            context.Users.Update(userModel);
            context.SaveChanges();

            return convert(userModel);
        }

        private string hashPassword(string password)
        {
            HashingOptions hashingOptions = new HashingOptions();
            hashingOptions.Iterations = 1000;
            IOptions<HashingOptions> options = Options.Create(hashingOptions);
            PasswordHasher hasher = new PasswordHasher(options);

            return hasher.Hash(password);
        }
    }
}
