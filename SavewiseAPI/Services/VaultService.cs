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

        public class VaultResponse : ServiceResponse {
            public OVault vault { get; set; }
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

        // POST api/vaults/
        [HttpPost()]
        public IActionResult SaveVault([FromBody] OVault vault)
        {
            VaultResponse response = new VaultResponse();
            response.status = new Status();
            response.status.success = false;
            try
            {
                using (var transaction = context.Database.BeginTransaction())
                {
                    VaultManager manager = new VaultManager(context);
                    response.vault = manager.Save(vault);
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

        // DELETE api/vaults/{vaultId}
        [HttpDelete("{vaultId}")]
        public IActionResult DeleteVault(int vaultId)
        {
            ServiceResponse response = new ServiceResponse();
            response.status = new Status();
            response.status.success = false;
            try
            {
                using (var transaction = context.Database.BeginTransaction())
                {
                    VaultManager manager = new VaultManager(context);
                    manager.Delete(vaultId);
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
    }
}
