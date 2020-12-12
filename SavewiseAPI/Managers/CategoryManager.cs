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

        public Category getById(int id)
        {
            Category category = context.Categories.FirstOrDefault(c => c.cId == id);

            return category;
        }

        public Category save(Category category)
        {
            // Check param
            if (category == null)
            {
                throw new Exception("ERROR: Category null");
            }

            // Update if it's a current category or Add if is a new one
            if (category.cId.HasValue) {
                context.Categories.Update(category);
            } else {
                context.Categories.Add(category);
            }
            context.SaveChanges();

            return category;
        }

        public bool delete(int id)
        {
            bool response = false;

            Category category = context.Categories.FirstOrDefault(c => c.cId == id);
            if (category == null) throw new Exception($"ERROR: Category with id {id} not found");

            context.Categories.Remove(category);
            context.SaveChanges();

            response = true;
            return response;
        }
    }
}
