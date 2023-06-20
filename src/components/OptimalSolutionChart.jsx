import React from 'react';
import { Line } from 'react-chartjs-2';

const data = {
  labels: ['x1', 'x2', 'x3'],
  datasets: [
    {
      label: 'Restrição 1',
      data: [3, 2, 0],
      fill: false,
      borderColor: 'red',
    },
    {
      label: 'Restrição 2',
      data: [1, 1, 0],
      fill: false,
      borderColor: 'blue',
    },
    {
      label: 'Restrição 3',
      data: [1, 0, 1],
      fill: false,
      borderColor: 'green',
    },
  ],
};

const options = {
  scales: {
    x: {
      type: 'category',
      display: true,
      title: {
        display: true,
        text: 'Variáveis',
      },
    },
    y: {
      display: true,
      title: {
        display: true,
        text: 'Valor',
      },
    },
  },
};

export default function OptimalSolutionChart () {
  return (
    <Line data={data} options={options} />

    // <ResponsiveContainer width="100%" height={400}>
    //   <LineChart data={optimalSolution}>
    //     <CartesianGrid strokeDasharray="3 3" />
    //     <XAxis dataKey="x" />
    //     <YAxis />
    //     <Tooltip />
    //     <Legend />
    //     <Line type="monotone" dataKey="y" stroke="#8884d8" strokeWidth={2} dot={{ r: 5 }} />
    //   </LineChart>
    // </ResponsiveContainer>
  );
}
