import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { StatsService, UtilService } from '../../services';
import { SnackbarContext } from '../../common/context/SnackbarContext';
import { MonthInformation } from '../../common/objects/stats';
import styles from "./MonthsBalanceChart.module.scss";
import { constants } from '../../common/objects/constants';
Chart.register(...registerables);

interface MonthsBalanceChartProps {
    userId: number,
    selectedYear: number
}

export default function MonthsBalanceChart(props: MonthsBalanceChartProps) {
    const { setSnackbarInfo } = useContext(SnackbarContext);

    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const [ chartInstance, setChartInstance] = useState<Chart | null>(null);
    const [chartData, setChartData] = useState<MonthInformation[]>([]);

    const getData = useCallback(
        async (userId: number, selectedYear: number) => {
            try {
                const { status, monthsInformation } = await StatsService.getMonthIncomeExpenses(userId, selectedYear);
                if (status.success) {
                    console.debug("Hey")
                    setChartData(monthsInformation);
                } else {
                    setSnackbarInfo({ severity: "error", message: status.errorMessage });
                }
            } catch (error) {
                setSnackbarInfo({ severity: "error", message: error });
            }
        },
        [setSnackbarInfo],
    )

    useEffect(() => {
        if (chartRef && chartRef.current && !chartInstance) {
            getData(props.userId, props.selectedYear);
            const chartConfiguration: ChartConfiguration = {
                type: 'bar',
                data: {
                    labels: UtilService.getAllMonthsLabels(),
                    datasets: [
                        {
                            label: "Incomes",
                            data: chartData.map(d => d.incomes),
                            borderColor: constants.chart.incomesColor,
                            backgroundColor: constants.chart.incomesBgColor
                        },
                        {
                            label: "Expenses",
                            data: chartData.map(d => d.expenses),
                            borderColor: constants.chart.expensesColor,
                            backgroundColor: constants.chart.expensesBgColor
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
        }
        return () => {
        }
    }, [getData, props.userId, props.selectedYear, chartData,chartInstance, chartRef])

    return (
        <div className={styles.chartContainer}>
            <canvas ref={chartRef}/>
        </div>
    )
}
