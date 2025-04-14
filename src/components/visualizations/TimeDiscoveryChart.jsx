// src/components/visualizations/TimeDiscoveryChart.js
import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  ComposedChart,
} from 'recharts';
import { getDiscoveryMethodInfo } from '../../utils/helpers';

const TimeDiscoveryChart = ({
  planets = [],
  width = 800,
  height = 400,
  chartType = 'line', // 'line', 'bar', 'area', 'composed'
  showByMethod = true,
  startYear = null,
  endYear = null,
}) => {
  const [timelineData, setTimelineData] = useState([]);
  const [discoveryMethods, setDiscoveryMethods] = useState([]);

  // Process data when planets change
  useEffect(() => {
    if (planets.length === 0) return;

    // Get all discovery methods
    const methods = [
      ...new Set(
        planets.filter((p) => p.discoverymethod).map((p) => p.discoverymethod)
      ),
    ];
    setDiscoveryMethods(methods);

    // Get year range
    const years = planets.filter((p) => p.disc_year).map((p) => p.disc_year);

    const minYear = startYear || Math.min(...years);
    const maxYear = endYear || Math.max(...years);

    // Create timeline data
    const timeline = [];

    // For each year in the range
    for (let year = minYear; year <= maxYear; year++) {
      const yearData = { year };

      // Count total for this year
      yearData.total = planets.filter((p) => p.disc_year === year).length;

      // Count by method if needed
      if (showByMethod) {
        methods.forEach((method) => {
          yearData[method] = planets.filter(
            (p) => p.disc_year === year && p.discoverymethod === method
          ).length;
        });
      }

      // Calculate cumulative total up to this year
      yearData.cumulative = planets.filter((p) => p.disc_year <= year).length;

      timeline.push(yearData);
    }

    setTimelineData(timeline);
  }, [planets, showByMethod, startYear, endYear]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-3 border border-gray-700 rounded shadow-lg">
          <p className="font-bold">{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {entry.name === 'total'
                ? 'Total: '
                : entry.name === 'cumulative'
                ? 'Cumulative: '
                : `${entry.name}: `}
              {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Generate colors for discovery methods
  const getMethodColor = (method) => {
    const colorMap = {
      Transit: '#4CAF50', // Green
      'Radial Velocity': '#2196F3', // Blue
      Imaging: '#9C27B0', // Purple
      Microlensing: '#FF9800', // Orange
      'Transit Timing Variations': '#E91E63', // Pink
      Astrometry: '#00BCD4', // Cyan
      total: '#FFC107', // Amber
      cumulative: '#607D8B', // Blue Gray
    };

    return colorMap[method] || '#9E9E9E'; // Gray default
  };

  // If no timeline data yet
  if (timelineData.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-800 rounded-lg">
        <p className="text-gray-400">Loading discovery timeline data...</p>
      </div>
    );
  }

  // Render appropriate chart type
  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart
              data={timelineData}
              margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
              barGap={0}
              barCategoryGap="10%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis
                dataKey="year"
                tick={{ fill: '#ddd' }}
                label={{
                  value: 'Year of Discovery',
                  position: 'bottom',
                  offset: 0,
                  style: { fill: '#ddd' },
                }}
              />
              <YAxis
                tick={{ fill: '#ddd' }}
                label={{
                  value: 'Number of Planets Discovered',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fill: '#ddd' },
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ bottom: -60 }}
                formatter={(value) => (
                  <span style={{ color: '#ddd' }}>{value}</span>
                )}
              />

              {showByMethod ? (
                // Show stacked bars by discovery method
                discoveryMethods.map((method) => (
                  <Bar
                    key={method}
                    dataKey={method}
                    name={method}
                    stackId="a"
                    fill={getMethodColor(method)}
                  />
                ))
              ) : (
                // Show just total discoveries per year
                <Bar
                  dataKey="total"
                  name="Planets Discovered"
                  fill={getMethodColor('total')}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart
              data={timelineData}
              margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis
                dataKey="year"
                tick={{ fill: '#ddd' }}
                label={{
                  value: 'Year of Discovery',
                  position: 'bottom',
                  offset: 0,
                  style: { fill: '#ddd' },
                }}
              />
              <YAxis
                tick={{ fill: '#ddd' }}
                label={{
                  value: 'Number of Planets Discovered',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fill: '#ddd' },
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ bottom: -60 }}
                formatter={(value) => (
                  <span style={{ color: '#ddd' }}>{value}</span>
                )}
              />

              {showByMethod ? (
                // Show areas by discovery method
                discoveryMethods.map((method) => (
                  <Area
                    key={method}
                    type="monotone"
                    dataKey={method}
                    name={method}
                    stackId="1"
                    fill={getMethodColor(method)}
                    stroke={getMethodColor(method)}
                    fillOpacity={0.6}
                  />
                ))
              ) : (
                // Show just total discoveries per year
                <Area
                  type="monotone"
                  dataKey="total"
                  name="Planets Discovered"
                  fill={getMethodColor('total')}
                  stroke={getMethodColor('total')}
                  fillOpacity={0.6}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'composed':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <ComposedChart
              data={timelineData}
              margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis
                dataKey="year"
                tick={{ fill: '#ddd' }}
                label={{
                  value: 'Year of Discovery',
                  position: 'bottom',
                  offset: 0,
                  style: { fill: '#ddd' },
                }}
              />
              <YAxis
                yAxisId="left"
                tick={{ fill: '#ddd' }}
                label={{
                  value: 'Discoveries per Year',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fill: '#ddd' },
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fill: '#ddd' }}
                label={{
                  value: 'Cumulative Discoveries',
                  angle: 90,
                  position: 'insideRight',
                  style: { fill: '#ddd' },
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ bottom: -60 }}
                formatter={(value) => (
                  <span style={{ color: '#ddd' }}>{value}</span>
                )}
              />

              {showByMethod ? (
                // Show bars by discovery method and cumulative line
                <>
                  {discoveryMethods.map((method) => (
                    <Bar
                      key={method}
                      dataKey={method}
                      name={method}
                      yAxisId="left"
                      stackId="a"
                      fill={getMethodColor(method)}
                    />
                  ))}
                  <Line
                    type="monotone"
                    dataKey="cumulative"
                    name="Cumulative Discoveries"
                    yAxisId="right"
                    stroke={getMethodColor('cumulative')}
                    dot={false}
                    strokeWidth={3}
                  />
                </>
              ) : (
                // Show total bars and cumulative line
                <>
                  <Bar
                    dataKey="total"
                    name="Planets Discovered"
                    yAxisId="left"
                    fill={getMethodColor('total')}
                  />
                  <Line
                    type="monotone"
                    dataKey="cumulative"
                    name="Cumulative Discoveries"
                    yAxisId="right"
                    stroke={getMethodColor('cumulative')}
                    dot={false}
                    strokeWidth={3}
                  />
                </>
              )}
            </ComposedChart>
          </ResponsiveContainer>
        );

      case 'line':
      default:
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart
              data={timelineData}
              margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis
                dataKey="year"
                tick={{ fill: '#ddd' }}
                label={{
                  value: 'Year of Discovery',
                  position: 'bottom',
                  offset: 0,
                  style: { fill: '#ddd' },
                }}
              />
              <YAxis
                tick={{ fill: '#ddd' }}
                label={{
                  value: 'Number of Planets Discovered',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fill: '#ddd' },
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ bottom: -60 }}
                formatter={(value) => (
                  <span style={{ color: '#ddd' }}>{value}</span>
                )}
              />

              {showByMethod ? (
                // Show lines by discovery method
                discoveryMethods.map((method) => (
                  <Line
                    key={method}
                    type="monotone"
                    dataKey={method}
                    name={method}
                    stroke={getMethodColor(method)}
                    activeDot={{ r: 8 }}
                  />
                ))
              ) : (
                // Show just total discoveries per year
                <Line
                  type="monotone"
                  dataKey="total"
                  name="Planets Discovered"
                  stroke={getMethodColor('total')}
                  activeDot={{ r: 8 }}
                  strokeWidth={3}
                />
              )}

              {/* Always show cumulative line */}
              <Line
                type="monotone"
                dataKey="cumulative"
                name="Cumulative Discoveries"
                stroke={getMethodColor('cumulative')}
                dot={false}
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="exoplanet-discovery-timeline bg-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">
          Exoplanet Discovery Timeline
        </h3>

        <div className="controls flex space-x-2">
          <select
            className="bg-gray-700 text-white rounded p-1 text-sm border-none"
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
          >
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
            <option value="area">Area Chart</option>
            <option value="composed">Composed Chart</option>
          </select>

          <button
            className={`px-3 py-1 rounded text-sm ${
              showByMethod
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300'
            }`}
            onClick={() => setShowByMethod(!showByMethod)}
          >
            {showByMethod ? 'Group by Method' : 'Show Total Only'}
          </button>
        </div>
      </div>

      <div className="chart-container">{renderChart()}</div>

      {/* Discovery method info */}
      {showByMethod && (
        <div className="method-info grid grid-cols-2 gap-4 mt-6">
          {discoveryMethods.map((method) => {
            const info = getDiscoveryMethodInfo(method);
            return (
              <div key={method} className="flex items-start space-x-2">
                <div
                  className="w-4 h-4 mt-1 rounded-full"
                  style={{ backgroundColor: getMethodColor(method) }}
                ></div>
                <div>
                  <h4 className="font-medium text-white">{info.displayName}</h4>
                  <p className="text-xs text-gray-400">{info.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-4 text-sm text-gray-400">
        <p>
          The first confirmed exoplanet around a Sun-like star, 51 Pegasi b, was
          discovered in 1995.
        </p>
        <p>
          The rate of discoveries increased dramatically after the launch of
          dedicated exoplanet missions like Kepler (2009-2018) and TESS
          (2018-present).
        </p>
      </div>
    </div>
  );
};

export default TimeDiscoveryChart;
