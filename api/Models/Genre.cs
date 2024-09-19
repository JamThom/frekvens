using System.ComponentModel.DataAnnotations;

namespace FrekvensApi.Models
{
    public class Genre
    {
        public Guid Id { get; set; }
        [Required(ErrorMessage = "Name is required")]
        public string Name { get; set; }
        public ApplicationUser CreatedBy { get; set; }
    }
}