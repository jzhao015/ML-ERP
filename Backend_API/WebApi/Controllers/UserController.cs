using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using WebApi.Models;
using System.Text.Json;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private static List<User> users = new List<User>(); // In-memory store
        private const string filePath = "users.json"; // File path for user data

        public UserController()
        {
            LoadUsersFromFile(); // Load users from file on startup
        }

        private void LoadUsersFromFile()
        {
            if (System.IO.File.Exists(filePath))
            {
                var json = System.IO.File.ReadAllText(filePath);
                users = JsonSerializer.Deserialize<List<User>>(json) ?? new List<User>();
            }
        }

        private void SaveUsersToFile()
        {
            var json = JsonSerializer.Serialize(users);
            System.IO.File.WriteAllText(filePath, json);
        }

        // Registration endpoint
        [HttpPost("register")]
        public IActionResult Register([FromBody] User user)
        {
            if (users.Any(u => u.Username == user.Username))
            {
                return BadRequest("User already exists");
            }

            
            user.PasswordHash = user.PasswordHash; 
            users.Add(user);
            SaveUsersToFile(); // Save users to file after registration
            return CreatedAtAction(nameof(Register), new { id = user.UserId }, user);
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] User loginUser)
        {
            var user = users.FirstOrDefault(u => u.Username == loginUser.Username);
            if (user == null || user.PasswordHash != loginUser.PasswordHash) // Replace with actual password verification
            {
                return Unauthorized("Invalid username or password");
            }

            return Ok("Login successful"); // Return success message
        }

        // Get all users
        [HttpGet("users")]
        public IActionResult GetAllUsers()
        {
            return Ok(users); // Return the list of users
        }
    }
} 