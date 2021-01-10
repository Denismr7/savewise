using Microsoft.EntityFrameworkCore;
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
    }
}
