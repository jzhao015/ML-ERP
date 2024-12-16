using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.ML;
using System.Data.SqlClient;
using Microsoft.ML.Data;

namespace WebApi
{
    public partial class MLModel
    {
        public const string RetrainConnectionString = @"Data Source=CSUF-G0B0003;Initial Catalog=CustomerDB;Integrated Security=True;Trust Server Certificate=True";
        //public const string RetrainCommandString = @"SELECT CAST([InventoryId] as REAL), CAST([ProductId] as REAL), CAST([ProductName] as NVARCHAR(MAX)), CAST([QtyInStock] as REAL), [LastUpdated], CAST([CostPerUnit] as REAL), CAST([StockStatus] as NVARCHAR(MAX)), CAST([TotalValue] as REAL) FROM [dbo].[Inventory]";
        public const string RetrainCommandString = @"
    SELECT 
        ProductId,
        DATEFROMPARTS(YEAR(LastUpdated), MONTH(LastUpdated), 1) as Date,
        CAST(SUM(QtyInStock) as float) as QtyInStock
    FROM dbo.Inventory
    GROUP BY 
        ProductId, 
        DATEFROMPARTS(YEAR(LastUpdated), MONTH(LastUpdated), 1)
    ORDER BY 
        ProductId, 
        DATEFROMPARTS(YEAR(LastUpdated), MONTH(LastUpdated), 1)";
        /// <summary>
        /// Train a new model with the provided dataset.
        /// </summary>
        /// <param name="outputModelPath">File path for saving the model. Should be similar to "C:\YourPath\ModelName.mlnet"</param>
        /// <param name="connectionString">Connection string for databases on-premises or in the cloud.</param>
        /// <param name="commandText">Command string for selecting training data.</param>
        public static void Train(string outputModelPath, string connectionString = RetrainConnectionString, string commandText = RetrainCommandString)
        {
            var mlContext = new MLContext();

            var data = LoadIDataViewFromDatabase(mlContext, connectionString, commandText);
            var model = RetrainModel(mlContext, data);
            SaveModel(mlContext, model, data, outputModelPath);
        }

        /// <summary>
        /// Load an IDataView from a database source.For more information on how to load data, see aka.ms/loaddata.
        /// </summary>
        /// <param name="mlContext">The common context for all ML.NET operations.</param>
        /// <param name="connectionString">Connection string for databases on-premises or in the cloud.</param>
        /// <param name="commandText">Command string for selecting training data.</param>
        /// <returns>IDataView with loaded training data.</returns>
        public static IDataView LoadIDataViewFromDatabase(MLContext mlContext, string connectionString, string commandText)
        {
            DatabaseLoader loader = mlContext.Data.CreateDatabaseLoader<ModelInput>();
            DatabaseSource dbSource = new DatabaseSource(SqlClientFactory.Instance, connectionString, commandText);

            return loader.Load(dbSource);
        }

        /// <summary>
        /// Save a model at the specified path.
        /// </summary>
        /// <param name="mlContext">The common context for all ML.NET operations.</param>
        /// <param name="model">Model to save.</param>
        /// <param name="data">IDataView used to train the model.</param>
        /// <param name="modelSavePath">File path for saving the model. Should be similar to "C:\YourPath\ModelName.mlnet.</param>
        public static void SaveModel(MLContext mlContext, ITransformer model, IDataView data, string modelSavePath)
        {
            // Pull the data schema from the IDataView used for training the model
            DataViewSchema dataViewSchema = data.Schema;

            using (var fs = File.Create(modelSavePath))
            {
                mlContext.Model.Save(model, dataViewSchema, fs);
            }
        }


        /// <summary>
        /// Retrain model using the pipeline generated as part of the training process.
        /// </summary>
        /// <param name="mlContext"></param>
        /// <param name="trainData"></param>
        /// <returns></returns>
        public static ITransformer RetrainModel(MLContext mlContext, IDataView trainData)
        {
            var pipeline = BuildPipeline(mlContext);
            var model = pipeline.Fit(trainData);

            return model;
        }

        /// <summary>
        /// build the pipeline that is used from model builder. Use this function to retrain model.
        /// </summary>
        /// <param name="mlContext"></param>
        /// <returns></returns>
        public static IEstimator<ITransformer> BuildPipeline(MLContext mlContext)
        {
            var pipeline = mlContext.Forecasting.ForecastBySsa(
                outputColumnName: "Forecast",
                inputColumnName: "QtyInStock",
                windowSize: 3, // 3 monthly data
                seriesLength: 30, // Amount of historical data points to use
                trainSize: 12, // one years of training data
                horizon: 12, // Forecast 12 months ahead
                confidenceLevel: 0.95f,
                confidenceLowerBoundColumn: "LowerBound",
                confidenceUpperBoundColumn: "UpperBound"
            );

            return pipeline;
        }
    }
 }
