using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace Sage.AccountingKeyPayIntegrationPOC.Migrations
{
    public partial class ChangeFieldLength : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RefresherToken",
                table: "KPUser");

            migrationBuilder.AlterColumn<string>(
                name: "KPApiKey",
                table: "KPUser",
                maxLength: 128,
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 32);

            migrationBuilder.CreateIndex(
                name: "IX_KPUser_KPApiKey",
                table: "KPUser",
                column: "KPApiKey",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_KPUser_KPApiKey",
                table: "KPUser");

            migrationBuilder.AlterColumn<string>(
                name: "KPApiKey",
                table: "KPUser",
                maxLength: 32,
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 128);

            migrationBuilder.AddColumn<string>(
                name: "RefresherToken",
                table: "KPUser",
                maxLength: 64,
                nullable: true);
        }
    }
}
