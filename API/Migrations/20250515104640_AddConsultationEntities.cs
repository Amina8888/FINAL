using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class AddConsultationEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Consultations_CalendarSlots_CalendarSlotId",
                table: "Consultations");

            migrationBuilder.DropForeignKey(
                name: "FK_Consultations_Profiles_SpecialistId",
                table: "Consultations");

            migrationBuilder.DropIndex(
                name: "IX_Consultations_SpecialistId",
                table: "Consultations");

            migrationBuilder.DropColumn(
                name: "IsCompleted",
                table: "Consultations");

            migrationBuilder.DropColumn(
                name: "IsConfirmed",
                table: "Consultations");

            migrationBuilder.DropColumn(
                name: "IsPaid",
                table: "Consultations");

            migrationBuilder.DropColumn(
                name: "MeetingUrl",
                table: "Consultations");

            migrationBuilder.RenameColumn(
                name: "CalendarSlotId",
                table: "Consultations",
                newName: "ConsultantId");

            migrationBuilder.RenameIndex(
                name: "IX_Consultations_CalendarSlotId",
                table: "Consultations",
                newName: "IX_Consultations_ConsultantId");

            migrationBuilder.AddColumn<DateTime>(
                name: "EndTime",
                table: "Consultations",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<decimal>(
                name: "PricePaid",
                table: "Consultations",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<DateTime>(
                name: "StartTime",
                table: "Consultations",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Consultations",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "ConsultationRequests",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    SpecialistId = table.Column<Guid>(type: "uuid", nullable: false),
                    ConsultantId = table.Column<Guid>(type: "uuid", nullable: false),
                    ClientId = table.Column<Guid>(type: "uuid", nullable: false),
                    Topic = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    ScheduledAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    RequestedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    StatusChangedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ConsultationRequests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ConsultationRequests_Users_ClientId",
                        column: x => x.ClientId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ConsultationRequests_Users_ConsultantId",
                        column: x => x.ConsultantId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ConsultationRequests_ClientId",
                table: "ConsultationRequests",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_ConsultationRequests_ConsultantId",
                table: "ConsultationRequests",
                column: "ConsultantId");

            migrationBuilder.AddForeignKey(
                name: "FK_Consultations_Users_ConsultantId",
                table: "Consultations",
                column: "ConsultantId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Consultations_Users_ConsultantId",
                table: "Consultations");

            migrationBuilder.DropTable(
                name: "ConsultationRequests");

            migrationBuilder.DropColumn(
                name: "EndTime",
                table: "Consultations");

            migrationBuilder.DropColumn(
                name: "PricePaid",
                table: "Consultations");

            migrationBuilder.DropColumn(
                name: "StartTime",
                table: "Consultations");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Consultations");

            migrationBuilder.RenameColumn(
                name: "ConsultantId",
                table: "Consultations",
                newName: "CalendarSlotId");

            migrationBuilder.RenameIndex(
                name: "IX_Consultations_ConsultantId",
                table: "Consultations",
                newName: "IX_Consultations_CalendarSlotId");

            migrationBuilder.AddColumn<bool>(
                name: "IsCompleted",
                table: "Consultations",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsConfirmed",
                table: "Consultations",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsPaid",
                table: "Consultations",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "MeetingUrl",
                table: "Consultations",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Consultations_SpecialistId",
                table: "Consultations",
                column: "SpecialistId");

            migrationBuilder.AddForeignKey(
                name: "FK_Consultations_CalendarSlots_CalendarSlotId",
                table: "Consultations",
                column: "CalendarSlotId",
                principalTable: "CalendarSlots",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Consultations_Profiles_SpecialistId",
                table: "Consultations",
                column: "SpecialistId",
                principalTable: "Profiles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
