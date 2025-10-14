/**
 * Line Chart Component
 * Displays data as a line chart for trend visualization
 */

import React, { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import EChartsWrapper from './EChartsWrapper';

export interface LineChartDataPoint {
  name: string;
  value: number;
}

export interface LineChartProps {
  data: LineChartDataPoint[];
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  color?: string;
  smooth?: boolean;
  areaStyle?: boolean;
  height?: string;
  loading?: boolean;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  title,
  xAxisLabel,
  yAxisLabel,
  color = '#91CC75',
  smooth = true,
  areaStyle = false,
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
      trigger: 'axis'
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
      data: data.map(item => item.name),
      name: xAxisLabel
    },
    yAxis: {
      type: 'value',
      name: yAxisLabel
    },
    series: [
      {
        type: 'line',
        data: data.map(item => item.value),
        smooth: smooth,
        lineStyle: {
          color: color,
          width: 2
        },
        itemStyle: {
          color: color
        },
        areaStyle: areaStyle ? {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: color + '80' },
              { offset: 1, color: color + '10' }
            ]
          }
        } : undefined,
        emphasis: {
          focus: 'series'
        }
      }
    ]
  }), [data, title, xAxisLabel, yAxisLabel, color, smooth, areaStyle]);

  return (
    <EChartsWrapper
      option={option}
      style={{ height, width: '100%' }}
      loading={loading}
    />
  );
};

export default LineChart;
