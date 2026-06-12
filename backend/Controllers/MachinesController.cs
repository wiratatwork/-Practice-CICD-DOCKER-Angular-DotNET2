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

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<object>>> SearchMachines([FromQuery] string? name)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                return await GetMachines();
            }

            var machines = await _context.Machines
                .Include(m => m.Status)
                .Where(m => m.MachineName.Contains(name))
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
            // Validate all required fields
            if (string.IsNullOrWhiteSpace(request.MachineName))
                return BadRequest(new { error = "Machine Name is required" });

            if (string.IsNullOrWhiteSpace(request.MachineType))
                return BadRequest(new { error = "Machine Type is required" });

            if (string.IsNullOrWhiteSpace(request.Location))
                return BadRequest(new { error = "Location is required" });

            // Check for duplicate MachineName
            var existingMachine = await _context.Machines
                .AnyAsync(m => m.MachineName == request.MachineName);
            if (existingMachine)
                return BadRequest(new { error = "Machine Name already exists" });

            // Validate StatusId exists
            var statusExists = await _context.MachineStatuses.AnyAsync(s => s.StatusId == request.StatusId);
            if (!statusExists)
                return BadRequest(new { error = "Invalid StatusId" });

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

            // Validate all required fields
            if (string.IsNullOrWhiteSpace(request.MachineName))
                return BadRequest(new { error = "Machine Name is required" });

            if (string.IsNullOrWhiteSpace(request.MachineType))
                return BadRequest(new { error = "Machine Type is required" });

            if (string.IsNullOrWhiteSpace(request.Location))
                return BadRequest(new { error = "Location is required" });

            // Check for duplicate MachineName (excluding current machine)
            if (request.MachineName != machine.MachineName)
            {
                var duplicateMachine = await _context.Machines
                    .AnyAsync(m => m.MachineName == request.MachineName);
                if (duplicateMachine)
                    return BadRequest(new { error = "Machine Name already exists" });
            }

            // Validate StatusId if changed
            if (request.StatusId != machine.StatusId)
            {
                var statusExists = await _context.MachineStatuses.AnyAsync(s => s.StatusId == request.StatusId);
                if (!statusExists)
                    return BadRequest(new { error = "Invalid StatusId" });
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

        [HttpGet("statuses")]
        public async Task<ActionResult<IEnumerable<object>>> GetMachineStatuses()
        {
            var statuses = await _context.MachineStatuses
                .OrderBy(s => s.StatusId)
                .Select(s => new
                {
                    s.StatusId,
                    s.StatusName
                })
                .ToListAsync();

            return statuses;
        }
    }

    public class CreateMachineRequest
    {
        public required string MachineName { get; set; }
        public required string MachineType { get; set; }
        public required string Location { get; set; }
        public int StatusId { get; set; }
    }

    public class UpdateMachineRequest
    {
        public required string MachineName { get; set; }
        public required string MachineType { get; set; }
        public required string Location { get; set; }
        public int StatusId { get; set; }
    }
}
