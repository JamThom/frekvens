using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FrekvensApi.Migrations
{
    /// <inheritdoc />
    public partial class AddGenreToStation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "GenreId",
                table: "Stations",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Genres",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Genres", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Stations_GenreId",
                table: "Stations",
                column: "GenreId");

            migrationBuilder.AddForeignKey(
                name: "FK_Stations_Genres_GenreId",
                table: "Stations",
                column: "GenreId",
                principalTable: "Genres",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Stations_Genres_GenreId",
                table: "Stations");

            migrationBuilder.DropTable(
                name: "Genres");

            migrationBuilder.DropIndex(
                name: "IX_Stations_GenreId",
                table: "Stations");

            migrationBuilder.DropColumn(
                name: "GenreId",
                table: "Stations");
        }
    }
}
