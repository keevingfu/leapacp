/**
 * Bar Chart Component
 * Displays data as vertical bars
 */

import React, { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import EChartsWrapper from './EChartsWrapper';

export interface BarChartData {
  name: string;
  value: number;
}

export interface BarChartProps {
  data: BarChartData[];
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  color?: string;
  height?: string;
  loading?: boolean;
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  xAxisLabel,
  yAxisLabel,
  color = '#5470C6',
  height = '400px',
  loading = false
}) => {
  const option: EChartsOption = useMemo(() => ({
    title: title ? {
      text: title,
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold'
      }
    } : undefined,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
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
      data: data.map(item => item.name),
      name: xAxisLabel,
      axisLabel: {
        interval: 0,
        rotate: data.length > 8 ? 45 : 0
      }
    },
    yAxis: {
      type: 'value',
      name: yAxisLabel
    },
    series: [
      {
        type: 'bar',
        data: data.map(item => item.value),
        itemStyle: {
          color: color
        },
        emphasis: {
          itemStyle: {
            color: color,
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }), [data, title, xAxisLabel, yAxisLabel, color]);

  return (
    <EChartsWrapper
      option={option}
      style={{ height, width: '100%' }}
      loading={loading}
    />
  );
};

export default BarChart;
