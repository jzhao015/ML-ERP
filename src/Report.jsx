import React, {Component} from "react";
import { PieChart,Cell, Pie, Tooltip, ResponsiveContainer } from "recharts";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import Inventory from "./Inventory";


export class Report extends Component {
    constructor(props){
        super(props);
        this.state = {
            Inventory:{historicalData:[], forecastData:[]},
            Spending: {historicalData:[], forecastData:[]},
            Sales: { historicalData: [], forecastData: [] }, 
            invProds:[], 
            poProds:[],
            salesProds:[]
        }
    }

    refreshList(){
        
    fetch(`${import.meta.env.VITE_API}salesorder/combineddata`)
      .then(response => response.json())
      .then(data => {
          const historicalData = data.HistoricalData.map(item => ({
              name: item.YearMonth,
              totalValue: item.totalValue
          }));
          const forecastData = data.ForecastData.map(item => ({
              name: item.YearMonth,
              totalValue: item.totalValue
          }));
          this.setState({ Sales: { historicalData, forecastData } });
      });

      fetch(`${import.meta.env.VITE_API}purchaseorder/combineddata`)
      .then(response => response.json())
      .then(data => {
          const historicalData = data.HistoricalData.map(item => ({
              name: item.YearMonth,
              YearlyTotal: item.YearlyTotal
          }));
          const forecastData = data.ForecastData.map(item => ({
              name: item.YearMonth,
              YearlyTotal: item.YearlyTotal
          }));
          this.setState({ Spending: { historicalData, forecastData } });
      });
          
        fetch(`${import.meta.env.VITE_API}inventory/combineddata`)
          .then(response=> response.json())
          .then(data =>{
            const historicalData = data.HistoricalData.map(item => ({
                name: item.Date,
                QtyInStock: item.QtyInStock
            }));
            const forecastData = data.ForecastData.map(item => ({
                name: item.Date,
                QtyInStock: item.QtyInStock
            }));
            this.setState({Inventory: {historicalData, forecastData}});
          }); 
          
        fetch(`${import.meta.env.VITE_API}inventory/topfiveprod`)
          .then(response => response.json())
          .then(data => {
              // Transforming the data to match the expected format for the pie chart
              const topFiveProducts = data.map(item => ({
                  name: item.ProductName,
                  value: item.totalValue
              }));
              this.setState({ invProds: topFiveProducts });
          });

        fetch(`${import.meta.env.VITE_API}purchaseorder/topfiveprod`)
          .then(response => response.json())
          .then(data => {
              // Transforming the data to match the expected format for the pie chart
              const topFiveProducts = data.map(item => ({
                  name: item.ProductName,
                  value: item.totalValue
              }));
              this.setState({ poProds: topFiveProducts });
          });

        fetch(`${import.meta.env.VITE_API}salesorder/topfiveprod`)
          .then(response => response.json())
          .then(data => {
              // Transforming the data to match the expected format for the pie chart
              const topFiveProducts = data.map(item => ({
                  name: item.ProductName,
                  value: item.totalValue
              }));
              this.setState({ salesProds: topFiveProducts });
          });
    }

    componentDidMount(){
        this.refreshList();
    }
  
    componentDidUpdate(){
        this.refreshList();
    }

    render() {
      


        const userRetentionData = [
            { name: "Week 1", retention: 100 },
            { name: "Week 2", retention: 75 },
            { name: "Week 3", retention: 60 },
            { name: "Week 4", retention: 50 },
            { name: "Week 5", retention: 45 },
            { name: "Week 6", retention: 40 },
            { name: "Week 7", retention: 38 },
            { name: "Week 8", retention: 35 },
        ];

       
        
        const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"];
        const COLORS_ = [ "#FF5733", "#33FF57", "#3357FF", "#F1C40F", "#8E44AD"];
        const COLORS_t = ["#C0392B", "#1ABC9C", "#3498DB", "#9B59B6", "#F39C12"];
        const topFiveProductsData = this.state.invProds;

        const topFiveProductsPOdata = this.state.poProds;

        const topFiveProdsSOddata = this.state.salesProds;

        const salesData = this.state.Sales.historicalData.map(item => ({
            name: item.name,
            totalValue: item.totalValue,
        })).concat(this.state.Sales.forecastData.map(item => ({
            name: item.name,
            totalValue: item.totalValue,
        })));

        const spendingData = this.state.Spending.historicalData.map(item => ({
            name: item.name,
            totalValue: item.YearlyTotal,
        })).concat(this.state.Spending.forecastData.map(item => ({
            name: item.name,
            totalValue: item.YearlyTotal,
        })));

        const inventoryData = this.state.Inventory.historicalData.map(item => ({
            name: item.name,
            QtyInStock: item.QtyInStock,
        })).concat(this.state.Inventory.forecastData.map(item => ({
            name: item.name,
            QtyInStock: item.QtyInStock,
        })));

        return (
            <main className="main-container">
                <div className='main-title'>
                    <h3 style={{ color: '#000' }}>Forecast Report</h3>
                   
                </div>
                    <div className="charts">
                        <ResponsiveContainer width="100%" height={400}>
                        <h4 style={{ color: '#000' }}>Sales Forecast</h4>
                        <PieChart>
						<Pie
							data={topFiveProdsSOddata}
							cx='50%'
							cy='50%'
							outerRadius={80}
							fill='#8884d8'
							dataKey='value'
							label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
						>
							{topFiveProdsSOddata.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS_t[index % COLORS_t.length]} />
							))}
						</Pie>
                        <Tooltip />
					</PieChart>
                        </ResponsiveContainer>
                        <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                    <XAxis dataKey='name' stroke='#9CA3AF'/>
                    <YAxis stroke='#9CA3AF' />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "rgba(31, 41, 55, 0.8)",
                            borderColor: "#4B5563",
                        }}
                        itemStyle={{ color: "#E5E7EB" }}
                    />
                    <Legend />
                    <Line type='monotone' dataKey='totalValue'  data={salesData} stroke='#8B5CF6' strokeWidth={2} />
                    
                </LineChart>
				</ResponsiveContainer>
                    </div>

                    <div>
                    <h4 style={{ color: 'whitesmoke' }}>space    </h4>
                    </div>

                    <div className="charts" >
                        <ResponsiveContainer width="100%" height={400}>
                        <h4 style={{ color: '#000' }}>Spending Forecast</h4>
                        <PieChart>
                            <Pie
                                data={topFiveProductsPOdata}
                                cx='50%'
                                cy='50%'
                                outerRadius={80}
                                fill='#8884d8'
                                dataKey='value'
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {topFiveProductsPOdata.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS_[index % COLORS_.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                        </ResponsiveContainer>
                        <ResponsiveContainer width="100%" height={400}>
					<LineChart data={spendingData}>
						<CartesianGrid strokeDasharray='3 3' stroke='#374151' />
						<XAxis dataKey='name' stroke='#9CA3AF' />
						<YAxis stroke='#9CA3AF' />
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(31, 41, 55, 0.8)",
								borderColor: "#4B5563",
							}}
							itemStyle={{ color: "#E5E7EB" }}
						/>
						<Legend />
						<Line type='monotone' dataKey='totalValue' data={spendingData} stroke='#8B5CF6' strokeWidth={2} />
					</LineChart>
				</ResponsiveContainer>
                    </div>

                    <div>
                    <h4 style={{ color: 'whitesmoke' }}>space    </h4>
                    </div>

                    <div className="charts">
                        <ResponsiveContainer width="100%" height={400}>
                        <h4 style={{ color: '#000' }}>Inventory Forecast</h4>
                        <PieChart>
                            <Pie
                                data={topFiveProductsData}
                                cx='50%'
                                cy='50%'
                                outerRadius={80}
                                fill='#8884d8'
                                dataKey='value'
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {topFiveProductsData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                        </ResponsiveContainer>
                        <ResponsiveContainer width="100%" height={400}>
					<LineChart data={inventoryData}>
						<CartesianGrid strokeDasharray='3 3' stroke='#374151' />
						<XAxis dataKey='name' stroke='#9CA3AF' />
						<YAxis stroke='#9CA3AF' />
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(31, 41, 55, 0.8)",
								borderColor: "#4B5563",
							}}
							itemStyle={{ color: "#E5E7EB" }}
						/>
						<Legend />
						<Line type='monotone' dataKey='QtyInStock' data={inventoryData} stroke='#8B5CF6' strokeWidth={2} />
					</LineChart>
				</ResponsiveContainer>
                    </div>
               
            </main>
        );
    }

}
export default Report;