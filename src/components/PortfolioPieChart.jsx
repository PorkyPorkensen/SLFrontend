import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#00FFA3', '#836FFF', '#FF69B4', '#FFD700', '#00CED1', '#FF7F50', '#ADFF2F', '#FFA500', '#8A2BE2', '#DC143C'];

const PortfolioPieChart = ({ tokens, prices }) => {
  if (!tokens || tokens.length === 0) return null;

  const chartData = [];
  let otherValue = 0;

  tokens.forEach((token, idx) => {
    const price = prices[token.mint]?.usd || 0;
    const amount = Number(token.amount) / 10 ** token.decimals;
    const value = price * amount;

    if (idx < 7) {
      chartData.push({
        name: token.symbol || token.name || 'Token',
        value: Number(value.toFixed(2)),
      });
    } else {
      otherValue += value;
    }
  });

  if (otherValue > 0) {
    chartData.push({ name: 'Other Tokens', value: Number(otherValue.toFixed(2)) });
  }

  return (
    <div  className="chartDiv" style={{ width: '90%', height: '300px', maxWidth: 500, margin: '25px auto' }}>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius="80%"
            label
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={60} wrapperStyle={{ fontSize: '0.8rem', paddingTop: '20px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PortfolioPieChart;