using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.Extensions.Hosting;
using Serilog;
using SmartDev.Worker.Functions.Configuration;

try {
    var builder = FunctionsApplication.CreateBuilder(args);

    builder.AddHostServices();
    Log.Information("Starting SmartDev Worker Functions host");

    builder.Services.AddAppServices(builder.Configuration);

    var host = builder.Build();
    Log.Information("SmartDev Worker Functions host built");
    host.Run();
} catch (Exception exception) {
    Log.Fatal(exception, "SmartDev Worker Functions startup failed");
    throw;
} finally {
    Log.CloseAndFlush();
}
