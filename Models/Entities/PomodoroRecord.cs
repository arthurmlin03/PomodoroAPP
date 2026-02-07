using System.ComponentModel.DataAnnotations;

namespace PomodoroAPP.Models.Entities
{
	public class PomodoroRecord
	{
		[Key]
		public int Id { get; set; }
		public DateTime FinishedAt{ get; set; }
		public int DurationMinutes { get; set; }
	}
}
