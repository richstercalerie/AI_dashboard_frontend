import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ChurnRiskChartProps {
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
  unknownRisk?: number; // Optional prop for unknown risk
}

const ChurnRiskChart: React.FC<ChurnRiskChartProps> = ({ highRisk, mediumRisk, lowRisk, unknownRisk = 0 }) => {
  const data = [
    { name: 'Low Risk', value: lowRisk, color: '#10b981' },
    { name: 'Medium Risk', value: mediumRisk, color: '#f59e0b' },
    { name: 'High Risk', value: highRisk, color: '#ef4444' },
    ...(unknownRisk > 0 ? [{ name: 'Unknown Risk', value: unknownRisk, color: '#6b7280' }] : []),
  ];

  // Calculate total for percentage labels
  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
            label={({ name, value }) => `${name}: ${total > 0 ? ((value / total) * 100).toFixed(0) : 0}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `${value} customers`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChurnRiskChart;