// src/components/visualizations/SizeComparisonChart.js
import React, { useState } from 'react';
import { categorizePlanetType } from '../../utils/calculations';
import { getPlanetTypeColor } from '../../utils/helpers';

const SizeComparisonChart = ({
  planets = [],
  selectedPlanet = null,
  width = 800,
  height = 400,
}) => {
  const [sortBy, setSortBy] = useState('size'); // 'size', 'temperature', 'distance', 'type'
  const [showLabels, setShowLabels] = useState(true);

  // Reference sizes for comparison
  const solarSystemReferences = [
    { name: 'Earth', radius: 1, color: '#4CAF50', type: 'Earth-like' },
    { name: 'Jupiter', radius: 11.2, color: '#FF9800', type: 'Gas Giant' },
    { name: 'Neptune', radius: 3.9, color: '#2196F3', type: 'Neptune-like' },
    { name: 'Mars', radius: 0.53, color: '#FF5722', type: 'Sub-Earth' },
  ];

  // Filter and sort planets (only those with radius data)
  const planetsWithData = [...planets].filter((p) => p.pl_rade);

  // Sort planets based on selected criteria
  const sortedPlanets = [...planetsWithData].sort((a, b) => {
    switch (sortBy) {
      case 'size':
        return b.pl_rade - a.pl_rade;
      case 'temperature':
        return (a.pl_eqt || 0) - (b.pl_eqt || 0);
      case 'distance':
        return (a.st_dist || 0) - (b.st_dist || 0);
      case 'type':
        return categorizePlanetType(a.pl_rade).localeCompare(
          categorizePlanetType(b.pl_rade)
        );
      default:
        return b.pl_rade - a.pl_rade;
    }
  });

  // Add reference planets to the visualization
  const allPlanetsForDisplay = [...sortedPlanets, ...solarSystemReferences];

  // Calculate max radius for scaling
  const maxRadius = Math.max(
    ...allPlanetsForDisplay.map((p) => p.radius || p.pl_rade)
  );

  // Helper function to calculate circle size based on planet radius
  const calculateCircleSize = (radiusEarth) => {
    // Use square root scaling to make the visualization more sensible
    // (actual area scales with radius^2, but that makes small planets too small)
    const maxDiameter = Math.min(width / 4, height - 80);
    return Math.max(
      10,
      (Math.sqrt(radiusEarth) / Math.sqrt(maxRadius)) * maxDiameter
    );
  };

  // Helper function to get planet color based on type
  const getPlanetColor = (planet) => {
    if (planet.color) return planet.color; // For reference planets

    const type = categorizePlanetType(planet.pl_rade);
    return getPlanetTypeColor(type);
  };

  // Generate x positions for planets
  const generatePlanetPositions = () => {
    const positions = [];
    const planetCount = allPlanetsForDisplay.length;
    const spacing = width / (planetCount + 1);

    allPlanetsForDisplay.forEach((planet, index) => {
      const isReference = solarSystemReferences.some(
        (ref) => ref.name === planet.name
      );
      const isSelected =
        selectedPlanet && selectedPlanet.pl_name === planet.pl_name;

      const position = {
        planet,
        x: spacing * (index + 1),
        y: height / 2,
        diameter: calculateCircleSize(planet.radius || planet.pl_rade),
        color: getPlanetColor(planet),
        isReference,
        isSelected,
      };

      positions.push(position);
    });

    return positions;
  };

  const planetPositions = generatePlanetPositions();

  return (
    <div className="size-comparison-chart bg-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">Planet Size Comparison</h3>

        <div className="controls flex space-x-2">
          <select
            className="bg-gray-700 text-white rounded p-1 text-sm border-none"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="size">Sort by Size</option>
            <option value="temperature">Sort by Temperature</option>
            <option value="distance">Sort by Distance</option>
            <option value="type">Sort by Type</option>
          </select>

          <button
            className={`px-3 py-1 rounded text-sm ${
              showLabels
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300'
            }`}
            onClick={() => setShowLabels(!showLabels)}
          >
            {showLabels ? 'Hide Labels' : 'Show Labels'}
          </button>
        </div>
      </div>

      <div className="visualization-container relative">
        <svg width={width} height={height} className="bg-gray-900 rounded-lg">
          {/* Planet circles */}
          {planetPositions.map((position, index) => (
            <g key={index}>
              <circle
                cx={position.x}
                cy={position.y}
                r={position.diameter / 2}
                fill={position.color}
                stroke={
                  position.isSelected
                    ? 'white'
                    : position.isReference
                    ? '#FFD700'
                    : 'none'
                }
                strokeWidth={
                  position.isSelected ? 3 : position.isReference ? 2 : 0
                }
                strokeDasharray={position.isReference ? '4,2' : 'none'}
                className={`transition-all duration-300 ${
                  position.isSelected ? 'animate-pulse' : ''
                }`}
              />

              {showLabels && (
                <>
                  <text
                    x={position.x}
                    y={position.y + position.diameter / 2 + 20}
                    textAnchor="middle"
                    fill={position.isReference ? '#FFD700' : 'white'}
                    fontSize={position.isSelected ? '14px' : '12px'}
                    fontWeight={position.isSelected ? 'bold' : 'normal'}
                  >
                    {position.planet.pl_name || position.planet.name}
                  </text>

                  <text
                    x={position.x}
                    y={position.y + position.diameter / 2 + 35}
                    textAnchor="middle"
                    fill="#AAA"
                    fontSize="10px"
                  >
                    {(
                      position.planet.radius || position.planet.pl_rade
                    ).toFixed(1)}{' '}
                    R⊕
                  </text>
                </>
              )}
            </g>
          ))}

          {/* Reference line for Earth size */}
          <line
            x1={20}
            y1={height - 20}
            x2={70}
            y2={height - 20}
            stroke="#4CAF50"
            strokeWidth={2}
          />
          <text x={75} y={height - 16} fill="#4CAF50" fontSize="12px">
            Earth (1 R⊕)
          </text>

          {/* Reference line for Jupiter size */}
          <line
            x1={width / 2}
            y1={height - 20}
            x2={width / 2 + 50}
            y2={height - 20}
            stroke="#FF9800"
            strokeWidth={2}
          />
          <text
            x={width / 2 + 55}
            y={height - 16}
            fill="#FF9800"
            fontSize="12px"
          >
            Jupiter (11.2 R⊕)
          </text>
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-4 gap-4">
        {[
          'Earth-like',
          'Super-Earth/Mini-Neptune',
          'Neptune-like',
          'Gas Giant',
        ].map((type) => (
          <div key={type} className="flex items-center">
            <div
              className="w-4 h-4 rounded-full mr-2"
              style={{ backgroundColor: getPlanetTypeColor(type) }}
            ></div>
            <span className="text-sm text-gray-300">{type}</span>
          </div>
        ))}
      </div>

      <p className="text-gray-400 text-sm mt-4">
        Size comparison of exoplanets in Earth radii (R⊕).
        {sortBy === 'size'
          ? ' Planets are sorted by size, largest to smallest.'
          : sortBy === 'temperature'
          ? ' Planets are sorted by temperature, coolest to hottest.'
          : sortBy === 'distance'
          ? ' Planets are sorted by distance from Earth, closest to farthest.'
          : ' Planets are sorted by type.'}
      </p>
    </div>
  );
};

export default SizeComparisonChart;
