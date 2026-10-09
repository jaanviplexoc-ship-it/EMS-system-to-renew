using EmployeeApp.Api.data;
using EmployeeApp.Api.repositories;
using EmployeeApp.Api.services;
using EmployeeApp.Api.models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using EmployeeApp.Api.Services;

// JWT
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddProblemDetails();


// ===============================
// Authentication
// ===============================

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var jwtKey = builder.Configuration["Jwt:Key"];

        if (string.IsNullOrWhiteSpace(jwtKey))
        {
            throw new InvalidOperationException(
                "JWT key is not configured."
            );
        }

        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuer = true,

                ValidateAudience = true,

                ValidateLifetime = true,

                ValidateIssuerSigningKey = true,

                ValidIssuer =
                    builder.Configuration["Jwt:Issuer"],

                ValidAudience =
                    builder.Configuration["Jwt:Audience"],

                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(jwtKey)
                    ),

                // Don't allow expired tokens because of clock difference.
                ClockSkew = TimeSpan.Zero
            };
    });


// ===============================
// Authorization
// ===============================

builder.Services.AddAuthorization();


// ===============================
// Swagger
// ===============================

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition(
        "Bearer",
        new OpenApiSecurityScheme
        {
            Name = "Authorization",

            Type = SecuritySchemeType.Http,

            Scheme = "Bearer",

            BearerFormat = "JWT",

            In = ParameterLocation.Header,

            Description =
                "Enter your JWT token."
        }
    );

    c.AddSecurityRequirement(
        new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference =
                        new OpenApiReference
                        {
                            Type =
                                ReferenceType.SecurityScheme,

                            Id = "Bearer"
                        }
                },

                Array.Empty<string>()
            }
        }
    );
});


// ===============================
// Database
// ===============================

builder.Services.AddDbContext<EmployeeDbContext>(
    options =>
        options.UseSqlServer(
            builder.Configuration
                .GetConnectionString("DefaultConnection")
        )
);


// ===============================
// CORS
// ===============================

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "reactPolicy",
        policy =>
        {
            policy
                .WithOrigins("http://localhost:5173")
                .AllowAnyHeader()
                .AllowAnyMethod();
        }
    );
});


// ===============================
// Repositories
// ===============================

builder.Services.AddScoped<
    IDepartmentRepository,
    DepartmentRepository>();

builder.Services.AddScoped<
    IDesignationRepository,
    DesignationRepository>();

builder.Services.AddScoped<
    IEmployeeRepository,
    EmployeeRepository>();


// ===============================
// Services
// ===============================

builder.Services.AddScoped<
    IDepartmentService,
    DepartmentService>();

builder.Services.AddScoped<
    IDesignationService,
    DesignationService>();

builder.Services.AddScoped<
    IEmployeeService,
    EmployeeService>();

builder.Services.AddScoped<
    IAuthService,
    AuthService>();

builder.Services.AddScoped<
    IAttendanceService,
    AttendanceService>();

builder.Services.AddScoped<
    ILeaveService,
    LeaveService>();

builder.Services.AddScoped<
    IDashboardService,
    DashboardService>();


// ===============================
// Password Hasher
// ===============================

builder.Services.AddScoped<PasswordHasher<User>>();


var app = builder.Build();
app.UseExceptionHandler();


// ===============================
// Middleware
// ===============================

app.UseCors("reactPolicy");

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();


// ===============================
// Swagger
// ===============================

app.UseSwagger();

app.UseSwaggerUI();


// ===============================
// Controllers
// ===============================
app.MapControllers();

app.Run();