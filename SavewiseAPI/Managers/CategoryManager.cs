using Microsoft.EntityFrameworkCore;
using Savewise.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Savewise.Managers
{
    public class CategoryManager : Manager
    {
        public CategoryManager(SavewiseContext context): base(context)
        {
        }
        public List<Category> getAll()
        {
            List<Category> categories = new List<Category>();
            categories = context.Categories.AsNoTracking().ToList();

            return categories;
        }
    }
}
