namespace API.Models
{
    public class Warehouse
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string StreetName { get; set; } = null!;
        public int HouseNumber { get; set;}
        public string ZipCode { get; set; } = null!;
        public string City { get; set; } = null!;
        public string State { get; set; } = null!;
        public int Capacity { get; set; }

    }
}