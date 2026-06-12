using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Machine
    {
        [Key]
        public int MachineId { get; set; }

        [Required(ErrorMessage = "Machine Name is required")]
        [StringLength(100, MinimumLength = 1, ErrorMessage = "Machine Name must not be empty")]
        public required string MachineName { get; set; }

        [Required(ErrorMessage = "Machine Type is required")]
        [StringLength(100)]
        public required string MachineType { get; set; }

        [Required(ErrorMessage = "Location is required")]
        [StringLength(100)]
        public required string Location { get; set; }

        [Required(ErrorMessage = "Status is required")]
        public int StatusId { get; set; }

        // Foreign key relationship
        public MachineStatus? Status { get; set; }
    }
}
