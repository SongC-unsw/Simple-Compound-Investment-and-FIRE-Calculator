import React from 'react';
import ReactECharts from 'echarts-for-react';
import { useTheme } from '@mui/material/styles';
import { useI18n } from '../../utils/i18n';

const ScenarioComparisonChart = ({ data }) => {
  const theme = useTheme();
  const { t } = useI18n();

  if (!data || data.length === 0) {
    return <div>{t('common.noData')}</div>;
  }

  const years = data[0].result.yearlyProjections.map(item => item.year);
  
  const series = data.map((scenario, index) => {
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.success.main,
      theme.palette.warning.main,
      theme.palette.error.main,
      theme.palette.info.main
    ];
    
    return {
      name: scenario.name,
      type: 'line',
      smooth: true,
      lineStyle: {
        width: 3,
        color: colors[index % colors.length]
      },
      symbolSize: 6,
      showSymbol: false,
      emphasis: {
        focus: 'series',
        itemStyle: {
          color: colors[index % colors.length]
        }
      },
      data: scenario.result.yearlyProjections.map(item => ({
        value: item.investmentValue,
        name: item.year
      }))
    };
  });

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        let result = `${params[0].axisValue}<br/>`;
        params.forEach(param => {
          const value = param.value?.value || 0;
          result += `${param.marker} ${param.seriesName}: ${value.toLocaleString()}<br/>`;
        });
        return result;
      }
    },
    legend: {
      data: data.map(item => item.name),
      textStyle: {
        color: theme.palette.text.primary
      },
      right: 10,
      top: 0
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
      data: years,
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
            return `${(value / 1000000).toFixed(1)}M`;
          } else if (value >= 1000) {
            return `${(value / 1000).toFixed(0)}K`;
          }
          return value;
        }
      },
      splitLine: {
        lineStyle: {
          color: theme.palette.divider,
          type: 'dashed'
        }
      }
    },
    series
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: '100%', width: '100%' }}
      theme={theme.palette.mode}
    />
  );
};

export default ScenarioComparisonChart;