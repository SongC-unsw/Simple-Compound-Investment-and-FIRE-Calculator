import React from 'react';
import ReactECharts from 'echarts-for-react';
import { useTheme } from '@mui/material/styles';
import { useI18n } from '../../utils/i18n';

const WithdrawalStrategyChart = ({ data, currency }) => {
  const theme = useTheme();
  const { t } = useI18n();

  if (!data || data.length === 0) {
    return <div>{t('common.noData')}</div>;
  }

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: theme.palette.background.paper
        }
      },
      formatter: function(params) {
        let result = '';
        if (params && params.length > 0 && params[0].axisValue) {
          result = `${params[0].axisValue}<br/>`;
          params.forEach(param => {
            if (param && param.seriesName) {
              const value = param.value || 0;
              result += `${param.marker} ${param.seriesName}: ${currency.symbol}${value.toLocaleString()}<br/>`;
            }
          });
        }
        return result;
      }
    },
    legend: {
      data: [
        t('fire.withdrawalAmount'), // 使用翻译后的提款金额
        t('fire.portfolioValue')    // 使用翻译后的投资组合价值
      ],
      textStyle: {
        color: theme.palette.text.primary
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
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
    yAxis: [
      {
        type: 'value',
        name: t('fire.withdrawalAmount'), // 使用翻译后的提款金额
        position: 'left',
        axisLine: {
          show: true,
          lineStyle: {
            color: theme.palette.primary.main
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
      {
        type: 'value',
        name: t('fire.portfolioValue'), // 使用翻译后的投资组合价值
        position: 'right',
        axisLine: {
          show: true,
          lineStyle: {
            color: theme.palette.secondary.main
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
          show: false
        }
      }
    ],
    series: [
      {
        name: t('fire.withdrawalAmount'), // 使用翻译后的提款金额
        type: 'bar',
        yAxisIndex: 0,
        itemStyle: {
          color: theme.palette.primary.main,
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            color: theme.palette.primary.dark
          }
        },
        data: data.map(item => item.withdrawal || 0)
      },
      {
        name: t('fire.portfolioValue'), // 使用翻译后的投资组合价值
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        lineStyle: {
          width: 4,
          color: theme.palette.secondary.main
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: `${theme.palette.secondary.main}40`
            }, {
              offset: 1,
              color: `${theme.palette.secondary.main}00`
            }]
          }
        },
        emphasis: {
          focus: 'series',
          itemStyle: {
            color: theme.palette.secondary.dark
          }
        },
        data: data.map(item => item.portfolioValue || 0)
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

export default WithdrawalStrategyChart;