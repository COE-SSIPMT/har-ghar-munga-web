import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const CustomPieChart = ({ data, title }) => {
  // Government color scheme
  const COLORS = ['#0ea5e9', '#0284c7', '#059669', '#10b981', '#dc2626', '#ea580c'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '12px 16px',
          border: '2px solid #0ea5e9',
          borderRadius: '8px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          fontSize: '14px',
          fontWeight: '600',
          color: '#1e293b'
        }}>
          <p style={{ margin: 0 }}>{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={90}
          fill="#0ea5e9"
          dataKey="value"
          animationBegin={0}
          animationDuration={1000}
          stroke="#ffffff"
          strokeWidth={2}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          wrapperStyle={{
            fontSize: '14px',
            fontWeight: '500',
            color: '#1e293b'
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomPieChart;
