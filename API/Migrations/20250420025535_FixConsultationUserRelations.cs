using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class FixConsultationUserRelations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CalendarSlots_SpecialistProfiles_SpecialistId",
                table: "CalendarSlots");

            migrationBuilder.DropForeignKey(
                name: "FK_Consultations_SpecialistProfiles_SpecialistId",
                table: "Consultations");

            migrationBuilder.DropForeignKey(
                name: "FK_Consultations_Users_ClientId",
                table: "Consultations");

            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_SpecialistProfiles_SpecialistId",
                table: "Reviews");

            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_Users_ClientId",
                table: "Reviews");

            migrationBuilder.DropForeignKey(
                name: "FK_SpecialistProfiles_Users_UserId",
                table: "SpecialistProfiles");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SpecialistProfiles",
                table: "SpecialistProfiles");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Reviews",
                table: "Reviews");

            migrationBuilder.RenameTable(
                name: "SpecialistProfiles",
                newName: "SpecialistProfile");

            migrationBuilder.RenameTable(
                name: "Reviews",
                newName: "Review");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Consultations",
                newName: "ConsultationId");

            migrationBuilder.RenameIndex(
                name: "IX_SpecialistProfiles_UserId",
                table: "SpecialistProfile",
                newName: "IX_SpecialistProfile_UserId");

            migrationBuilder.RenameColumn(
                name: "Text",
                table: "Review",
                newName: "FullText");

            migrationBuilder.RenameIndex(
                name: "IX_Reviews_SpecialistId",
                table: "Review",
                newName: "IX_Review_SpecialistId");

            migrationBuilder.RenameIndex(
                name: "IX_Reviews_ClientId",
                table: "Review",
                newName: "IX_Review_ClientId");

            migrationBuilder.AddColumn<string>(
                name: "About",
                table: "Users",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "AverageRating",
                table: "Users",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "FullName",
                table: "Users",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsApproved",
                table: "Users",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "PayPalEmail",
                table: "Users",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "PricePerConsultation",
                table: "Users",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Consultations",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Consultations",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "IsConfirmed",
                table: "Consultations",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsRejected",
                table: "Consultations",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "ScheduledAt",
                table: "Consultations",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "Consultations",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "UserId1",
                table: "Consultations",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "AverageRating",
                table: "SpecialistProfile",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "SpecialistProfile",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "SpecialistProfile",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsApproved",
                table: "SpecialistProfile",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "ProfileImageUrl",
                table: "SpecialistProfile",
                type: "text",
                nullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "Rating",
                table: "Review",
                type: "numeric",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<Guid>(
                name: "ConsultationId",
                table: "Review",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddPrimaryKey(
                name: "PK_SpecialistProfile",
                table: "SpecialistProfile",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Review",
                table: "Review",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "ChatMessages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    SenderId = table.Column<Guid>(type: "uuid", nullable: false),
                    ReceiverId = table.Column<Guid>(type: "uuid", nullable: false),
                    ConsultationId = table.Column<Guid>(type: "uuid", nullable: false),
                    Message = table.Column<string>(type: "text", nullable: false),
                    Timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChatMessages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ChatMessages_Consultations_ConsultationId",
                        column: x => x.ConsultationId,
                        principalTable: "Consultations",
                        principalColumn: "ConsultationId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ScheduledCalls",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    SpecialistId = table.Column<Guid>(type: "uuid", nullable: false),
                    StartTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ScheduledCalls", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Consultations_UserId",
                table: "Consultations",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Consultations_UserId1",
                table: "Consultations",
                column: "UserId1");

            migrationBuilder.CreateIndex(
                name: "IX_Review_ConsultationId",
                table: "Review",
                column: "ConsultationId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ChatMessages_ConsultationId",
                table: "ChatMessages",
                column: "ConsultationId");

            migrationBuilder.AddForeignKey(
                name: "FK_CalendarSlots_SpecialistProfile_SpecialistId",
                table: "CalendarSlots",
                column: "SpecialistId",
                principalTable: "SpecialistProfile",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Consultations_Users_ClientId",
                table: "Consultations",
                column: "ClientId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Consultations_Users_SpecialistId",
                table: "Consultations",
                column: "SpecialistId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Consultations_Users_UserId",
                table: "Consultations",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Consultations_Users_UserId1",
                table: "Consultations",
                column: "UserId1",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Review_Consultations_ConsultationId",
                table: "Review",
                column: "ConsultationId",
                principalTable: "Consultations",
                principalColumn: "ConsultationId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Review_SpecialistProfile_SpecialistId",
                table: "Review",
                column: "SpecialistId",
                principalTable: "SpecialistProfile",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Review_Users_ClientId",
                table: "Review",
                column: "ClientId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SpecialistProfile_Users_UserId",
                table: "SpecialistProfile",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CalendarSlots_SpecialistProfile_SpecialistId",
                table: "CalendarSlots");

            migrationBuilder.DropForeignKey(
                name: "FK_Consultations_Users_ClientId",
                table: "Consultations");

            migrationBuilder.DropForeignKey(
                name: "FK_Consultations_Users_SpecialistId",
                table: "Consultations");

            migrationBuilder.DropForeignKey(
                name: "FK_Consultations_Users_UserId",
                table: "Consultations");

            migrationBuilder.DropForeignKey(
                name: "FK_Consultations_Users_UserId1",
                table: "Consultations");

            migrationBuilder.DropForeignKey(
                name: "FK_Review_Consultations_ConsultationId",
                table: "Review");

            migrationBuilder.DropForeignKey(
                name: "FK_Review_SpecialistProfile_SpecialistId",
                table: "Review");

            migrationBuilder.DropForeignKey(
                name: "FK_Review_Users_ClientId",
                table: "Review");

            migrationBuilder.DropForeignKey(
                name: "FK_SpecialistProfile_Users_UserId",
                table: "SpecialistProfile");

            migrationBuilder.DropTable(
                name: "ChatMessages");

            migrationBuilder.DropTable(
                name: "ScheduledCalls");

            migrationBuilder.DropIndex(
                name: "IX_Consultations_UserId",
                table: "Consultations");

            migrationBuilder.DropIndex(
                name: "IX_Consultations_UserId1",
                table: "Consultations");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SpecialistProfile",
                table: "SpecialistProfile");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Review",
                table: "Review");

            migrationBuilder.DropIndex(
                name: "IX_Review_ConsultationId",
                table: "Review");

            migrationBuilder.DropColumn(
                name: "About",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "AverageRating",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "FullName",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "IsApproved",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "PayPalEmail",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "PricePerConsultation",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Consultations");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Consultations");

            migrationBuilder.DropColumn(
                name: "IsConfirmed",
                table: "Consultations");

            migrationBuilder.DropColumn(
                name: "IsRejected",
                table: "Consultations");

            migrationBuilder.DropColumn(
                name: "ScheduledAt",
                table: "Consultations");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Consultations");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "Consultations");

            migrationBuilder.DropColumn(
                name: "AverageRating",
                table: "SpecialistProfile");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "SpecialistProfile");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "SpecialistProfile");

            migrationBuilder.DropColumn(
                name: "IsApproved",
                table: "SpecialistProfile");

            migrationBuilder.DropColumn(
                name: "ProfileImageUrl",
                table: "SpecialistProfile");

            migrationBuilder.DropColumn(
                name: "ConsultationId",
                table: "Review");

            migrationBuilder.RenameTable(
                name: "SpecialistProfile",
                newName: "SpecialistProfiles");

            migrationBuilder.RenameTable(
                name: "Review",
                newName: "Reviews");

            migrationBuilder.RenameColumn(
                name: "ConsultationId",
                table: "Consultations",
                newName: "Id");

            migrationBuilder.RenameIndex(
                name: "IX_SpecialistProfile_UserId",
                table: "SpecialistProfiles",
                newName: "IX_SpecialistProfiles_UserId");

            migrationBuilder.RenameColumn(
                name: "FullText",
                table: "Reviews",
                newName: "Text");

            migrationBuilder.RenameIndex(
                name: "IX_Review_SpecialistId",
                table: "Reviews",
                newName: "IX_Reviews_SpecialistId");

            migrationBuilder.RenameIndex(
                name: "IX_Review_ClientId",
                table: "Reviews",
                newName: "IX_Reviews_ClientId");

            migrationBuilder.AlterColumn<int>(
                name: "Rating",
                table: "Reviews",
                type: "integer",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SpecialistProfiles",
                table: "SpecialistProfiles",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Reviews",
                table: "Reviews",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_CalendarSlots_SpecialistProfiles_SpecialistId",
                table: "CalendarSlots",
                column: "SpecialistId",
                principalTable: "SpecialistProfiles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Consultations_SpecialistProfiles_SpecialistId",
                table: "Consultations",
                column: "SpecialistId",
                principalTable: "SpecialistProfiles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Consultations_Users_ClientId",
                table: "Consultations",
                column: "ClientId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_SpecialistProfiles_SpecialistId",
                table: "Reviews",
                column: "SpecialistId",
                principalTable: "SpecialistProfiles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_Users_ClientId",
                table: "Reviews",
                column: "ClientId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SpecialistProfiles_Users_UserId",
                table: "SpecialistProfiles",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
