using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Savewise.Managers;
using Savewise.Models;
using Savewise.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Savewise.Controllers
{
    [Route("api/categories")]
    public class CategoryService : BaseService
    {
        public CategoryService(SavewiseContext context): base(context)
        {

        }
        [HttpGet]
        public IActionResult GetAll()
        {
            List<Category> categories = new List<Category>();
            CategoryManager manager = new CategoryManager(context);
            categories = manager.getAll();
            return Json(categories);
        }

        [HttpGet("test")]
        public IActionResult Test()
        {
            return Json("Hi");
        }
    }
}
