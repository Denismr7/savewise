import React, { useEffect, useRef, useState } from 'react';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { MonthInformation } from '../../common/objects/stats';
import styles from "./MonthsBalanceChart.module.scss";
import { constants } from '../../common/objects/constants';
import { UtilService } from '../../services';
Chart.register(...registerables);

interface MonthsBalanceChartProps {
    userId: number,
    selectedYear: number,
    chartData: MonthInformation[]
}

export default function MonthsBalanceChart(props: MonthsBalanceChartProps) {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const [ chartInstance, setChartInstance] = useState<Chart | null>(null);
    const [chartData, setChartData] = useState<MonthInformation[]>([]);

    useEffect(() => {
        setChartData(props.chartData);
        if (chartRef && chartRef.current && !chartInstance) {
            const chartConfiguration: ChartConfiguration = {
                type: 'bar',
                data: {
                    labels: UtilService.getAllMonthsLabels(),
                    datasets: [
                        {
                            label: "Incomes",
                            data: chartData.map(d => d.incomes),
                            borderColor: constants.chart.incomesColor,
                            backgroundColor: constants.chart.incomesBgColor,
                            hoverBackgroundColor: constants.chart.incomesColor
                        },
                        {
                            label: "Expenses",
                            data: chartData.map(d => d.expenses),
                            borderColor: constants.chart.expensesColor,
                            backgroundColor: constants.chart.expensesBgColor,
                            hoverBackgroundColor: constants.chart.expensesColor
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
            setChartData(props.chartData);
            chartInstance.data.datasets = [
                {
                    label: "Incomes",
                    data: chartData.map(d => d.incomes),
                    borderColor: constants.chart.incomesColor,
                    backgroundColor: constants.chart.incomesBgColor,
                    hoverBackgroundColor: constants.chart.incomesColor
                },
                {
                    label: "Expenses",
                    data: chartData.map(d => d.expenses),
                    borderColor: constants.chart.expensesColor,
                    backgroundColor: constants.chart.expensesBgColor,
                    hoverBackgroundColor: constants.chart.expensesColor
                }
            ]
            chartInstance.update();
        }
        return () => {
        }
    }, [props.userId, props.selectedYear, props.chartData, chartData,chartInstance, chartRef])

    return (
        <div className={styles.chartContainer}>
            <canvas ref={chartRef}/>
        </div>
    )
}
