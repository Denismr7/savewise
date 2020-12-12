using Microsoft.EntityFrameworkCore;
using Savewise.Models;
using Savewise.Services.Objects;
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

        /// <summary>
        /// Transform from Model to Object
        /// </summary>
        private OCategory convert(Category model)
        {
            OCategory category = new OCategory();
            category.id = model.cId;
            category.name = model.cName;
            category.userID = model.cUsrId;

            return category;
        }

        public List<OCategory> getAll()
        {
            List<Category> categoriesModel = new List<Category>();
            List<OCategory> categories = new List<OCategory>();
            categoriesModel = context.Categories.AsNoTracking().ToList();

            foreach (Category cat in categoriesModel)
            {
                categories.Add(convert(cat));
            }

            return categories;
        }

        public OCategory getById(int id)
        {
            Category categoryModel = context.Categories.FirstOrDefault(c => c.cId == id);
            if (categoryModel == null)
            {
                throw new Exception($"ERROR: Category with ID [{id}] not found");
            }
            OCategory category = convert(categoryModel);

            return category;
        }

        public OCategory save(OCategory category)
        {
            // Validations
            if (category == null)
            {
                throw new Exception("ERROR: Category null");
            }
            User user = context.Users.AsNoTracking().FirstOrDefault(u => u.uId == category.userID);
            if (user == null)
            {
                throw new Exception($"ERROR: CATEGORY USER ID [{category.userID}] NOT FOUND. NO SUCH USER");
            }

            // Get model and modify properties
            Category model;
            if (category.id.HasValue) 
            {
                model = context.Categories.FirstOrDefault(c => c.cId == category.id.Value);
            } else {
                model = new Category();
            }
            model.cName = category.name;
            model.cUsrId = category.userID;

            // Update if it's a current category or Add if is a new one
            if (category.id.HasValue) {
                context.Categories.Update(model);
            } else {
                context.Categories.Add(model);
            }
            context.SaveChanges();
            if (!category.id.HasValue) category.id = model.cId;

            return category;
        }

        public bool delete(int id)
        {
            bool deleted = false;

            Category category = context.Categories.FirstOrDefault(c => c.cId == id);
            if (category == null) throw new Exception($"ERROR: Category with id {id} not found");

            context.Categories.Remove(category);
            context.SaveChanges();

            deleted = true;
            return deleted;
        }
    }
}
