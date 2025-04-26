using Microsoft.EntityFrameworkCore;
using API.Models;
using API.Services;

namespace API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) {}

        public DbSet<User> Users => Set<User>();
        public DbSet<SpecialistProfile> SpecialistProfile => Set<SpecialistProfile>();
        public DbSet<Consultation> Consultations => Set<Consultation>();
        public DbSet<CalendarSlot> CalendarSlots => Set<CalendarSlot>();
        public DbSet<Review> Review => Set<Review>();

        public DbSet<ChatMessage> ChatMessages => Set<ChatMessage>();
        public DbSet<ScheduledCall> ScheduledCalls => Set<ScheduledCall>();

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

            modelBuilder.Entity<Consultation>()
                .HasOne(c => c.Client)
                .WithMany()
                .HasForeignKey(c => c.ClientId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Consultation>()
                .HasOne(c => c.Specialist)
                .WithMany()
                .HasForeignKey(c => c.SpecialistId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}

