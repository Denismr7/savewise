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
        public class CategoryTypesResponse : ServiceResponse
        {
            public List<OCategoryType> categoryTypes { get; set; }
        }

        public class GetCategoriesInput
        {
            public bool includeAmounts { get; set; }
            public string startDate { get; set; }
            public string endDate { get; set; }
            public int? categoryTypeId { get; set; }
        }
        public CategoryService(SavewiseContext context): base(context)
        {

        }

        // POST api/categories/user/{id}
        [HttpPost("user/{id}")]
        public IActionResult GetAll(int id, [FromBody] GetCategoriesInput input)
        {
            CategoriesResponse response = new CategoriesResponse();
            response.status = new Status();
            response.status.success = false;
            try
            {
                CategoryManager manager = new CategoryManager(context);
                response.categories = manager.getAll(id, input.includeAmounts, input.startDate, input.endDate, input.categoryTypeId);
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

        // GET api/categories/types
        [HttpGet("types")]
        public IActionResult GetCategoryTypes()
        {
            CategoryTypesResponse response = new CategoryTypesResponse();
            response.status = new Status();
            response.status.success = false;
            try
            {
                CategoryManager manager = new CategoryManager(context);
                response.categoryTypes = manager.GetCategoryTypes();
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
