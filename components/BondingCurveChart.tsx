
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = Array.from({ length: 50 }, (_, i) => {
  const supply = i * 200000;
  // Simple quadratic bonding curve: price = k * supply^2
  const price = 0.00000000001 * Math.pow(supply, 2) + 0.001;
  return {
    supply: supply,
    price: price,
  };
});

const BondingCurveChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <defs>
          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
        <XAxis 
          dataKey="supply" 
          tickFormatter={(value) => `${Number(value) / 1000000}M`} 
          stroke="#9ca3af"
          tick={{ fill: '#9ca3af', fontSize: 12 }}
          label={{ value: 'Token Supply', position: 'insideBottom', offset: -5, fill: '#9ca3af', fontSize: 12 }}
        />
        <YAxis 
          tickFormatter={(value) => `$${Number(value).toFixed(3)}`} 
          stroke="#9ca3af"
          tick={{ fill: '#9ca3af', fontSize: 12 }}
          domain={['dataMin', 'dataMax']}
          label={{ value: 'Price', angle: -90, position: 'insideLeft', fill: '#9ca3af', fontSize: 12, dx: 10 }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(31, 41, 55, 0.8)',
            borderColor: '#4b5563',
            borderRadius: '0.5rem',
            color: '#ffffff',
          }}
          labelStyle={{ fontWeight: 'bold' }}
          formatter={(value, name) => [
            name === 'price' ? `$${Number(value).toFixed(6)}` : value.toLocaleString(), 
            name.charAt(0).toUpperCase() + name.slice(1)
          ]}
          labelFormatter={(label) => `Supply: ${label.toLocaleString()}`}
        />
        <Area type="monotone" dataKey="price" stroke="#8884d8" fillOpacity={1} fill="url(#colorPrice)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default BondingCurveChart;
