using Microsoft.AspNetCore.Mvc;

namespace FrekvensApi.Extensions
{
    public static class ControllerExtensions
    {
        public static ActionResult? ValidateModelState(this ControllerBase controller)
        {
            if (!controller.ModelState.IsValid)
            {
                var errors = controller.ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();

                return controller.BadRequest(new { description = "Validation failed", errors });
            }

            return null;
        }
        
    }
}