using PomodoroAPP.Models.Enum;

namespace PomodoroAPP.Models
{
	public class PomodoroModel
	{
		public int Minutes { get; set; }
		public int Seconds { get; set; }
		public int RestTime { get; set; }
		public string? Status { get; set; }
		public PomodoroMode CurrentMode { get; set; }
	}
}
