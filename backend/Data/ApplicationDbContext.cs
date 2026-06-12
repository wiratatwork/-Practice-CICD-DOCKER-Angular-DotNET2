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

        public DbSet<Item> Items { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Seed data
            modelBuilder.Entity<Item>().HasData(
                new Item { Id = 1, Name = "Item 1", Description = "Demo Item 1" },
                new Item { Id = 2, Name = "Item 2", Description = "Demo Item 2" }
            );
        }
    }
}
