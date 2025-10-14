/**
 * ECharts Wrapper Component
 * Generic wrapper for all ECharts visualizations with responsive behavior
 */

import React, { useRef, useEffect } from 'react';
import * as echarts from 'echarts';
import type { EChartsOption, ECharts } from 'echarts';

export interface EChartsWrapperProps {
  option: EChartsOption;
  style?: React.CSSProperties;
  className?: string;
  loading?: boolean;
  theme?: 'light' | 'dark';
  onChartReady?: (chart: ECharts) => void;
}

const EChartsWrapper: React.FC<EChartsWrapperProps> = ({
  option,
  style = { height: '400px', width: '100%' },
  className = '',
  loading = false,
  theme = 'light',
  onChartReady
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<ECharts | null>(null);

  // Initialize chart
  useEffect(() => {
    if (!chartRef.current) return;

    // Create chart instance
    const chart = echarts.init(chartRef.current, theme);
    chartInstanceRef.current = chart;

    // Notify parent component
    if (onChartReady) {
      onChartReady(chart);
    }

    // Handle window resize
    const handleResize = () => {
      chart.resize();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [theme, onChartReady]);

  // Update chart option
  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.setOption(option, true);
    }
  }, [option]);

  // Handle loading state
  useEffect(() => {
    if (chartInstanceRef.current) {
      if (loading) {
        chartInstanceRef.current.showLoading();
      } else {
        chartInstanceRef.current.hideLoading();
      }
    }
  }, [loading]);

  return <div ref={chartRef} style={style} className={className} />;
};

export default EChartsWrapper;
