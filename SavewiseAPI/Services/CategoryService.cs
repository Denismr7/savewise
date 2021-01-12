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
    [Route("api/categories")]
    public class CategoryService : BaseService
    {
        public class CategoryResponse : ServiceResponse
        {
            public OCategory category { get; set; }
        }
        public class CategoriesResponse : ServiceResponse
        {
            public List<OCategory> categories { get; set; }
        }
        public CategoryService(SavewiseContext context): base(context)
        {

        }

        // GET api/categories/user/{id}
        [HttpGet("user/{id}")]
        public IActionResult GetAll(int id)
        {
            CategoriesResponse response = new CategoriesResponse();
            response.status = new Status();
            response.status.success = false;
            try
            {
                CategoryManager manager = new CategoryManager(context);
                response.categories = manager.getAll(id, false, null, null);
                response.status.success = true;
            }
            catch (Exception exception)
            {
                response.status.errorMessage = exception.Message;
            }
            return Json(response);
        }

        // GET api/categories/user/{id}/spendings
        [HttpPost("user/{id}/spendings")]
        public IActionResult GetAllWithSpending(int id, [FromBody] string fromDate, string toDate)
        {
            CategoriesResponse response = new CategoriesResponse();
            response.status = new Status();
            response.status.success = false;
            try
            {
                CategoryManager manager = new CategoryManager(context);
                response.categories = manager.getAll(id, true, fromDate, toDate);
                response.status.success = true;
            }
            catch (Exception exception)
            {
                response.status.errorMessage = exception.Message;
            }
            return Json(response);
        }

        // GET api/categories/{id}
        [HttpGet("{id}")]
        public IActionResult GetCategory(int id)
        {
            CategoryResponse response = new CategoryResponse();
            response.status = new Status();
            response.status.success = false;
            try
            {
                CategoryManager manager = new CategoryManager(context);
                response.category = manager.getById(id);
                response.status.success = true;
            }
            catch (Exception exception)
            {
                response.status.errorMessage = exception.Message;
            }
            return Json(response);
        }

        // POST api/categories/
        [HttpPost()]
        public IActionResult SaveNew([FromBody] OCategory category)
        {
            CategoryResponse response = new CategoryResponse();
            response.status = new Status();
            response.status.success = false;
            try
            {
                using (var transaction = context.Database.BeginTransaction())
                {
                    CategoryManager manager = new CategoryManager(context);
                    response.category = manager.save(category);
                    response.status.success = true;

                    transaction.Commit();
                }
            }
            catch (Exception exception)
            {
                response.status.errorMessage = exception.Message;
            }
            return Json(response);
        }

        // PATCH api/categories/{id}
        [HttpPatch("{id}")]
        public IActionResult EditCategory([FromBody] OCategory category)
        {
            CategoryResponse response = new CategoryResponse();
            response.status = new Status();
            response.status.success = false;
            try
            {
                using (var transaction = context.Database.BeginTransaction())
                {
                    CategoryManager manager = new CategoryManager(context);
                    response.category = manager.save(category);
                    response.status.success = true;

                    transaction.Commit();
                }
            }
            catch (Exception exception)
            {
                response.status.errorMessage = exception.Message;
            }
            return Json(response);
        }

        // DELETE api/categories/{id}
        [HttpDelete("{id}")]
        public IActionResult DeleteCategory(int id)
        {
            Status response = new Status();
            response.success = false;
            try
            {
                using (var transaction = context.Database.BeginTransaction())
                {
                    CategoryManager manager = new CategoryManager(context);
                    response.success = manager.delete(id);

                    transaction.Commit();
                }
            }
            catch (Exception exception)
            {
                response.errorMessage = exception.Message;
            }
            return Json(response);
        }
    }
}
