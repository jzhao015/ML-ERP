import React, { Component } from 'react'
import 
{ BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill}
 from 'react-icons/bs'
 import 
 { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } 
 from 'recharts';


export class Home extends Component{
    constructor(props){
        super(props);
        this.state = {
            totalValueSum:[],
            YearlyTotal:[],
            yearlyRevenue:[],
            monthlySpending: [],
            monthlySales: []
        }
    }

    refreshList(){
        fetch(`${import.meta.env.VITE_API}inventory/TotalValueSum`)
          .then(response=> response.json())
          .then(data =>{
              this.setState({totalValueSum:data});
          });

          fetch(`${import.meta.env.VITE_API}purchaseorder/YearlyTotal`)
          .then(response=> response.json())
          .then(data =>{
              this.setState({YearlyTotal:data});
          });

          fetch(`${import.meta.env.VITE_API}salesorder/yearlyRevenue`)
          .then(response=> response.json())
          .then(data =>{
              this.setState({yearlyRevenue:data});
          });

          fetch(`${import.meta.env.VITE_API}purchaseorder/valuepermonth`)
          .then(response => response.json())
          .then(data => {
              this.setState({ monthlySpending: data });
          });

          fetch(`${import.meta.env.VITE_API}salesorder/valpermonth`)
          .then(response => response.json())
          .then(data => {
              this.setState({ monthlySales: data });
          });
    }

    componentDidMount(){
        this.refreshList();
      }
  
    componentDidUpdate(){
        this.refreshList();
      }
   
    render()
    {
        const chartData = this.state.monthlySpending.map((item, index) => ({
            name: item.YearMonth,
            spending: item.YearlyTotal,
            revenue: this.state.monthlySales[index]?.totalValue || 0,
            amt: 2000
        }));

        return(
            <main className='main-container'>
                <div className='main-title'>
                    <h3 style={{ color: '#000' }}>Dashboard</h3>
                </div>
                <div className='main-cards'>
                <div className='card'>
                    <div className='card-inner'>
                        <h3>SPENDING</h3>
                        <BsFillArchiveFill className='card_icon'/>
                    </div>
                    <h1>${this.state.YearlyTotal}</h1>
                </div>
                <div className='card'>
                    <div className='card-inner'>
                        <h3>REVENUE</h3>
                        <BsPeopleFill className='card_icon'/>
                    </div>
                    <h1>${this.state.yearlyRevenue}</h1>
                </div>
                <div className='card'>
                    <div className='card-inner'>
                        <h3>CUSTOMERS</h3>
                        <BsPeopleFill className='card_icon'/>
                    </div>
                    <h1>33</h1>
                </div>
                <div className='card'>
                    <div className='card-inner'>
                        <h3>INVENTORY</h3>
                        <BsFillArchiveFill className='card_icon'/>
                    </div>
                    <h1>${this.state.totalValueSum}</h1>
                </div>
            </div>
            <div className='charts'>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                    width={500}
                    height={300}
                    data={chartData}
                    margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="spending" fill="#8884d8" />
                    <Bar dataKey="revenue" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
    
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                    width={500}
                    height={300}
                    data={chartData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                    >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="spending" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            </main>
            
        )
    }
   
}

export default Home