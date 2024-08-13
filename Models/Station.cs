namespace FrekvensApi.Models
{
    public class Station
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Name is required")]
        public string Name { get; set; }
        [Required(ErrorMessage = "Frequency is required")]
        public string Frequency { get; set; }
        [Required(ErrorMessage = "StreamUrl is required")]
        public string StreamUrl { get; set; }
        public Boolean IsAvailable { get; set; }
        [Required(ErrorMessage = "GenreId is required")]
        public int GenreId { get; set; }
        public Genre Genre { get; set; }
    }
}