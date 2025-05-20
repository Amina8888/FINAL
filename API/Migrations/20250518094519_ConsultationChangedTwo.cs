using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class ConsultationChangedTwo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Consultations_Users_ConsultantId",
                table: "Consultations");

            migrationBuilder.DropIndex(
                name: "IX_Consultations_ConsultantId",
                table: "Consultations");

            migrationBuilder.DropColumn(
                name: "ConsultantId",
                table: "Consultations");

            migrationBuilder.CreateIndex(
                name: "IX_Consultations_SpecialistId",
                table: "Consultations",
                column: "SpecialistId");

            migrationBuilder.AddForeignKey(
                name: "FK_Consultations_Users_SpecialistId",
                table: "Consultations",
                column: "SpecialistId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Consultations_Users_SpecialistId",
                table: "Consultations");

            migrationBuilder.DropIndex(
                name: "IX_Consultations_SpecialistId",
                table: "Consultations");

            migrationBuilder.AddColumn<Guid>(
                name: "ConsultantId",
                table: "Consultations",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Consultations_ConsultantId",
                table: "Consultations",
                column: "ConsultantId");

            migrationBuilder.AddForeignKey(
                name: "FK_Consultations_Users_ConsultantId",
                table: "Consultations",
                column: "ConsultantId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
