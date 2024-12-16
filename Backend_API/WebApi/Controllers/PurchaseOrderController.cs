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

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PurchaseOrderController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _env;

        public PurchaseOrderController(IConfiguration configuration, IWebHostEnvironment env)
        {
            _configuration = configuration;
            _env = env;
        }

        [HttpGet]
        public JsonResult Get()
        {
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("CustomerAppCon");
            SqlDataReader myReader;
            using (SqlConnection myConn = new SqlConnection(sqlDataSource))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand("GetAllPurchaseOrders", myConn))
                {
                    myCommand.CommandType = CommandType.StoredProcedure;
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader); ;

                    myReader.Close();
                    myConn.Close();
                }
            }
            return new JsonResult(table);
        }

        [HttpGet("YearlyTotal")]
        public JsonResult GetYearlyTotal()
        {
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("CustomerAppCon");
            SqlDataReader myReader;
            using (SqlConnection myConn = new SqlConnection(sqlDataSource))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand("GetYearlyTotal", myConn))
                {
                    myCommand.CommandType = CommandType.StoredProcedure;
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myConn.Close();
                }
            }
            return new JsonResult(table.Rows[0]["YearlyTotal"]);
        }
        [HttpGet("valuePerMonth")]
        public JsonResult GetvaluePerMonth()
        {
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("CustomerAppCon");
            SqlDataReader myReader;
            using (SqlConnection myConn = new SqlConnection(sqlDataSource))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand("GetValuePerMonth", myConn))
                {
                    myCommand.CommandType = CommandType.StoredProcedure;
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myConn.Close();
                }
            }
            return new JsonResult(table);
        }

        [HttpPost]
        public JsonResult Post(PurchaseOrder po) 
        {
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("CustomerAppCon");
            SqlDataReader myReader;
            using (SqlConnection myConn = new SqlConnection(sqlDataSource))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand("InsertPurchaseOrder", myConn))
                {
                    myCommand.CommandType = CommandType.StoredProcedure;
                    myCommand.Parameters.AddWithValue("@OrderId", po.OrderId);
                    myCommand.Parameters.AddWithValue("@DateofEntry", po.DateofEntry);
                    myCommand.Parameters.AddWithValue("@SupplierId", po.SupplierId);
                    myCommand.Parameters.AddWithValue("@SupplierName", po.SupplierName);
                    myCommand.Parameters.AddWithValue("@ProductName", po.ProductName);
                    myCommand.Parameters.AddWithValue("@CityAddress", po.cityAddress);
                    myCommand.Parameters.AddWithValue("@StateAddress", po.stateAddress);
                    myCommand.Parameters.AddWithValue("@CostPerUnit", po.CostPerUnit);
                    myCommand.Parameters.AddWithValue("@Qty", po.Qty);
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader); ;
                    myReader.Close();
                    myConn.Close();
                }
            }
            return new JsonResult("Added successfully");
        }

        [HttpPut]
        public JsonResult Put(PurchaseOrder po) {
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("CustomerAppCon");
            SqlDataReader myReader;
            using (SqlConnection myConn = new SqlConnection(sqlDataSource))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand("UpdatePurchaseOrder", myConn))
                {
                    myCommand.CommandType = CommandType.StoredProcedure;
                    myCommand.Parameters.AddWithValue("@OrderId", po.OrderId);
                    myCommand.Parameters.AddWithValue("@DateofEntry", po.DateofEntry);
                    myCommand.Parameters.AddWithValue("@SupplierId", po.SupplierId);
                    myCommand.Parameters.AddWithValue("@SupplierName", po.SupplierName);
                    myCommand.Parameters.AddWithValue("@ProductName", po.ProductName);
                    myCommand.Parameters.AddWithValue("@CityAddress", po.cityAddress);
                    myCommand.Parameters.AddWithValue("@StateAddress", po.stateAddress);
                    myCommand.Parameters.AddWithValue("@Qty", po.Qty);
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader); ;

                    myReader.Close();
                    myConn.Close();
                }
            }
                return new JsonResult("Update Successfully");
        }

        [HttpDelete("{id}")]

        public JsonResult Delete(int id) {
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("CustomerAppCon");
            SqlDataReader myReader;
            using (SqlConnection myConn = new SqlConnection(sqlDataSource))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand("DeletePurchaseOrder", myConn))
                {
                    myCommand.CommandType = CommandType.StoredProcedure;
                    myCommand.Parameters.AddWithValue("@OrderId", id);
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader); ;
                    myReader.Close();
                    myConn.Close();
                }
            }
            return new JsonResult("delete successfully");
        }

        [HttpGet("combinedData")]
        public JsonResult GetCombinedData()
        {
            // Call GetvaluePerMonth
            var historicalData = GetvaluePerMonth().Value as DataTable;

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

        [HttpGet("TopFiveProd")]
        public JsonResult GetTopFiveProd()
        {
            string query = @"
                select TOP 5 ProductName, SUM(ValuePrice) as totalValue
                from dbo.PurchaseOrder
                GROUP BY ProductName 
                ORDER BY totalValue DESC
            ";
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
        FORMAT(DateofEntry, 'yyyy-MM') AS YearMonth,
        SUM(ValuePrice) as TotalValue
        FROM dbo.PurchaseOrder
        GROUP BY FORMAT(DateofEntry, 'yyyy-MM')
        ORDER BY YearMonth";

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

            // Convert DataTable to list of ValueData
            var valueData = historicalData.AsEnumerable()
                .Select(row => new ValueData 
                { 
                    TotalValue = float.Parse(row["TotalValue"].ToString()) 
                })
                .ToList();

            // Create ML Context
            var mlContext = new MLContext();

            // Convert data to IDataView
            IDataView dataView = mlContext.Data.LoadFromEnumerable(valueData);

            // Create and train the forecast model
            var forecastingPipeline = mlContext.Forecasting.ForecastBySsa(
                outputColumnName: "ForecastedValue",
                inputColumnName: "TotalValue",
                windowSize: 3,
                seriesLength: valueData.Count,
                trainSize: valueData.Count,
                horizon: 3);

            var model = forecastingPipeline.Fit(dataView);

            // Get predictions for next 3 months
            var forecast = model.Transform(dataView);
            var forecastEngine = model.CreateTimeSeriesEngine<ValueData, ValuePrediction>(mlContext);
            var predictions = forecastEngine.Predict();

            // Create result object
            var result = new List<object>();
            var baseDate = new DateTime(2024, 12, 1);
            
            for (int i = 0; i < predictions.ForecastedValue.Length; i++)
            {
                result.Add(new
                {
                    YearMonth = baseDate.AddMonths(i + 1).ToString("yyyy-MM"),
                    YearlyTotal = Math.Round(predictions.ForecastedValue[i], 2)
                });
            }

            return new JsonResult(result);
        }

        // Add these classes at the bottom of the controller
        public class ValueData
        {
            public float TotalValue { get; set; }
        }

        public class ValuePrediction
        {
            public float[] ForecastedValue { get; set; }
        }
    }
}
