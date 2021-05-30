import React, { useEffect, useRef, useState } from 'react';
import { Chart, ChartConfiguration, registerables } from 'chart.js';


import { VaultMonthlyAmount } from '../../common/objects/stats';
import { UtilService } from '../../services';
import { constants } from '../../common/objects/constants';

Chart.register(...registerables);

export interface IVaultChartProps {
    chartData: VaultMonthlyAmount[];
}

export default function VaultChart({ chartData }: IVaultChartProps ) {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const [ chartInstance, setChartInstance ] = useState<Chart | null>(null);

    // Create chart
    useEffect(() => {
        if (chartRef && chartRef.current && !chartInstance) {
            const chartConfiguration: ChartConfiguration = {
                type: 'bar',
                data: {
                    labels: UtilService.getAllMonthsLabels(),
                    datasets: [
                        {
                            label: "Amount",
                            data: chartData.map(d => d.amount),
                            backgroundColor: constants.chart.incomesBgColor
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top'
                        }
                    },
                    scales: {
                        y: {
                            min: 0,
                            max: 2000
                        }
                    }
                }
            }
            if (chartData.length) {
                const chart = new Chart(chartRef.current, chartConfiguration);
                setChartInstance(chart);
            }
        } else if (chartInstance) {
            chartInstance.data.datasets[0].data = chartData.map(data => data.amount);
            chartInstance.update();
        }
        return () => {
            
        }
    }, [chartData, chartInstance])

    return (
        <canvas ref={chartRef}/>
    )
}
