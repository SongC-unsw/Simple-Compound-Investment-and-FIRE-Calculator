import React from 'react';
import ReactECharts from 'echarts-for-react';
import { useTheme } from '@mui/material/styles';
import { useI18n } from '../../utils/i18n';

const FireProjectionChart = ({ currentAge, fireAge, currentSavings, annualSavings, fireNumber, currency }) => {
  const theme = useTheme();
  const { t } = useI18n();

  // 生成投影数据
  const generateProjectionData = () => {
    const years = fireAge - currentAge;
    const data = [];
    let totalSavings = currentSavings;
    
    for (let i = 0; i <= years; i++) {
      data.push({
        age: currentAge + i,
        savings: totalSavings,
        status: totalSavings >= fireNumber ? 'achieved' : 'projected'
      });
      totalSavings += annualSavings;
    }
    
    return data;
  };

  const projectionData = generateProjectionData();
  const achievedIndex = projectionData.findIndex(item => item.status === 'achieved');

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      formatter: function(params) {
        let result = '';
        if (params && params.length > 0 && params[0].axisValue) {
          result = `${params[0].axisValue} ${t('fire.ageUnit')}<br/>`;
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
        t('fire.currentSavings'), 
        t('fire.fireNumber')
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
      data: projectionData.map(item => item.age),
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
        name: t('fire.currentSavings'),
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 4,
          color: theme.palette.primary.main
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
              color: `${theme.palette.primary.main}40`
            }, {
              offset: 1,
              color: `${theme.palette.primary.main}00`
            }]
          }
        },
        emphasis: {
          focus: 'series',
          itemStyle: {
            color: theme.palette.primary.dark
          }
        },
        data: projectionData.map(item => item.savings || 0)
      },
      {
        name: t('fire.fireNumber'),
        type: 'line',
        markLine: {
          silent: true,
          lineStyle: {
            color: theme.palette.secondary.main,
            type: 'dashed',
            width: 2
          },
          data: [{
            yAxis: fireNumber
          }],
          label: {
            position: 'end',
            formatter: t('fire.fireNumber'),
            color: theme.palette.text.primary
          }
        }
      },
      {
        type: 'scatter',
        symbolSize: 10,
        itemStyle: {
          color: theme.palette.success.main
        },
        data: achievedIndex >= 0 ? [{
          value: [projectionData[achievedIndex].age, projectionData[achievedIndex].savings],
          name: t('fire.achieved')
        }] : []
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

export default FireProjectionChart;