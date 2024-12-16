using Microsoft.ML;
using Microsoft.ML.Data;
using System;
using System.Linq;
using System.IO;
using System.Collections.Generic;
using Microsoft.ML.Transforms.TimeSeries;

namespace WebApi
{
    public partial class MLModel
    {
        /// <summary>
        /// model input class for MLModel.
        /// </summary>
        #region model input class
        public class ModelInput
        {
            [LoadColumn(0)]
            public int ProductId { get; set; }

            [LoadColumn(1)]
            public DateTime Date { get; set; }

            [LoadColumn(2)]
            public float QtyInStock { get; set; }
        }

        #endregion

        /// <summary>
        /// model output class for MLModel.
        /// </summary>
        #region model output class
        public class ModelOutput
        {
            [VectorType(12)]
            public float[] Forecast { get; set; }

            [VectorType(12)]
            public float[] LowerBound { get; set; }

            [VectorType(12)]
            public float[] UpperBound { get; set; }
        }

        #endregion

        private static string MLNetModelPath = Path.GetFullPath(@"C:\Users\jiachen1203\Desktop\CoreProject\WebApi\WebApi\MLModel.mlnet");

        public static readonly Lazy<TimeSeriesPredictionEngine<ModelInput, ModelOutput>> PredictEngine = new Lazy<TimeSeriesPredictionEngine<ModelInput, ModelOutput>>(() => CreatePredictEngine(), true);

        /// <summary>
        /// Use this method to predict on <see cref="ModelInput"/>.
        /// </summary>
        /// <param name="input">model input.</param>
        /// <returns><seealso cref=" ModelOutput"/></returns>
        public static ModelOutput Predict(ModelInput? input = null, int? horizon = null)
        {
            var predEngine = PredictEngine.Value;
            return predEngine.Predict(input, horizon);
        }

        private static TimeSeriesPredictionEngine<ModelInput, ModelOutput> CreatePredictEngine()
        {
            var mlContext = new MLContext();
            ITransformer mlModel = mlContext.Model.Load(MLNetModelPath, out var schema);
            return mlModel.CreateTimeSeriesEngine<ModelInput, ModelOutput>(mlContext);
        }
    }
}

