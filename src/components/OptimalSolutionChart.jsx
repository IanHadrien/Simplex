import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { LinearScale } from 'chart.js';

export default function OptimalSolutionChart ({data}) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Registre o módulo de escala linear
    Chart.register(LinearScale);

    if (chartInstance.current) {
      // Se houver um gráfico anterior, destrua-o
      chartInstance.current.destroy();
    }

    // Configuração do gráfico
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          type: 'linear',
          beginAtZero: true,
        },
      },
    };

    // Renderização do gráfico
    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [
          {
            label: 'Solução Ótima',
            data: data.values,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: chartOptions,
    });
  }, [data]);

  return <canvas ref={chartRef} />;
}
