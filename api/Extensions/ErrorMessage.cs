using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace FrekvensApi.Extensions
{
    public static class ErrorMessage
    {
        public static ActionResult SendBadRequest(this ControllerBase controller, string description)
        {
            return new BadRequestObjectResult(new { description });
        }

        public static ActionResult SendNotFound(this ControllerBase controller, string description)
        {
            return new NotFoundObjectResult(new { description });
        }
    }
}