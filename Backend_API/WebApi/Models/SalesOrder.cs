namespace WebApi.Models
{
    public class SalesOrder
    {
        public int SalesOrderId { get; set; }

        public int CustomerId { get; set; }

        public string CustomerName { get; set; }

        public string OrderDate { get; set; }

        public string DeliveryDate { get; set; }

        public List<SalesOrderLine> Products { get; set; }
    }
}
