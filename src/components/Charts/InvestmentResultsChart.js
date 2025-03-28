import React from 'react';
import ReactECharts from 'echarts-for-react';
import { useTheme } from '@mui/material/styles';
import { useI18n } from '../../utils/i18n';

const InvestmentResultsChart = ({ data, currency }) => {
  const theme = useTheme();
  const { t } = useI18n();

  if (!data || data.length === 0) {
    return <div>{t('common.noData')}</div>;
  }

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      formatter: function(params) {
        let result = `${params[0].axisValue}<br/>`;
        params.forEach(param => {
          if (param && param.seriesName) {
            const value = param.value || 0;
            result += `${param.marker} ${param.seriesName}: ${currency.symbol}${value.toLocaleString()}<br/>`;
          }
        });
        return result;
      }
    },
    legend: {
      data: [
        t('calculator.finalValue'), 
        t('calculator.totalContributions'),
        t('calculator.inflationAdjusted')
      ],
      textStyle: {
        color: theme.palette.text.primary
      },
      right: 0,
      top: 0
    },
    grid: {
      left: '3%',
      right: '10%',
      bottom: '3%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.map(item => item.year),
      axisLine: {
        lineStyle: {
          color: theme.palette.divider
        }
      },
      axisLabel: {
        color: theme.palette.text.secondary
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: true,
        lineStyle: {
          color: theme.palette.divider
        }
      },
      axisLabel: {
        color: theme.palette.text.secondary,
        formatter: (value) => {
          if (value >= 1000000) {
            return `${currency.symbol}${(value / 1000000).toFixed(1)}M`;
          } else if (value >= 1000) {
            return `${currency.symbol}${(value / 1000).toFixed(0)}K`;
          }
          return `${currency.symbol}${value}`;
        }
      },
      splitLine: {
        lineStyle: {
          color: theme.palette.divider,
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: t('calculator.finalValue'),
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 4,
          color: theme.palette.primary.main
        },
        emphasis: {
          focus: 'series',
          itemStyle: {
            color: theme.palette.primary.dark
          }
        },
        data: data.map(item => item.investmentValue || 0)
      },
      {
        name: t('calculator.totalContributions'),
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 3,
          color: theme.palette.secondary.main,
          type: 'dashed'
        },
        emphasis: {
          focus: 'series',
          itemStyle: {
            color: theme.palette.secondary.dark
          }
        },
        data: data.map(item => item.totalInvestment || 0)  // 修改为使用totalInvestment字段
      },
      {
        name: t('calculator.inflationAdjusted'),
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 3,
          color: theme.palette.success.main,
          type: 'dotted'
        },
        emphasis: {
          focus: 'series',
          itemStyle: {
            color: theme.palette.success.dark
          }
        },
        data: data.map(item => item.inflationAdjustedValue || 0)
      }
    ]
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: '100%', width: '100%' }}
      theme={theme.palette.mode}
    />
  );
};

export default InvestmentResultsChart;