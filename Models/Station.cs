using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace FrekvensApi.Models
{
    public class Station
    {
        public Guid Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Frequency { get; set; }
        [Required]
        public string StreamUrl { get; set; }
        public Boolean IsAvailable { get; set; }
        [Required]
        public Guid GenreId { get; set; }
        [ValidateNever]
        public Genre Genre { get; set; }
    }
}