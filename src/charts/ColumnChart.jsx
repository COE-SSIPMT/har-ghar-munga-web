import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const CustomColumnChart = ({ data, title }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '12px 16px',
          border: '2px solid #059669',
          borderRadius: '8px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          fontSize: '14px',
          fontWeight: '600',
          color: '#1e293b'
        }}>
          <p style={{ margin: 0 }}>{`${label}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke="#e2e8f0" 
          strokeOpacity={0.5}
        />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12, fill: '#64748b' }}
          axisLine={{ stroke: '#94a3b8' }}
        />
        <YAxis 
          tick={{ fontSize: 12, fill: '#64748b' }}
          axisLine={{ stroke: '#94a3b8' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar 
          dataKey="value" 
          fill="url(#governmentGradient)"
          animationDuration={1200}
          animationBegin={0}
          radius={[4, 4, 0, 0]}
        />
        <defs>
          <linearGradient id="governmentGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#059669" stopOpacity={1}/>
            <stop offset="100%" stopColor="#10b981" stopOpacity={0.8}/>
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CustomColumnChart;
