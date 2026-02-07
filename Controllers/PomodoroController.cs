using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PomodoroAPP.Data;
using PomodoroAPP.Models;
using PomodoroAPP.Models.Entities;
using PomodoroAPP.Models.Enum;

namespace PomodoroAPP.Controllers
{
	public class PomodoroController : Controller
	{
		private readonly ILogger<PomodoroController> _logger;
		private readonly AppDbContext _context;

		public PomodoroController(ILogger<PomodoroController> logger, AppDbContext context)
		{
			_logger = logger;
			_context = context;
		}

		public async Task<IActionResult> Index()
		{
			int dailyCount = await _context.PomodoroRecords
				.Where(x => x.FinishedAt.Date == DateTime.Today)
				.CountAsync();

			PomodoroModel model = new PomodoroModel(){
				Minutes = 25,
				Seconds = 0,
				RestTime = 5,
				Status = $"Completed Today: {dailyCount}.", 
				CurrentMode = PomodoroMode.Focus
			};

			return View(model);
		}

		[HttpPost]
		public async Task<IActionResult> FinishPomodoro()
		{
			try
			{
				var record = new PomodoroRecord
				{
					FinishedAt = DateTime.Now,
					DurationMinutes = 25
				};

				_context.PomodoroRecords.Add(record);
				await _context.SaveChangesAsync();

				int totalCount = await _context.PomodoroRecords.CountAsync();

				return Json(new { success = true, totalFocusCount = totalCount });
			}
			catch (Exception ex)
			{
				return Json(new { success = false, message = ex.Message });
			}
		}

		public IActionResult Privacy()
		{
			return View();
		}

		[ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
		public IActionResult Error()
		{
			return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
		}
	}
}
