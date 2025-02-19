namespace API.Models
{
    public class UserAccount
    {
        public int Id { get; set; }
        public string? FirstName { get; set; }  // First Name field
        public string? LastName { get; set; }   // Last Name field
        public string? Email { get; set; }      // Email used as a username
        public string? PasswordHash { get; set; }
    }
}
