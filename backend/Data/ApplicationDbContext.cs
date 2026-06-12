using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<MachineStatus> MachineStatuses { get; set; }
        public DbSet<Machine> Machines { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Machine -> MachineStatus relationship
            modelBuilder.Entity<Machine>()
                .HasOne(m => m.Status)
                .WithMany(s => s.Machines)
                .HasForeignKey(m => m.StatusId);

            // Unique constraint on MachineName
            modelBuilder.Entity<Machine>()
                .HasIndex(m => m.MachineName)
                .IsUnique();

            // Unique constraint on StatusName
            modelBuilder.Entity<MachineStatus>()
                .HasIndex(s => s.StatusName)
                .IsUnique();
        }
    }
}
