using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MachinesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MachinesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetMachines()
        {
            var machines = await _context.Machines
                .Include(m => m.Status)
                .Select(m => new
                {
                    m.MachineId,
                    m.MachineName,
                    m.MachineType,
                    m.Location,
                    m.StatusId,
                    StatusName = m.Status!.StatusName
                })
                .ToListAsync();

            return machines;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetMachine(int id)
        {
            var machine = await _context.Machines
                .Include(m => m.Status)
                .Where(m => m.MachineId == id)
                .Select(m => new
                {
                    m.MachineId,
                    m.MachineName,
                    m.MachineType,
                    m.Location,
                    m.StatusId,
                    StatusName = m.Status!.StatusName
                })
                .FirstOrDefaultAsync();

            if (machine == null)
                return NotFound();

            return machine;
        }

        [HttpPost]
        public async Task<ActionResult<Machine>> CreateMachine(CreateMachineRequest request)
        {
            // Validate StatusId exists
            var statusExists = await _context.MachineStatuses.AnyAsync(s => s.StatusId == request.StatusId);
            if (!statusExists)
                return BadRequest("Invalid StatusId");

            var machine = new Machine
            {
                MachineName = request.MachineName,
                MachineType = request.MachineType,
                Location = request.Location,
                StatusId = request.StatusId
            };

            _context.Machines.Add(machine);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMachine", new { id = machine.MachineId }, machine);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMachine(int id, UpdateMachineRequest request)
        {
            var machine = await _context.Machines.FindAsync(id);
            if (machine == null)
                return NotFound();

            // Validate StatusId if changed
            if (request.StatusId != machine.StatusId)
            {
                var statusExists = await _context.MachineStatuses.AnyAsync(s => s.StatusId == request.StatusId);
                if (!statusExists)
                    return BadRequest("Invalid StatusId");
            }

            machine.MachineName = request.MachineName;
            machine.MachineType = request.MachineType;
            machine.Location = request.Location;
            machine.StatusId = request.StatusId;

            _context.Entry(machine).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMachine(int id)
        {
            var machine = await _context.Machines.FindAsync(id);
            if (machine == null)
                return NotFound();

            _context.Machines.Remove(machine);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    public class CreateMachineRequest
    {
        public required string MachineName { get; set; }
        public string? MachineType { get; set; }
        public string? Location { get; set; }
        public int StatusId { get; set; }
    }

    public class UpdateMachineRequest
    {
        public required string MachineName { get; set; }
        public string? MachineType { get; set; }
        public string? Location { get; set; }
        public int StatusId { get; set; }
    }
}
