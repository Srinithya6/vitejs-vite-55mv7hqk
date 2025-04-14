// src/components/visualizations/OrbitVisualizer.js
import React, { useState, useEffect, useRef } from 'react';
import { generateOrbitCoordinates } from '../../utils/calculations';
import { getStarTypeColor } from '../../utils/helpers';

const OrbitVisualizer = ({
  planets = [],
  selectedPlanetName = null,
  width = 800,
  height = 400,
  animated = true,
}) => {
  const [planetPositions, setPlanetPositions] = useState({});
  const animationRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  // Function to set up planet orbits
  const setupOrbits = () => {
    // Find the maximum orbital distance to set scale
    const maxOrbit = Math.max(...planets.map((p) => p.pl_orbsmax || 0)) || 1;

    // Scale factor to fit within SVG
    const scaleFactor = (width * 0.4) / maxOrbit;

    // Generate orbit paths and initial positions
    const newPositions = {};
    planets.forEach((planet) => {
      if (planet.pl_orbsmax) {
        // Generate orbit path coordinates
        const orbitCoordinates = generateOrbitCoordinates(
          planet.pl_orbsmax,
          planet.pl_orbeccen || 0,
          100
        );

        // Scale coordinates
        const scaledCoordinates = orbitCoordinates.map((point) => ({
          x: point.x * scaleFactor,
          y: point.y * scaleFactor,
        }));

        // Set initial position (first point in orbit)
        newPositions[planet.pl_name] = {
          coordinates: scaledCoordinates,
          currentPosition: { ...scaledCoordinates[0] },
          radius: calculatePlanetRadius(planet.pl_rade),
          color: determinePlanetColor(planet),
        };
      }
    });

    setPlanetPositions(newPositions);
  };

  // Calculate planet radius for display (scaled for visualization)
  const calculatePlanetRadius = (earthRadii) => {
    if (!earthRadii) return 4;
    // Scale planet sizes (logarithmic to show relative differences)
    return Math.max(4, Math.min(20, 4 + Math.log2(earthRadii) * 4));
  };

  // Determine planet color based on type
  const determinePlanetColor = (planet) => {
    if (!planet.pl_rade) return '#888888';

    if (planet.pl_rade < 1.6) {
      return '#4CAF50'; // Earth-like planets (green)
    } else if (planet.pl_rade < 4) {
      return '#2196F3'; // Super-Earth/Mini-Neptune (blue)
    } else if (planet.pl_rade < 10) {
      return '#3F51B5'; // Neptune-like (indigo)
    } else {
      return '#FF9800'; // Gas giants (orange)
    }
  };

  // Animation function to update planet positions
  const animatePlanets = () => {
    if (!animated) return;

    const elapsedMs = Date.now() - startTimeRef.current;

    setPlanetPositions((prevPositions) => {
      const newPositions = { ...prevPositions };

      // Update position of each planet
      Object.keys(newPositions).forEach((planetName) => {
        const planet = planets.find((p) => p.pl_name === planetName);
        if (!planet || !planet.pl_orbper) return;

        const orbitData = newPositions[planetName];
        const coordinates = orbitData.coordinates;

        // Calculate position based on orbital period
        // Convert orbital period from days to milliseconds
        const orbitalPeriodMs = planet.pl_orbper * 24 * 60 * 60 * 1000;

        // Scale down for animation (use shorter periods for visual effect)
        const scaledPeriodMs = orbitalPeriodMs / 100;

        // Calculate current position in orbit (0 to 1)
        const orbitalPosition = (elapsedMs % scaledPeriodMs) / scaledPeriodMs;

        // Find the index in the coordinate array
        const index = Math.floor(orbitalPosition * coordinates.length);

        // Update current position
        newPositions[planetName].currentPosition = coordinates[index];
      });

      return newPositions;
    });

    animationRef.current = requestAnimationFrame(animatePlanets);
  };

  // Set up orbits when planets change
  useEffect(() => {
    setupOrbits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planets, width, height]);

  // Handle animation
  useEffect(() => {
    if (animated) {
      startTimeRef.current = Date.now();
      animationRef.current = requestAnimationFrame(animatePlanets);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planets, animated]);

  // Create SVG paths for orbits
  const createOrbitPath = (coordinates) => {
    if (!coordinates || coordinates.length === 0) return '';

    return (
      coordinates
        .map((point, index) => {
          return index === 0
            ? `M ${point.x + width / 2} ${point.y + height / 2}`
            : `L ${point.x + width / 2} ${point.y + height / 2}`;
        })
        .join(' ') + ' Z'
    );
  };

  // Get star spectral type from the first planet
  const getStarType = () => {
    if (planets.length > 0 && planets[0].st_spectype) {
      return planets[0].st_spectype;
    }
    return 'G';
  };

  return (
    <div className="orbit-visualizer-container relative">
      <svg
        width={width}
        height={height}
        className="bg-gray-900 rounded-lg overflow-hidden"
      >
        {/* Star in the center */}
        <circle
          cx={width / 2}
          cy={height / 2}
          r={10}
          fill={getStarTypeColor(getStarType())}
          filter="blur(2px)"
          className="animate-pulse"
        />

        {/* Orbit paths */}
        {Object.entries(planetPositions).map(([planetName, orbitData]) => (
          <path
            key={`orbit-${planetName}`}
            d={createOrbitPath(orbitData.coordinates)}
            fill="none"
            stroke="#444444"
            strokeWidth={1}
            opacity={0.7}
            strokeDasharray={
              selectedPlanetName && selectedPlanetName !== planetName
                ? '3,3'
                : 'none'
            }
          />
        ))}

        {/* Planets */}
        {Object.entries(planetPositions).map(([planetName, orbitData]) => {
          const isSelected = selectedPlanetName === planetName;
          const position = orbitData.currentPosition;

          return (
            <g key={`planet-${planetName}`}>
              <circle
                cx={position.x + width / 2}
                cy={position.y + height / 2}
                r={orbitData.radius}
                fill={orbitData.color}
                stroke={isSelected ? '#ffffff' : 'none'}
                strokeWidth={isSelected ? 2 : 0}
                className={isSelected ? 'animate-pulse' : ''}
              />

              {isSelected && (
                <text
                  x={position.x + width / 2}
                  y={position.y + height / 2 - orbitData.radius - 10}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="12px"
                >
                  {planetName}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Controls */}
      <div className="absolute bottom-2 right-2">
        <button
          className="bg-gray-800 text-white px-2 py-1 rounded text-sm"
          onClick={() => {
            if (animated) {
              cancelAnimationFrame(animationRef.current);
            } else {
              startTimeRef.current = Date.now();
              animationRef.current = requestAnimationFrame(animatePlanets);
            }
          }}
        >
          {animated ? 'Pause' : 'Animate'}
        </button>
      </div>
    </div>
  );
};

export default OrbitVisualizer;
