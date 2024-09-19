using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace FrekvensApi.Models
{
    public class Station
    {
        public Guid Id { get; set; }
        [Required]
        required public string Name { get; set; }
        [Required]
        required public string Frequency { get; set; }
        [Required]
        required public string StreamUrl { get; set; }
        public bool IsAvailable { get; set; }
        [Required]
        public Guid GenreId { get; set; }
        [ValidateNever]
        required public Genre Genre { get; set; }
        required public ApplicationUser CreatedBy { get; set; }
    }
}