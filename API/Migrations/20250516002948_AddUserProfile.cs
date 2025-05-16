using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class AddUserProfile : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ConsultationRequests_Users_ConsultantId",
                table: "ConsultationRequests");

            migrationBuilder.DropIndex(
                name: "IX_ConsultationRequests_ConsultantId",
                table: "ConsultationRequests");

            migrationBuilder.DropColumn(
                name: "ConsultantId",
                table: "ConsultationRequests");

            migrationBuilder.AddColumn<Guid>(
                name: "ConsultationId",
                table: "Reviews",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AlterColumn<decimal>(
                name: "PricePerConsultation",
                table: "Profiles",
                type: "numeric",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "numeric");

            migrationBuilder.AlterColumn<bool>(
                name: "IsApproved",
                table: "Profiles",
                type: "boolean",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "boolean");

            migrationBuilder.AddColumn<string>(
                name: "Topic",
                table: "Consultations",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "RejectionReason",
                table: "ConsultationRequests",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Licenses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ProfileId = table.Column<Guid>(type: "uuid", nullable: false),
                    FileUrl = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    UploadedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Licenses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Licenses_Profiles_ProfileId",
                        column: x => x.ProfileId,
                        principalTable: "Profiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ConsultationRequests_SpecialistId",
                table: "ConsultationRequests",
                column: "SpecialistId");

            migrationBuilder.CreateIndex(
                name: "IX_Licenses_ProfileId",
                table: "Licenses",
                column: "ProfileId");

            migrationBuilder.AddForeignKey(
                name: "FK_ConsultationRequests_Users_SpecialistId",
                table: "ConsultationRequests",
                column: "SpecialistId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ConsultationRequests_Users_SpecialistId",
                table: "ConsultationRequests");

            migrationBuilder.DropTable(
                name: "Licenses");

            migrationBuilder.DropIndex(
                name: "IX_ConsultationRequests_SpecialistId",
                table: "ConsultationRequests");

            migrationBuilder.DropColumn(
                name: "ConsultationId",
                table: "Reviews");

            migrationBuilder.DropColumn(
                name: "Topic",
                table: "Consultations");

            migrationBuilder.DropColumn(
                name: "RejectionReason",
                table: "ConsultationRequests");

            migrationBuilder.AlterColumn<decimal>(
                name: "PricePerConsultation",
                table: "Profiles",
                type: "numeric",
                nullable: false,
                defaultValue: 0m,
                oldClrType: typeof(decimal),
                oldType: "numeric",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsApproved",
                table: "Profiles",
                type: "boolean",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "boolean",
                oldNullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ConsultantId",
                table: "ConsultationRequests",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_ConsultationRequests_ConsultantId",
                table: "ConsultationRequests",
                column: "ConsultantId");

            migrationBuilder.AddForeignKey(
                name: "FK_ConsultationRequests_Users_ConsultantId",
                table: "ConsultationRequests",
                column: "ConsultantId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
