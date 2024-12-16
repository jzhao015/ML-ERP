namespace WebApi.Models
{
    public class SalesOrderLine
    {
        public int SalesOrderLineId { get; set; }
        public int SalesOrderId { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
    }
}
