
using System.Net.Mail;
using FrekvensApi.Data;
using FrekvensApi.Models;

public class CheckRadioStatusService : BackgroundService
{
    private readonly ApplicationDbContext _context;
    private readonly HttpClient _httpClient;
    public IConfiguration Configuration { get; }

    public CheckRadioStatusService(ApplicationDbContext context, HttpClient httpClient, IConfiguration configuration)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
        Configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            await CheckRadioStatus(stoppingToken);
            await Task.Delay(TimeSpan.FromDays(1), stoppingToken);
        }
    }

    private async Task CheckRadioStatus(CancellationToken stoppingToken)
    {
        var stations = _context.Stations.ToList();

        var unavailableStations = new List<Station>();

        foreach (var station in stations)
        {

            try 
            {
                var response = _httpClient.GetAsync(station.StreamUrl).Result;
                response.EnsureSuccessStatusCode();
                station.IsAvailable = true;
            }
            catch (HttpRequestException)
            {
                unavailableStations.Add(station);
                station.IsAvailable = false;
            }
            
        }

        await SendEmailUpdate(unavailableStations);
        await _context.SaveChangesAsync(stoppingToken);
    }

    private async Task SendEmailUpdate(List<Station> unavailableStations)
    {
        if (unavailableStations.Count == 0)
        {
            return;
        }
    
        var client = new SmtpClient();
    
        var notificationsEmail = Configuration["NotificationsEmail"] ?? string.Empty;
        
        var message = new MailMessage
        {
            From = new MailAddress(notificationsEmail),
            Subject = "Radio station status update",
            Body = "The following stations are currently unavailable:\n- " + string.Join("\n- ", unavailableStations.Select(s => s.Name))
        };
    
        await client.SendMailAsync(message);
    }

}