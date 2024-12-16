using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using System.Data.SqlClient;
using System.Data;
using WebApi.Models;
using System.Reflection.Metadata.Ecma335;
using System.Runtime.Intrinsics.Arm;
using System.Collections;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public CustomerController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        public JsonResult Get()
        {
            string query = "GetCustomers";
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("CustomerAppCon");
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.CommandType = CommandType.StoredProcedure;
                    SqlDataReader myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                }
            }
            return new JsonResult(table);
        }

        [HttpPost]
        public JsonResult Post(Customer customer)
        {
            string query = "AddCustomer";
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("CustomerAppCon");
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.CommandType = CommandType.StoredProcedure;
                    myCommand.Parameters.AddWithValue("@CustomerName", customer.CustomerName);
                    myCommand.Parameters.AddWithValue("@DateofEntry", customer.DateofEntry);
                    myCommand.Parameters.AddWithValue("@CityAddress", customer.cityAddress);
                    myCommand.Parameters.AddWithValue("@StateAddress", customer.stateAddress);
                    myCommand.ExecuteNonQuery();
                }
            }
            return new JsonResult("Add successfully");
        }

        [HttpPut]
        public JsonResult Put(Customer customer)
        {
            string query = "UpdateCustomer";
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("CustomerAppCon");
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.CommandType = CommandType.StoredProcedure;
                    myCommand.Parameters.AddWithValue("@CustomerId", customer.CustomerId);
                    myCommand.Parameters.AddWithValue("@CustomerName", customer.CustomerName);
                    myCommand.Parameters.AddWithValue("@DateofEntry", customer.DateofEntry);
                    myCommand.Parameters.AddWithValue("@CityAddress", customer.cityAddress);
                    myCommand.Parameters.AddWithValue("@StateAddress", customer.stateAddress);
                    myCommand.ExecuteNonQuery();
                }
            }
            return new JsonResult("Update successfully");
        }

        [HttpDelete("{id}")]

        public JsonResult Delete(int id)
        {
            string query = "DeleteCustomer";
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("CustomerAppCon");
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.CommandType = CommandType.StoredProcedure;
                    myCommand.Parameters.AddWithValue("@CustomerId", id);
                    myCommand.ExecuteNonQuery();
                }
            }
            return new JsonResult("Delete successfully");
        }
    }
}

