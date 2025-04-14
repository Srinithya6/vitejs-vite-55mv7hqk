// src/components/visualizations/CompareSystems.js
import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
} from 'recharts';
import { categorizePlanetType } from '../../utils/calculations';
import { getPlanetTypeColor } from '../../utils/helpers';

// Solar System data for comparison
const solarSystemPlanets = [
  {
    name: 'Mercury',
    distance: 0.39,
    radius: 0.383,
    temperature: 340,
    type: 'Sub-Earth',
  },
  {
    name: 'Venus',
    distance: 0.72,
    radius: 0.949,
    temperature: 737,
    type: 'Earth-like',
  },
  {
    name: 'Earth',
    distance: 1.0,
    radius: 1.0,
    temperature: 288,
    type: 'Earth-like',
  },
  {
    name: 'Mars',
    distance: 1.52,
    radius: 0.532,
    temperature: 210,
    type: 'Sub-Earth',
  },
  {
    name: 'Jupiter',
    distance: 5.2,
    radius: 11.21,
    temperature: 165,
    type: 'Gas Giant',
  },
  {
    name: 'Saturn',
    distance: 9.58,
    radius: 9.45,
    temperature: 134,
    type: 'Gas Giant',
  },
  {
    name: 'Uranus',
    distance: 19.22,
    radius: 4.01,
    temperature: 76,
    type: 'Neptune-like',
  },
  {
    name: 'Neptune',
    distance: 30.05,
    radius: 3.88,
    temperature: 72,
    type: 'Neptune-like',
  },
];

const CompareSystems = ({
  exoplanetSystem = [],
  solarSystem = solarSystemPlanets,
  width = 800,
  height = 500,
  comparisonType = 'all', // 'all', 'distance', 'size', 'temperature'
}) => {
  const [formattedExoData, setFormattedExoData] = useState([]);
  const [formattedSolarData, setFormattedSolarData] = useState([]);

  // Process exoplanet system data for visualization
  useEffect(() => {
    if (exoplanetSystem.length === 0) return;

    // Get host star name from first planet
    const hostStar = exoplanetSystem[0].hostname || 'Unknown Star';

    // Format exoplanet data
    const exoData = exoplanetSystem
      .filter((planet) => planet.pl_orbsmax && planet.pl_rade) // Only planets with necessary data
      .map((planet) => ({
        name: planet.pl_name,
        distance: planet.pl_orbsmax,
        radius: planet.pl_rade,
        temperature: planet.pl_eqt || 'Unknown',
        type: categorizePlanetType(planet.pl_rade),
        system: hostStar,
      }))
      .sort((a, b) => a.distance - b.distance); // Sort by distance from star

    setFormattedExoData(exoData);

    // Format solar system data
    const solarData = solarSystem.map((planet) => ({
      ...planet,
      system: 'Solar System',
    }));

    setFormattedSolarData(solarData);
  }, [exoplanetSystem]);

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 p-3 border border-gray-700 rounded shadow-lg">
          <p className="font-bold text-sm">{data.name}</p>
          <p className="text-xs text-gray-300">{data.system}</p>
          <div className="text-xs mt-1">
            <p>Distance: {data.distance} AU</p>
            <p>Radius: {data.radius} R⊕</p>
            <p>Temperature: {data.temperature} K</p>
            <p>Type: {data.type}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Render the appropriate comparison chart
  const renderComparisonChart = () => {
    // Combine both datasets
    const combinedData = [...formattedSolarData, ...formattedExoData];

    if (comparisonType === 'distance' || comparisonType === 'size') {
      // Bar chart for distance or size comparison
      const dataKey = comparisonType === 'distance' ? 'distance' : 'radius';
      const yAxisLabel =
        comparisonType === 'distance'
          ? 'Distance from Star (AU)'
          : 'Planet Radius (Earth radii)';

      return (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={combinedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={70}
              tick={{ fill: '#ddd', fontSize: 12 }}
            />
            <YAxis
              label={{
                value: yAxisLabel,
                angle: -90,
                position: 'insideLeft',
                style: { fill: '#ddd' },
              }}
              tick={{ fill: '#ddd' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ bottom: 0, left: 0 }}
              formatter={(value) => (
                <span style={{ color: '#ddd' }}>{value}</span>
              )}
            />
            <Bar
              dataKey={dataKey}
              name="Solar System"
              fill="#FFC107"
              stackId="a"
              onlyForSolarSystem
              hide={!formattedSolarData.length}
            />
            <Bar
              dataKey={dataKey}
              name={exoplanetSystem[0]?.hostname || 'Exoplanet System'}
              fill="#3F51B5"
              stackId="b"
              onlyForExoSystem
              hide={!formattedExoData.length}
            />
          </BarChart>
        </ResponsiveContainer>
      );
    } else if (comparisonType === 'temperature') {
      // Temperature comparison
      return (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={combinedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={70}
              tick={{ fill: '#ddd', fontSize: 12 }}
            />
            <YAxis
              label={{
                value: 'Temperature (K)',
                angle: -90,
                position: 'insideLeft',
                style: { fill: '#ddd' },
              }}
              tick={{ fill: '#ddd' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ bottom: 0, left: 0 }}
              formatter={(value) => (
                <span style={{ color: '#ddd' }}>{value}</span>
              )}
            />
            <Bar
              dataKey="temperature"
              name="Solar System"
              fill="#FF5722"
              stackId="a"
              onlyForSolarSystem
              hide={!formattedSolarData.length}
            />
            <Bar
              dataKey="temperature"
              name={exoplanetSystem[0]?.hostname || 'Exoplanet System'}
              fill="#E91E63"
              stackId="b"
              onlyForExoSystem
              hide={!formattedExoData.length}
            />
          </BarChart>
        </ResponsiveContainer>
      );
    } else {
      // Scatter plot for overall comparison (distance vs size with temperature as color)
      return (
        <ResponsiveContainer width="100%" height={height}>
          <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis
              type="number"
              dataKey="distance"
              name="Distance"
              label={{
                value: 'Distance from Star (AU)',
                position: 'bottom',
                offset: 0,
                style: { fill: '#ddd' },
              }}
              tick={{ fill: '#ddd' }}
              domain={[0, 'dataMax']}
            />
            <YAxis
              type="number"
              dataKey="radius"
              name="Radius"
              label={{
                value: 'Planet Radius (Earth radii)',
                angle: -90,
                position: 'insideLeft',
                style: { fill: '#ddd' },
              }}
              tick={{ fill: '#ddd' }}
              domain={[0, 'dataMax']}
            />
            <ZAxis
              type="number"
              dataKey="temperature"
              range={[50, 400]}
              name="Temperature"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ bottom: 0, left: 0 }}
              formatter={(value) => (
                <span style={{ color: '#ddd' }}>{value}</span>
              )}
            />
            <Scatter
              name="Solar System"
              data={formattedSolarData}
              fill="#FFC107"
              shape="circle"
            />
            <Scatter
              name={exoplanetSystem[0]?.hostname || 'Exoplanet System'}
              data={formattedExoData}
              fill="#3F51B5"
              shape="star"
            />
          </ScatterChart>
        </ResponsiveContainer>
      );
    }
  };

  // If no exoplanet system is loaded yet
  if (formattedExoData.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-800 rounded-lg">
        <p className="text-gray-400">
          Select an exoplanet system to compare with the Solar System
        </p>
      </div>
    );
  }

  return (
    <div className="system-comparison bg-gray-800 rounded-lg p-4">
      <h3 className="text-xl font-bold text-white mb-6">
        {exoplanetSystem[0]?.hostname || 'Exoplanet System'} vs. Solar System
      </h3>

      <div className="comparison-view">{renderComparisonChart()}</div>

      <div className="comparison-tabs flex space-x-2 mt-4">
        <button
          className={`px-4 py-2 rounded text-sm font-medium ${
            comparisonType === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300'
          }`}
          onClick={() => setComparisonType('all')}
        >
          Overview
        </button>
        <button
          className={`px-4 py-2 rounded text-sm font-medium ${
            comparisonType === 'distance'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300'
          }`}
          onClick={() => setComparisonType('distance')}
        >
          Distance
        </button>
        <button
          className={`px-4 py-2 rounded text-sm font-medium ${
            comparisonType === 'size'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300'
          }`}
          onClick={() => setComparisonType('size')}
        >
          Size
        </button>
        <button
          className={`px-4 py-2 rounded text-sm font-medium ${
            comparisonType === 'temperature'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300'
          }`}
          onClick={() => setComparisonType('temperature')}
        >
          Temperature
        </button>
      </div>

      <div className="comparison-notes mt-4 text-sm text-gray-400">
        <p>
          Note: Distances shown in Astronomical Units (AU), where 1 AU is the
          distance from Earth to the Sun.
        </p>
        <p>
          Planet sizes shown in Earth radii (R⊕), where 1 R⊕ is the radius of
          Earth.
        </p>
        <p>Temperatures shown in Kelvin (K).</p>
      </div>
    </div>
  );
};

export default CompareSystems;
