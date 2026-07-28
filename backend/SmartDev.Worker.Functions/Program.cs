using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.Extensions.Hosting;
using SmartDev.Worker.Functions.Configuration;

var builder = FunctionsApplication.CreateBuilder(args);

builder.AddHostServices();
builder.Services.AddAppServices(builder.Configuration);
builder.Build().Run();
