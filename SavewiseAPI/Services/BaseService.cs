using Microsoft.AspNetCore.Mvc;
using Savewise.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Savewise.Services
{
    public class BaseService : Controller
    {
        private SavewiseContext _context;
        public BaseService(SavewiseContext context)
        {
            _context = context;
        }

        public SavewiseContext context
        {
            get { return _context; }
        }
    }
}
