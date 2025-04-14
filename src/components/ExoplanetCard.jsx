// src/components/ExoplanetCard.js
import React from 'react';
import {
  categorizePlanetType,
  calculateHabitabilityScore,
  isInHabitableZone,
} from '../utils/calculations';
import {
  formatDistance,
  formatTemperature,
  formatOrbitalPeriod,
  formatRadius,
  getPlanetTypeColor,
  getHabitabilityColor,
  getStarTypeColor,
} from '../utils/helpers';

const ExoplanetCard = ({
  planet,
  onClick,
  selected = false,
  compact = false,
}) => {
  if (!planet) return null;

  // Get planet type and score
  const planetType = categorizePlanetType(planet.pl_rade);
  const habitabilityScore = calculateHabitabilityScore(planet);
  const inHabitableZone = isInHabitableZone(planet);

  // Compact mode
  if (compact) {
    return (
      <div
        className={`exoplanet-card-compact bg-gray-800 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:bg-gray-700 border-2 ${
          selected ? 'border-blue-500' : 'border-transparent'
        }`}
        onClick={() => onClick && onClick(planet)}
      >
        <div className="flex items-center p-3">
          <div
            className="w-8 h-8 rounded-full mr-3 flex-shrink-0"
            style={{ backgroundColor: getPlanetTypeColor(planetType) }}
          ></div>

          <div className="flex-grow min-w-0">
            <h3 className="text-white font-medium truncate">
              {planet.pl_name}
            </h3>
            <p className="text-gray-400 text-xs truncate">{planet.hostname}</p>
          </div>

          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ml-2 flex-shrink-0"
            style={{ backgroundColor: getHabitabilityColor(habitabilityScore) }}
          >
            {habitabilityScore}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`exoplanet-card bg-gray-800 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:bg-gray-700 border-2 ${
        selected ? 'border-blue-500' : 'border-transparent'
      }`}
      onClick={() => onClick && onClick(planet)}
    >
      {/* Card Header */}
      <div className="p-4 border-b border-gray-700 relative">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-white">{planet.pl_name}</h3>
            <div className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{
                  backgroundColor: getStarTypeColor(planet.st_spectype),
                }}
              ></div>
              <p className="text-gray-400 text-sm">{planet.hostname}</p>
            </div>
          </div>

          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: getHabitabilityColor(habitabilityScore) }}
          >
            {habitabilityScore}
          </div>
        </div>

        {/* Discovery Tag */}
        <div className="absolute top-2 right-2">
          <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
            {planet.disc_year}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4">
        {/* Planet Type Indicator */}
        <div className="flex items-center mb-4">
          <div
            className="w-6 h-6 rounded-full mr-2"
            style={{ backgroundColor: getPlanetTypeColor(planetType) }}
          ></div>
          <span className="text-white text-sm">{planetType}</span>

          {/* Habitable Zone Indicator */}
          {inHabitableZone && (
            <span className="ml-auto bg-green-600 text-xs text-white px-2 py-1 rounded-full">
              Habitable Zone
            </span>
          )}
        </div>

        {/* Planet Metrics */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-gray-400">Size:</p>
            <p className="text-white">{formatRadius(planet.pl_rade)}</p>
          </div>

          <div>
            <p className="text-gray-400">Temperature:</p>
            <p className="text-white">{formatTemperature(planet.pl_eqt)}</p>
          </div>

          <div>
            <p className="text-gray-400">Distance:</p>
            <p className="text-white">{formatDistance(planet.st_dist, 'pc')}</p>
          </div>

          <div>
            <p className="text-gray-400">Orbit Period:</p>
            <p className="text-white">
              {formatOrbitalPeriod(planet.pl_orbper)}
            </p>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="bg-gray-700 px-4 py-2 flex justify-between items-center">
        <span className="text-gray-300 text-xs">
          {planet.discoverymethod || 'Unknown method'}
        </span>

        <button className="text-blue-400 text-sm hover:text-blue-300">
          View Details
        </button>
      </div>
    </div>
  );
};

export default ExoplanetCard;
