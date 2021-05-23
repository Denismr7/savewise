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
    [Route("api/stats")]
    public class StatsService : BaseService
    {
        public class MonthsInformationResponse : ServiceResponse
        {
            public List<OMonthInformation> monthsInformation { get; set; }
        }

        public class VaultMonthlyAmountResponse : ServiceResponse {
            public List<OVaultMonthlyInformation> vaultInformation { get; set; }
        }


        public StatsService(SavewiseContext context): base(context)
        {

        }

        // GET api/stats/user/{id}/year-by-month/{year}
        [HttpGet("user/{id}/year-by-month/{year}")]
        public IActionResult GetAll(int id, int year)
        {
            MonthsInformationResponse response = new MonthsInformationResponse();
            response.status = new Status();
            response.status.success = false;
            try
            {
                StatsManager manager = new StatsManager(context);
                response.monthsInformation = manager.getMonthIncomeExpenses(year, id);
                response.status.success = true;
            }
            catch (Exception exception)
            {
                response.status.errorMessage = exception.Message;
            }
            return Json(response);
        }

        // GET api/stats/user/{id}/vault/{vaultId}/monthly-amount/{year}
        [HttpGet("user/{id}/vault/{vaultId}/monthly-amount/{year}")]
        public IActionResult GetVaultMonthlyAmount(int id, int vaultId, int year)
        {
            VaultMonthlyAmountResponse response = new VaultMonthlyAmountResponse();
            response.status = new Status();
            response.status.success = false;
            try
            {
                StatsManager manager = new StatsManager(context);
                response.vaultInformation = manager.getVaultMonthlyAmount(id, vaultId, year);
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
