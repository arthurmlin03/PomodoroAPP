using Microsoft.EntityFrameworkCore;
using PomodoroAPP.Models.Entities;

namespace PomodoroAPP.Data
{
	public class AppDbContext : DbContext
	{
		public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) 
		{
		}

		public DbSet<PomodoroRecord> PomodoroRecords { get; set; }
	}
}
