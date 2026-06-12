using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Machine
    {
        [Key]
        public int MachineId { get; set; }
        public required string MachineName { get; set; }
        public string? MachineType { get; set; }
        public string? Location { get; set; }
        public int StatusId { get; set; }

        // Foreign key relationship
        public MachineStatus? Status { get; set; }
    }
}
