using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
namespace WebApi.Models
{
    public class PurchaseOrder
    {
        public int OrderId { get; set; }
        public string DateofEntry { get; set; }
        public int SupplierId { get; set; }
        public string SupplierName { get; set; }

        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string cityAddress { get; set; }
        public string stateAddress { get; set; }
        public int Qty { get; set; }
        public decimal CostPerUnit { get; set; }

        public decimal ValuePrice => Qty * CostPerUnit;
    }
}
