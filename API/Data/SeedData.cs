using API.Models;

namespace API.Data
{
    public static class SeedData
    {
        public static void Initialize(IServiceProvider serviceProvider, AppDbContext context)
        {
            context.Database.EnsureCreated();

            if (context.Warehouses.Any() && context.Products.Any() && context.InventoryRecords.Any())
                return;

            var warehouses = new Warehouse[]
            {
                new Warehouse { Name = "Skladišče 1", StreetName = "Glavna cesta", HouseNumber = 12, ZipCode = "1000", City = "Ljubljana", State = "Slovenija", Capacity = 1000 },
                new Warehouse { Name = "Skladišče 2", StreetName = "Parkova cesta", HouseNumber = 45, ZipCode = "1000", City = "Ljubljana", State = "Slovenija", Capacity = 800 },
                new Warehouse { Name = "Skladišče 3", StreetName = "Rečna ulica", HouseNumber = 21, ZipCode = "1000", City = "Ljubljana", State = "Slovenija", Capacity = 1200 },
                new Warehouse { Name = "Skladišče 4", StreetName = "Hrastova avenija", HouseNumber = 10, ZipCode = "4000", City = "Kranj", State = "Slovenija", Capacity = 1100 },
                new Warehouse { Name = "Skladišče 5", StreetName = "Gorska cesta", HouseNumber = 8, ZipCode = "8000", City = "Novo Mesto", State = "Slovenija", Capacity = 900 },
                new Warehouse { Name = "Skladišče 6", StreetName = "Sončna boulevard", HouseNumber = 7, ZipCode = "6000", City = "Koper", State = "Slovenija", Capacity = 1300 },
                new Warehouse { Name = "Skladišče 7", StreetName = "Vrhovna ulica", HouseNumber = 2, ZipCode = "8000", City = "Novo Mesto", State = "Slovenija", Capacity = 950 },
                new Warehouse { Name = "Skladišče 8", StreetName = "Obalna ulica", HouseNumber = 5, ZipCode = "6000", City = "Koper", State = "Slovenija", Capacity = 1050 },
                new Warehouse { Name = "Skladišče 9", StreetName = "Gozdna pot", HouseNumber = 3, ZipCode = "1000", City = "Ljubljana", State = "Slovenija", Capacity = 850 },
                new Warehouse { Name = "Skladišče 10", StreetName = "Javorova ulica", HouseNumber = 15, ZipCode = "4000", City = "Kranj", State = "Slovenija", Capacity = 1150 }
            };

            context.Warehouses.AddRange(warehouses);
            context.SaveChanges();

            var products = new Product[100];
            for (int i = 0; i < 100; i++)
            {
                products[i] = new Product
                {
                    Name = $"Izdelek {i + 1}",
                    Description = $"Opis za izdelek {i + 1}",
                    Price = new Random().Next(5, 200)
                };
            }

            context.Products.AddRange(products);
            context.SaveChanges();

            var inventoryRecords = new InventoryRecord[200];
            var rand = new Random();
            string[] units = { "kos", "kg", "kom", "l" };

            for (int i = 0; i < 200; i++)
            {
                var productId = rand.Next(1, 101);
                var warehouseId = rand.Next(1, 11);
                var unit = units[rand.Next(units.Length)];
                inventoryRecords[i] = new InventoryRecord
                {
                    ProductId = productId,
                    WarehouseId = warehouseId,
                    Quantity = rand.Next(1, 50),
                    Unit = unit,
                    DateAdded = DateTime.UtcNow.AddDays(-rand.Next(1, 30)),
                    PricePerPiece = (decimal)(rand.Next(5, 200) / 1.0)
                };
            }

            context.InventoryRecords.AddRange(inventoryRecords);
            context.SaveChanges();
        }
    }
}
