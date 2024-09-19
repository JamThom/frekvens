using System.ComponentModel.DataAnnotations;

namespace FrekvensApi.Models
{
    public class GenreDto
    {
        public Guid Id { get; set; }
        [Required(ErrorMessage = "Name is required")]
        public string Name { get; set; }
    }
}