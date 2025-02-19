using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class NewAuthMig : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Username",
                table: "UserAccounts",
                newName: "LastName");

            migrationBuilder.RenameColumn(
                name: "Fullname",
                table: "UserAccounts",
                newName: "FirstName");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "UserAccounts",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "UserAccounts",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Email", "FirstName", "LastName" },
                values: new object[] { "admin@example.com", "Admin", "User" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Email",
                table: "UserAccounts");

            migrationBuilder.RenameColumn(
                name: "LastName",
                table: "UserAccounts",
                newName: "Username");

            migrationBuilder.RenameColumn(
                name: "FirstName",
                table: "UserAccounts",
                newName: "Fullname");

            migrationBuilder.UpdateData(
                table: "UserAccounts",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Fullname", "Username" },
                values: new object[] { "Administrator", "admin" });
        }
    }
}
