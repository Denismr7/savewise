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
    [Route("api/vaults")]
    public class VaultService : BaseService
    {
        public class VaultsResponse : ServiceResponse {
            public List<OVault> vaults { get; set; }
        }

        public VaultService(SavewiseContext context): base(context)
        {

        }

        // GET api/vaults/user/{id}
        [HttpGet("user/{id}")]
        public IActionResult GetAll(int id)
        {
            VaultsResponse response = new VaultsResponse();
            response.status = new Status();
            response.status.success = false;
            try
            {
                VaultManager manager = new VaultManager(context);
                response.vaults = manager.getAll(id);
                response.status.success = true;
            }
            catch (Exception exception)
            {
                response.status.errorMessage = exception.Message;
            }
            return Json(response);
        }
    }
}
