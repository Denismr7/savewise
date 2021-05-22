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
    [Route("api/transactions")]
    public class TransactionService : BaseService
    {
        public class TransactionsByDateResponse : ServiceResponse
        {
            public List<OTransaction> transactions { get; set; }
        }
        public class TransactionResponse : ServiceResponse
        {
            public OTransaction transaction { get; set; }
        }
        public TransactionService(SavewiseContext context): base(context)
        {

        }

        // GET api/transactions/user/{id}?startDate=startDate?endDate=endDate?limit=limit
        [HttpGet("user/{id}")]
        public IActionResult GetTransactions(int id, [FromQuery] string startDate, [FromQuery] string endDate, [FromQuery] int? limit)
        {
            TransactionsByDateResponse response = new TransactionsByDateResponse();
            response.status = new Status();
            response.status.success = false;
            try
            {
                TransactionManager manager = new TransactionManager(context);
                if (startDate != null && endDate != null) {
                    response.transactions = manager.getAllByDates(id, startDate, endDate);
                }
                else {
                    response.transactions = manager.getTransactions(id, limit.Value);
                }
                response.status.success = true;
            }
            catch (Exception exception)
            {
                response.status.errorMessage = exception.Message;
            }
            return Json(response);
        }

        // POST api/transactions/
        [HttpPost]
        public IActionResult SaveTransaction([FromBody] OTransaction transaction)
        {
            TransactionResponse response = new TransactionResponse();
            response.status = new Status();
            response.status.success = false;
            try
            {
                using (var dbContextTransaction = context.Database.BeginTransaction())
                {
                    TransactionManager manager = new TransactionManager(context);
                    response.transaction = manager.saveTransaction(transaction);
                    response.status.success = true;

                    dbContextTransaction.Commit();
                }
            }
            catch (Exception exception)
            {
                response.status.errorMessage = exception.Message;
            }
            return Json(response);
        }

        // DELETE api/transactions/{id}
        [HttpDelete("{id}")]
        public IActionResult DeleteTransaction(int id)
        {
            Status response = new Status();
            response.success = false;
            try
            {
                using (var transaction = context.Database.BeginTransaction())
                {
                    TransactionManager manager = new TransactionManager(context);
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
