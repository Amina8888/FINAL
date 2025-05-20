using Microsoft.EntityFrameworkCore;
using API.Models; // Заменить на твой namespace с моделями

namespace API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) {}

        public DbSet<User> Users => Set<User>();
        public DbSet<Profile> Profiles => Set<Profile>();
        public DbSet<Consultation> Consultations => Set<Consultation>();
        public DbSet<CalendarSlot> CalendarSlots => Set<CalendarSlot>();
        public DbSet<Review> Reviews => Set<Review>();
        public DbSet<WorkExperience> WorkExperiences { get; set; }
        public DbSet<Conversation> Conversations { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<ConsultationRequest> ConsultationRequests { get; set; }
        public DbSet<License> Licenses { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasOne(u => u.Profile)
                .WithOne(p => p.User)
                .HasForeignKey<Profile>(p => p.UserId);
            
            modelBuilder.Entity<Conversation>()
                .HasMany(c => c.Messages)
                .WithOne(m => m.Conversation)
                .HasForeignKey(m => m.ConversationId);
            
            modelBuilder.Entity<Review>()
                .HasOne(r => r.Specialist)
                .WithMany()
                .HasForeignKey(r => r.SpecialistId);

        }
    }
}

