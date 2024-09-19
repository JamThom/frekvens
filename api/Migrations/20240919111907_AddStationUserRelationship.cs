using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FrekvensApi.Migrations
{
    /// <inheritdoc />
    public partial class AddStationUserRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Add CreatedById columns without default values
            migrationBuilder.AddColumn<string>(
                name: "CreatedById",
                table: "Stations",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CreatedById",
                table: "Genres",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Discriminator",
                table: "AspNetUsers",
                type: "TEXT",
                maxLength: 21,
                nullable: false,
                defaultValue: "");

            // Retrieve the first user ID from AspNetUsers table
            // Note: This part should be done manually or through a separate script
            var firstUserId = "6bf0b1b2-f954-4888-82ba-c75b6ede7d0a"; // Replace with actual user ID

            // Update existing data to have valid CreatedById values
            if (!string.IsNullOrEmpty(firstUserId))
            {
                migrationBuilder.Sql($"UPDATE Stations SET CreatedById = '{firstUserId}' WHERE CreatedById IS NULL");
                migrationBuilder.Sql($"UPDATE Genres SET CreatedById = '{firstUserId}' WHERE CreatedById IS NULL");
            }

            // Alter columns to be non-nullable
            migrationBuilder.AlterColumn<string>(
                name: "CreatedById",
                table: "Stations",
                type: "TEXT",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CreatedById",
                table: "Genres",
                type: "TEXT",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);

            // Create indexes
            migrationBuilder.CreateIndex(
                name: "IX_Stations_CreatedById",
                table: "Stations",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_Genres_CreatedById",
                table: "Genres",
                column: "CreatedById");

            // Add foreign key constraints
            migrationBuilder.AddForeignKey(
                name: "FK_Genres_AspNetUsers_CreatedById",
                table: "Genres",
                column: "CreatedById",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Stations_AspNetUsers_CreatedById",
                table: "Stations",
                column: "CreatedById",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Genres_AspNetUsers_CreatedById",
                table: "Genres");

            migrationBuilder.DropForeignKey(
                name: "FK_Stations_AspNetUsers_CreatedById",
                table: "Stations");

            migrationBuilder.DropIndex(
                name: "IX_Stations_CreatedById",
                table: "Stations");

            migrationBuilder.DropIndex(
                name: "IX_Genres_CreatedById",
                table: "Genres");

            migrationBuilder.DropColumn(
                name: "CreatedById",
                table: "Stations");

            migrationBuilder.DropColumn(
                name: "CreatedById",
                table: "Genres");

            migrationBuilder.DropColumn(
                name: "Discriminator",
                table: "AspNetUsers");
        }
    }
}