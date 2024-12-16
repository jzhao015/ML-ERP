using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Models
{
    public class Customer
    {
        public int CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string DateofEntry { get; set; }

        public string cityAddress { get; set; }

        public string stateAddress { get; set; }
    }
}
