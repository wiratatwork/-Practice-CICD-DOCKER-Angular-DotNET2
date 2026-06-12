using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class MachineStatus
    {
        [Key]
        public int StatusId { get; set; }
        public required string StatusName { get; set; }

        // Navigation property
        public ICollection<Machine> Machines { get; set; } = new List<Machine>();
    }
}
