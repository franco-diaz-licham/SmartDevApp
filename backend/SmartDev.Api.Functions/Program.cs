using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.Extensions.Hosting;
using Serilog;
using SmartDev.Api.Functions.Configuration;
using SmartDev.Api.Functions.Configuration.Middleware;

try {
    var builder = FunctionsApplication.CreateBuilder(args);

    builder.AddHostServices();
    builder.UseMiddleware<HttpCorsMiddleware>();
    builder.UseMiddleware<HttpRateLimitingMiddleware>();

    Log.Information("Starting SmartDev API Functions host");
    builder.Services.AddAppServices(builder.Configuration, builder.Environment);

    var host = builder.Build();
    Log.Information("SmartDev API Functions host built");
    host.Run();
} catch (Exception exception) {
    Log.Fatal(exception, "SmartDev API Functions startup failed");
    throw;
} finally {
    Log.CloseAndFlush();
}
