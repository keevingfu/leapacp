/**
 * Pie Chart Component
 * Displays data as a circular pie chart
 */

import React, { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import EChartsWrapper from './EChartsWrapper';

export interface PieChartData {
  name: string;
  value: number;
}

export interface PieChartProps {
  data: PieChartData[];
  title?: string;
  showLegend?: boolean;
  radius?: string | [string, string];
  height?: string;
  loading?: boolean;
}

const PieChart: React.FC<PieChartProps> = ({
  data,
  title,
  showLegend = true,
  radius = '50%',
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
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: showLegend ? {
      orient: 'vertical',
      left: 'left'
    } : undefined,
    series: [
      {
        name: title || 'Data',
        type: 'pie',
        radius: radius,
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          formatter: '{b}: {d}%'
        }
      }
    ]
  }), [data, title, showLegend, radius]);

  return (
    <EChartsWrapper
      option={option}
      style={{ height, width: '100%' }}
      loading={loading}
    />
  );
};

export default PieChart;
