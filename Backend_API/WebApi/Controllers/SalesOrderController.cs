using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using WebApi.Models;
using Microsoft.ML;
using Microsoft.ML.Data;
using Microsoft.ML.Transforms.TimeSeries;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SalesOrderController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _env;

        public SalesOrderController(IConfiguration configuration, IWebHostEnvironment env)
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
                using (SqlCommand myCommand = new SqlCommand("GetAllSalesOrders", myConn))
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

        [HttpGet("yearlyRevenue")]
        public JsonResult GetyearlyRevenue()
        {
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("CustomerAppCon");
            SqlDataReader myReader;
            using (SqlConnection myConn = new SqlConnection(sqlDataSource))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand("GetYearlyRevenue", myConn))
                {
                    myCommand.CommandType = CommandType.StoredProcedure;
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myConn.Close();
                }
            }
            return new JsonResult(table.Rows[0]["yearlyRevenue"]);
        }

        [HttpGet("valPerMonth")]
        public JsonResult GetvalPerMonth()
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
        public JsonResult Post(SalesOrder salesorder) {
            DataTable table = new DataTable();
            int salesOrderId;
            string sqlDataSource = _configuration.GetConnectionString("CustomerAppCon");
            using (SqlConnection myConn = new SqlConnection(sqlDataSource))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand("InsertSalesOrder", myConn))
                {
                    myCommand.CommandType = CommandType.StoredProcedure;
                    myCommand.Parameters.AddWithValue("@SalesOrderId", salesorder.SalesOrderId);
                    myCommand.Parameters.AddWithValue("@CustomerId", salesorder.CustomerId);
                    myCommand.Parameters.AddWithValue("@CustomerName", salesorder.CustomerName);
                    myCommand.Parameters.AddWithValue("@OrderDate", salesorder.OrderDate);
                    myCommand.Parameters.AddWithValue("@DeliveryDate", salesorder.DeliveryDate);
                    myCommand.ExecuteNonQuery();
                }
            }

            foreach (var product in salesorder.Products)
            {
                string querySalesOrderLine = @"
                    INSERT INTO dbo.SalesOrderLine 
                    (SalesOrderId, ProductId, ProductName)
                    VALUES
                    (@SalesOrderId, @ProductId, @ProductName)";

                using (SqlConnection myConn = new SqlConnection(sqlDataSource))
                {
                    myConn.Open();
                    using (SqlCommand myCommand = new SqlCommand(querySalesOrderLine, myConn))
                    {
                        myCommand.Parameters.AddWithValue("@SalesOrderId", salesorder.SalesOrderId);
                        myCommand.Parameters.AddWithValue("@ProductId", product.ProductId);
                        myCommand.Parameters.AddWithValue("@ProductName", product.ProductName);

                        myCommand.ExecuteNonQuery();
                    }
                }
            }
            return new JsonResult("Added Successfully");
        }

        [HttpPut]
        public JsonResult Put(SalesOrder salesorder) {
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("CustomerAppCon");
            using (SqlConnection myConn = new SqlConnection(sqlDataSource))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand("UpdateSalesOrder", myConn))
                {
                    myCommand.CommandType = CommandType.StoredProcedure;
                    myCommand.Parameters.AddWithValue("@SalesOrderId", salesorder.SalesOrderId);
                    myCommand.Parameters.AddWithValue("@CustomerId", salesorder.CustomerId);
                    myCommand.Parameters.AddWithValue("@CustomerName", salesorder.CustomerName);
                    myCommand.Parameters.AddWithValue("@OrderDate", salesorder.OrderDate);
                    myCommand.Parameters.AddWithValue("@DeliveryDate", salesorder.DeliveryDate);
                    myCommand.ExecuteNonQuery();
                }
            }

            string deleteQuery = "DELETE FROM dbo.SalesOrderLine WHERE SalesOrderId = @SalesOrderId";
            using (SqlConnection myConn = new SqlConnection(sqlDataSource))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand(deleteQuery, myConn))
                {
                    myCommand.Parameters.AddWithValue("@SalesOrderId", salesorder.SalesOrderId);
                    myCommand.ExecuteNonQuery();
                }
            }
            foreach (var product in salesorder.Products)
            {
                string querySalesOrderLine = @"
                    INSERT INTO dbo.SalesOrderLine 
                    (SalesOrderId, ProductId, ProductName)
                    VALUES
                    (@SalesOrderId, @ProductId, @ProductName)";

                using (SqlConnection myConn = new SqlConnection(sqlDataSource))
                {
                    myConn.Open();
                    using (SqlCommand myCommand = new SqlCommand(querySalesOrderLine, myConn))
                    {
                        myCommand.Parameters.AddWithValue("@SalesOrderId", salesorder.SalesOrderId);
                        myCommand.Parameters.AddWithValue("@ProductId", product.ProductId);
                        myCommand.Parameters.AddWithValue("@ProductName", product.ProductName);

                        myCommand.ExecuteNonQuery();
                    }
                }
            }
            return new JsonResult("Updated Successfully");
        }

        [HttpDelete("{id}")]
        public JsonResult Delete(int id)
        {
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("CustomerAppCon");
            using (SqlConnection myConn = new SqlConnection(sqlDataSource))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand("DeleteSalesOrder", myConn))
                {
                    myCommand.CommandType = CommandType.StoredProcedure;
                    myCommand.Parameters.AddWithValue("@SalesOrderId", id);
                    myCommand.ExecuteNonQuery();
                }
                myConn.Close();
            }
            return new JsonResult("Delete");
        }

        [HttpGet("combinedData")]
        public JsonResult GetCombineData()
        {
            var historicalData = GetvalPerMonth().Value as DataTable;
            var forecastData = GetForecast2025().Value as List<object>;
            var combinedResult = new
            {
                HistoricalData = historicalData,
                ForecastData = forecastData
            };
            return new JsonResult(combinedResult);
        }

        [HttpGet("topFiveProd")]
        public JsonResult GettopFiveProd()
        {
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("CustomerAppCon");
            SqlDataReader myReader;
            using (SqlConnection myConn = new SqlConnection(sqlDataSource))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand("GetTopFiveProducts", myConn))
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

        [HttpGet("Forecast2025")]
        public JsonResult GetForecast2025()
        {
            DataTable historicalData = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("CustomerAppCon");
            SqlDataReader myReader;
            using (SqlConnection myConn = new SqlConnection(sqlDataSource))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand("GetForecast2025", myConn))
                {
                    myCommand.CommandType = CommandType.StoredProcedure;
                    myReader = myCommand.ExecuteReader();
                    historicalData.Load(myReader);
                    myReader.Close();
                    myConn.Close();
                }
            }

            var valueData = historicalData.AsEnumerable()
                .Select(row => new ValueData 
                { 
                    TotalValue = float.Parse(row["TotalValue"].ToString()) 
                })
                .ToList();

            var mlContext = new MLContext();

            IDataView dataView = mlContext.Data.LoadFromEnumerable(valueData);

            var forecastingPipeline = mlContext.Forecasting.ForecastBySsa(
                outputColumnName: "ForecastedValue",
                inputColumnName: "TotalValue",
                windowSize: 3,
                seriesLength: valueData.Count,
                trainSize: valueData.Count,
                horizon: 3);

            var model = forecastingPipeline.Fit(dataView);

            var forecastEngine = model.CreateTimeSeriesEngine<ValueData, ValuePrediction>(mlContext);
            var predictions = forecastEngine.Predict();

            var result = new List<object>();
            var baseDate = new DateTime(2025, 1, 1);
            
            for (int i = 0; i < predictions.ForecastedValue.Length; i++)
            {
                result.Add(new
                {
                    YearMonth = baseDate.AddMonths(i).ToString("yyyy-MM"),
                    totalValue = Math.Round(predictions.ForecastedValue[i], 2)
                });
            }

            return new JsonResult(result);
        }

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
