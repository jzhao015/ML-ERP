using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Data;
using System.Data.SqlClient;
using WebApi.Models;
using Microsoft.ML;
using Microsoft.ML.Data;
using Microsoft.ML.Transforms.TimeSeries;
using System.Collections.Generic;
using System.Linq;
using System.IO;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InventoryController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _env;
        public InventoryController(IConfiguration configuration, IWebHostEnvironment env)
        {
            _configuration = configuration;
            _env = env;
        }

        [HttpGet]
        public JsonResult Get()
        {
            string query = "GetInventory"; 
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("CustomerAppCon");
            using (SqlConnection myConn = new SqlConnection(sqlDataSource))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myConn))
                {
                    myCommand.CommandType = CommandType.StoredProcedure; 
                    SqlDataReader myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                }
            }
            return new JsonResult(table);
        }

        [HttpGet("TotalValueSum")]
        public JsonResult GetTotalValueSum()
        {
            string query = "GetTotalValueSum"; // Call the stored procedure
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("CustomerAppCon");
            using (SqlConnection myConn = new SqlConnection(sqlDataSource))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myConn))
                {
                    myCommand.CommandType = CommandType.StoredProcedure; // Specify stored procedure
                    SqlDataReader myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                }
            }
            return new JsonResult(table.Rows[0]["TotalInventoryValue"]);
        }

        [HttpGet("TopFiveProd")]
        public JsonResult GetTopFiveProd()
        {
            string query = "GetTopFiveProducts"; // Call the stored procedure
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("CustomerAppCon");
            using (SqlConnection myConn = new SqlConnection(sqlDataSource))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myConn))
                {
                    myCommand.CommandType = CommandType.StoredProcedure; // Specify stored procedure
                    SqlDataReader myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                }
            }
            return new JsonResult(table);
        }

        [HttpPost]
        public JsonResult Post(Inventory inv)
        {
            string query = "AddInventory"; // Call the stored procedure
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("CustomerAppCon");
            using (SqlConnection myConn = new SqlConnection(sqlDataSource))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myConn))
                {
                    myCommand.CommandType = CommandType.StoredProcedure; // Specify stored procedure
                    myCommand.Parameters.AddWithValue("@ProductId", inv.ProductId);
                    myCommand.Parameters.AddWithValue("@ProductName", inv.ProductName);
                    myCommand.Parameters.AddWithValue("@QtyInStock", inv.QtyInStock);
                    myCommand.Parameters.AddWithValue("@LastUpdated", inv.LastUpdated);
                    myCommand.Parameters.AddWithValue("@CostPerUnit", inv.CostPerUnit);
                    myCommand.Parameters.AddWithValue("@StockStatus", inv.StockStatus);
                    myCommand.ExecuteNonQuery();
                }
            }
            return new JsonResult("Added Successfully");
        }

        [HttpPut]
        public JsonResult Put(Inventory inv)
        {
            string query = "UpdateInventory"; // Call the stored procedure
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("CustomerAppCon");
            using (SqlConnection myConn = new SqlConnection(sqlDataSource))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myConn))
                {
                    myCommand.CommandType = CommandType.StoredProcedure; // Specify stored procedure
                    myCommand.Parameters.AddWithValue("@InventoryId", inv.InventoryId);
                    myCommand.Parameters.AddWithValue("@ProductId", inv.ProductId);
                    myCommand.Parameters.AddWithValue("@ProductName", inv.ProductName);
                    myCommand.Parameters.AddWithValue("@QtyInStock", inv.QtyInStock);
                    myCommand.Parameters.AddWithValue("@LastUpdated", inv.LastUpdated);
                    myCommand.Parameters.AddWithValue("@CostPerUnit", inv.CostPerUnit);
                    myCommand.ExecuteNonQuery();
                }
            }
            return new JsonResult("Updated Successfully");
        }

        [HttpDelete("{id}")]
        public JsonResult Delete(int id)
        {
            string query = "DeleteInventory"; 
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("CustomerAppCon");
            using (SqlConnection myConn = new SqlConnection(sqlDataSource))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myConn))
                {
                    myCommand.CommandType = CommandType.StoredProcedure; 
                    myCommand.Parameters.AddWithValue("@InventoryId", id);
                    myCommand.ExecuteNonQuery();
                }
            }
            return new JsonResult("Deleted Successfully");
        }

        [HttpGet("combinedData")]
        public JsonResult GetCombinedData()
        {
            var historicalData = GetInventory2024().Value as DataTable;

            // Call GetForecast2025
            var forecastData = GetForecast2025().Value as List<object>;

            // Combine results
            var combinedResult = new
            {
                HistoricalData = historicalData,
                ForecastData = forecastData
            };

            return new JsonResult(combinedResult);
        }

        [HttpGet("Inventory2024")]
        public JsonResult GetInventory2024()
        {
            string query = @"
                SELECT 
                FORMAT(LastUpdated, 'yyyy-MM') AS Date,
                SUM(QtyInStock) as QtyInStock
                FROM dbo.Inventory
                GROUP BY FORMAT(LastUpdated, 'yyyy-MM') 
                ORDER BY Date";
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("CustomerAppCon");
            SqlDataReader myReader;
            using (SqlConnection myConn = new SqlConnection(sqlDataSource))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myConn))
                {
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader); ;

                    myReader.Close();
                    myConn.Close();
                }
            }
            return new JsonResult(table);
        }

        [HttpGet("Forecast2025")]
        public JsonResult GetForecast2025()
        {
            // Get historical data
            string query = @"
                SELECT 
                FORMAT(LastUpdated, 'yyyy-MM') AS Date,
                SUM(QtyInStock) as QtyInStock
                FROM dbo.Inventory
                GROUP BY FORMAT(LastUpdated, 'yyyy-MM') 
                ORDER BY Date";

            DataTable historicalData = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("CustomerAppCon");
            using (SqlConnection myConn = new SqlConnection(sqlDataSource))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myConn))
                {
                    using (SqlDataReader myReader = myCommand.ExecuteReader())
                    {
                        historicalData.Load(myReader);
                    }
                }
            }

            // Convert DataTable to list of StockData
            var stockData = historicalData.AsEnumerable()
                .Select(row => new StockData 
                { 
                    QtyInStock = float.Parse(row["QtyInStock"].ToString()) 
                })
                .ToList();

            // Create ML Context
            var mlContext = new MLContext();

            // Convert data to IDataView
            IDataView dataView = mlContext.Data.LoadFromEnumerable(stockData);

            // Create and train the forecast model
            var forecastingPipeline = mlContext.Forecasting.ForecastBySsa(
                outputColumnName: "ForecastedQtyInStock",
                inputColumnName: "QtyInStock",
                windowSize: 3,
                seriesLength: stockData.Count,
                trainSize: stockData.Count,
                horizon: 3);

            var model = forecastingPipeline.Fit(dataView);

            // Get predictions for next 3 months
            var forecast = model.Transform(dataView);
            var forecastEngine = model.CreateTimeSeriesEngine<StockData, StockPrediction>(mlContext);
            var predictions = forecastEngine.Predict();

            // Create result object
            var result = new List<object>();
            var baseDate = new DateTime(2024, 12, 1);
            
            for (int i = 0; i < predictions.ForecastedQtyInStock.Length; i++)
            {
                result.Add(new
                {
                    Date = baseDate.AddMonths(i + 1).ToString("yyyy-MM"),
                    QtyInStock = Math.Round(predictions.ForecastedQtyInStock[i], 2)
                });
            }

            return new JsonResult(result);
        }

        // Add these classes at the bottom of the controller or in a separate file
        public class StockData
        {
            public float QtyInStock { get; set; }
        }

        public class StockPrediction
        {
            public float[] ForecastedQtyInStock { get; set; }
        }
    } 
}
