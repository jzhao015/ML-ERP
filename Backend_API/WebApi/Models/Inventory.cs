namespace WebApi.Models
{
    public class Inventory
    {
        public int InventoryId { get; set; }

        public int ProductId { get; set; }

        public string ProductName { get; set; }

        public int QtyInStock { get; set; }

        public string LastUpdated {  get; set; }

        public decimal CostPerUnit { get; set; }
        public string StockStatus { get; set; }

        public decimal TotalValue => QtyInStock * CostPerUnit;
    }
}
