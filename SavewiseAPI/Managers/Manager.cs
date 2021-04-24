using Savewise.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Savewise.Managers
{
    public class Manager
    {
        private SavewiseContext _context;
        public Manager(SavewiseContext context)
        {
            _context = context;
        }

        public SavewiseContext context
        {
            get { return _context; }
        }

        public bool userExists(int userId)
        {
            User user = context.Users.FirstOrDefault(u => u.uId == userId);
            if (user != null) return true;
            else return false;
        }
    }
}
