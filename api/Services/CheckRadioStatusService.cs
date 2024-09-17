using System.Net.Http;
using FrekvensApi.Data;
using FrekvensApi.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

public class CheckRadioStatusService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly HttpClient _httpClient;
    public IConfiguration Configuration { get; }

    public CheckRadioStatusService(IServiceProvider serviceProvider, HttpClient httpClient, IConfiguration configuration)
    {
        _serviceProvider = serviceProvider ?? throw new ArgumentNullException(nameof(serviceProvider));
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
        using var scope = _serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        var stations = context.Stations.ToList();

        foreach (var station in stations)
        {
            bool isAvailable = await IsStreamUrlValid(station.StreamUrl);
            if (station.IsAvailable != isAvailable)
            {
                station.IsAvailable = isAvailable;
                context.Entry(station).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            }
        }

        await context.SaveChangesAsync();
    }

    private async Task<bool> IsStreamUrlValid(string streamUrl)
    {
        try
        {
            var request = new HttpRequestMessage(HttpMethod.Get, streamUrl);
            var response = await _httpClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead);

            if (!response.IsSuccessStatusCode)
            {

                return false;
            }

            return response.Content.Headers.ContentType != null &&
                   response.Content.Headers.ContentType.MediaType.StartsWith("audio/");
        }
        catch
        {
            return false;
        }
    }
}