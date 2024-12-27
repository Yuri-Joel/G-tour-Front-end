import React, { useEffect, useRef, useState } from 'react'
import { CChartLine } from '@coreui/react-chartjs'
import { CCardBody, CRow, CCol, CButton, CButtonGroup, CSpinner } from '@coreui/react';
import { getStyle } from '@coreui/utils'
import { api } from '../../api/api.pnp'
import CIcon from '@coreui/icons-react';
import { cilCloudDownload } from '@coreui/icons';
const MainChart = () => {
  const chartRef = useRef(null)
/* 
  useEffect(() => {
    document.documentElement.addEventListener('ColorSchemeChange', () => {
      if (chartRef.current) {
        setTimeout(() => {
          chartRef.current.options.scales.x.grid.borderColor = getStyle(
            '--cui-border-color-translucent',
          )
          chartRef.current.options.scales.x.grid.color = getStyle('--cui-border-color-translucent')
          chartRef.current.options.scales.x.ticks.color = getStyle('--cui-body-color')
          chartRef.current.options.scales.y.grid.borderColor = getStyle(
            '--cui-border-color-translucent',
          )
          chartRef.current.options.scales.y.grid.color = getStyle('--cui-border-color-translucent')
          chartRef.current.options.scales.y.ticks.color = getStyle('--cui-body-color')
          chartRef.current.update()
        })
      }
    })
  }, [chartRef]) */

  const [chartData, setChartData] = useState(null);
  /* const random = () => Math.round(Math.random() * 100) */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/activity'); // Substitua pelo endpoint real do seu backend
        setChartData(response.data.data);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchData();
  }, []);

  if (!chartData) {
    return <CSpinner color="primary" />;
  }
  return (
    <>
     <CChartLine
        ref={chartRef}
        style={{ height: '300px', marginTop: '40px' }}
        data={{
          labels: chartData.labels,
          datasets: chartData.datasets.map((dataset, index) => ({
            ...dataset,
            backgroundColor: index === 0 ? `rgba(${getStyle('--cui-info-rgb')}, .1)` : 'transparent',
            borderColor: getStyle(`--cui-${index === 0 ? 'info' : index === 1 ? 'success' : 'danger'}`),
            pointHoverBackgroundColor: getStyle(`--cui-${index === 0 ? 'info' : index === 1 ? 'success' : 'danger'}`),
            borderWidth: index === 2 ? 1 : 2,
            borderDash: index === 2 ? [8, 5] : [],
            fill: index === 0,
          }))
        }}
        options={{
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              grid: {
                color: getStyle('--cui-border-color-translucent'),
                drawOnChartArea: false,
              },
              ticks: {
                color: getStyle('--cui-body-color'),
              },
            },
            y: {
              beginAtZero: true,
              border: {
                color: getStyle('--cui-border-color-translucent'),
              },
              grid: {
                color: getStyle('--cui-border-color-translucent'),
              },
              max: 250,
              ticks: {
                color: getStyle('--cui-body-color'),
                maxTicksLimit: 5,
                stepSize: Math.ceil(250 / 5),
              },
            },
          },
          elements: {
            line: {
              tension: 0.4,
            },
            point: {
              radius: 0,
              hitRadius: 10,
              hoverRadius: 4,
              hoverBorderWidth: 3,
            },
          },
        }}
      />
    </>
  )
}

export default MainChart
