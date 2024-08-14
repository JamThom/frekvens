using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FrekvensApi.Migrations
{
    /// <inheritdoc />
    public partial class UpdateIntToGuid : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "NewId",
                table: "Genres",
                type: "TEXT",
                defaultValueSql: $"'{Guid.NewGuid().ToString()}'",
                nullable: false);

            migrationBuilder.Sql("UPDATE Genres SET NewId = lower(hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-' || '4' || substr(hex(randomblob(2)),2) || '-' || substr('89AB', abs(random()) % 4 + 1, 1) || substr(hex(randomblob(2)),2) || '-' || hex(randomblob(6)))");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "Genres");

            migrationBuilder.RenameColumn(
                name: "NewId",
                table: "Genres",
                newName: "Id");
                
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Add the old int column back
            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "Genres",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            // Drop the new Guid column
            migrationBuilder.DropColumn(
                name: "Id",
                table: "Genres");

            // Rename the old int column back to the original column name
            migrationBuilder.RenameColumn(
                name: "NewId",
                table: "Genres",
                newName: "Id");
        }
    }
}
