using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace SmartDev.Api.Functions.Configuration;

public static class ApiAppServices
{
    public static IServiceCollection AddAppServices(this IServiceCollection services, IConfiguration configuration)
    {


        return services;
    }
}
