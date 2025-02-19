namespace API.Models
{
    public class InventoryRecord
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int WarehouseId { get; set; }
        public int Quantity { get; set; }
        public string Unit { get; set; } = null!;
        public DateTime DateAdded { get; set; }
        public decimal PricePerPiece { get; set; }
    }
}
