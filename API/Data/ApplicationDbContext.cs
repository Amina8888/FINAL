using Microsoft.EntityFrameworkCore;
using API.Models; // Заменить на твой namespace с моделями

namespace API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) {}

        public DbSet<User> Users => Set<User>();
        public DbSet<SpecialistProfile> SpecialistProfiles => Set<SpecialistProfile>();
        public DbSet<Consultation> Consultations => Set<Consultation>();
        public DbSet<CalendarSlot> CalendarSlots => Set<CalendarSlot>();
        public DbSet<Review> Reviews => Set<Review>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasOne(u => u.SpecialistProfile)
                .WithOne(p => p.User)
                .HasForeignKey<SpecialistProfile>(p => p.UserId);
        }
    }
}

