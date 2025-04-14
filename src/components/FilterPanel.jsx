// src/components/FilterPanel.js
import React, { useState, useEffect } from 'react';
import { categorizePlanetType } from '../utils/calculations';
import { getPlanetTypeColor } from '../utils/helpers';

const FilterPanel = ({
  planets = [],
  onFiltersChange,
  initialFilters = {},
  collapsible = true,
}) => {
  // Define available planet types
  const planetTypes = [
    'Earth-like',
    'Super-Earth/Mini-Neptune',
    'Neptune-like',
    'Gas Giant',
    'Sub-Earth',
  ];

  // Extract unique discovery methods from data
  const [discoveryMethods, setDiscoveryMethods] = useState([]);

  // Filter state
  const [filters, setFilters] = useState({
    planetTypes: initialFilters.planetTypes || [],
    discoveryMethods: initialFilters.discoveryMethods || [],
    yearRange: initialFilters.yearRange || [1990, new Date().getFullYear()],
    distanceRange: initialFilters.distanceRange || [0, 1000],
    temperatureRange: initialFilters.temperatureRange || [0, 3000],
    radiusRange: initialFilters.radiusRange || [0, 20],
    habitableOnly: initialFilters.habitableOnly || false,
    ...initialFilters,
  });

  // UI state
  const [isExpanded, setIsExpanded] = useState(!collapsible);
  const [yearMin, setYearMin] = useState(filters.yearRange[0]);
  const [yearMax, setYearMax] = useState(filters.yearRange[1]);
  const [distanceMin, setDistanceMin] = useState(filters.distanceRange[0]);
  const [distanceMax, setDistanceMax] = useState(filters.distanceRange[1]);
  const [tempMin, setTempMin] = useState(filters.temperatureRange[0]);
  const [tempMax, setTempMax] = useState(filters.temperatureRange[1]);
  const [radiusMin, setRadiusMin] = useState(filters.radiusRange[0]);
  const [radiusMax, setRadiusMax] = useState(filters.radiusRange[1]);

  // Extract discovery methods and data ranges when planets change
  useEffect(() => {
    if (planets.length === 0) return;

    // Get unique discovery methods
    const methods = [
      ...new Set(
        planets.filter((p) => p.discoverymethod).map((p) => p.discoverymethod)
      ),
    ];
    setDiscoveryMethods(methods);

    // Get min/max years
    const years = planets.filter((p) => p.disc_year).map((p) => p.disc_year);

    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);

    // Get min/max distances
    const distances = planets.filter((p) => p.st_dist).map((p) => p.st_dist);

    const minDist = Math.min(...distances);
    const maxDist = Math.max(...distances);

    // Get min/max temperatures
    const temps = planets.filter((p) => p.pl_eqt).map((p) => p.pl_eqt);

    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);

    // Get min/max radii
    const radii = planets.filter((p) => p.pl_rade).map((p) => p.pl_rade);

    const minRadius = Math.min(...radii);
    const maxRadius = Math.max(...radii);

    // Update filter state with data-driven ranges if not already set
    setFilters((prev) => ({
      ...prev,
      yearRange:
        prev.yearRange[0] === 1990 ? [minYear, maxYear] : prev.yearRange,
      distanceRange:
        prev.distanceRange[1] === 1000
          ? [minDist, maxDist]
          : prev.distanceRange,
      temperatureRange:
        prev.temperatureRange[1] === 3000
          ? [minTemp, maxTemp]
          : prev.temperatureRange,
      radiusRange:
        prev.radiusRange[1] === 20 ? [minRadius, maxRadius] : prev.radiusRange,
    }));

    // Update UI state too using current filters state
    setYearMin(filters.yearRange[0] === 1990 ? minYear : filters.yearRange[0]);
    setYearMax(filters.yearRange[1]);
    setDistanceMin(filters.distanceRange[0]);
    setDistanceMax(
      filters.distanceRange[1] === 1000 ? maxDist : filters.distanceRange[1]
    );
    setTempMin(filters.temperatureRange[0]);
    setTempMax(
      filters.temperatureRange[1] === 3000 ? maxTemp : filters.temperatureRange[1]
    );
    setRadiusMin(filters.radiusRange[0]);
    setRadiusMax(filters.radiusRange[1] === 20 ? maxRadius : filters.radiusRange[1]);
  }, [planets]);

  // Update parent component when filters change
  useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange(filters);
    }
  }, [filters, onFiltersChange]);

  // Handle planet type checkbox changes
  const handlePlanetTypeChange = (type) => {
    setFilters((prev) => {
      const updatedTypes = prev.planetTypes.includes(type)
        ? prev.planetTypes.filter((t) => t !== type)
        : [...prev.planetTypes, type];

      return {
        ...prev,
        planetTypes: updatedTypes,
      };
    });
  };

  // Handle discovery method checkbox changes
  const handleDiscoveryMethodChange = (method) => {
    setFilters((prev) => {
      const updatedMethods = prev.discoveryMethods.includes(method)
        ? prev.discoveryMethods.filter((m) => m !== method)
        : [...prev.discoveryMethods, method];

      return {
        ...prev,
        discoveryMethods: updatedMethods,
      };
    });
  };

  // Handle range inputs
  const handleYearRangeChange = () => {
    setFilters((prev) => ({
      ...prev,
      yearRange: [parseInt(yearMin), parseInt(yearMax)],
    }));
  };

  const handleDistanceRangeChange = () => {
    setFilters((prev) => ({
      ...prev,
      distanceRange: [parseFloat(distanceMin), parseFloat(distanceMax)],
    }));
  };

  const handleTemperatureRangeChange = () => {
    setFilters((prev) => ({
      ...prev,
      temperatureRange: [parseInt(tempMin), parseInt(tempMax)],
    }));
  };

  const handleRadiusRangeChange = () => {
    setFilters((prev) => ({
      ...prev,
      radiusRange: [parseFloat(radiusMin), parseFloat(radiusMax)],
    }));
  };

  // Toggle habitable only filter
  const handleHabitableToggle = () => {
    setFilters((prev) => ({
      ...prev,
      habitableOnly: !prev.habitableOnly,
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    const years = planets.filter((p) => p.disc_year).map((p) => p.disc_year);

    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);

    const distances = planets.filter((p) => p.st_dist).map((p) => p.st_dist);

    const minDist = Math.floor(Math.min(...distances));
    const maxDist = Math.ceil(Math.max(...distances));

    const temps = planets.filter((p) => p.pl_eqt).map((p) => p.pl_eqt);

    const minTemp = Math.floor(Math.min(...temps));
    const maxTemp = Math.ceil(Math.max(...temps));

    const radii = planets.filter((p) => p.pl_rade).map((p) => p.pl_rade);

    const minRadius = Math.floor(Math.min(...radii));
    const maxRadius = Math.ceil(Math.max(...radii));

    // Reset UI state
    setYearMin(minYear);
    setYearMax(maxYear);
    setDistanceMin(minDist);
    setDistanceMax(maxDist);
    setTempMin(minTemp);
    setTempMax(maxTemp);
    setRadiusMin(minRadius);
    setRadiusMax(maxRadius);

    // Reset filter state
    setFilters({
      planetTypes: [],
      discoveryMethods: [],
      yearRange: [minYear, maxYear],
      distanceRange: [minDist, maxDist],
      temperatureRange: [minTemp, maxTemp],
      radiusRange: [minRadius, maxRadius],
      habitableOnly: false,
    });
  };

  // Return count of active filters
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.planetTypes.length > 0) count++;
    if (filters.discoveryMethods.length > 0) count++;
    if (filters.habitableOnly) count++;

    // Check if ranges are different from defaults
    if (filters.yearRange[0] !== yearMin || filters.yearRange[1] !== yearMax)
      count++;
    if (
      filters.distanceRange[0] !== distanceMin ||
      filters.distanceRange[1] !== distanceMax
    )
      count++;
    if (
      filters.temperatureRange[0] !== tempMin ||
      filters.temperatureRange[1] !== tempMax
    )
      count++;
    if (
      filters.radiusRange[0] !== radiusMin ||
      filters.radiusRange[1] !== radiusMax
    )
      count++;

    return count;
  };

  return (
    <div className="filter-panel bg-gray-800 rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div
        className="px-4 py-3 bg-gray-700 flex justify-between items-center cursor-pointer"
        onClick={() => collapsible && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <h3 className="font-medium text-white">Filter Exoplanets</h3>
          {getActiveFilterCount() > 0 && (
            <span className="ml-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {getActiveFilterCount()}
            </span>
          )}
        </div>

        {collapsible && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 text-gray-300 transform transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>

      {/* Filter content */}
      {isExpanded && (
        <div className="p-4">
          {/* Planet Type Filters */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-300 mb-2">
              Planet Type
            </h4>
            <div className="space-y-2">
              {planetTypes.map((type) => (
                <div key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`type-${type}`}
                    className="h-4 w-4 text-blue-600"
                    checked={filters.planetTypes.includes(type)}
                    onChange={() => handlePlanetTypeChange(type)}
                  />
                  <label
                    htmlFor={`type-${type}`}
                    className="ml-2 text-sm text-gray-300 flex items-center"
                  >
                    <span
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: getPlanetTypeColor(type) }}
                    ></span>
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Discovery Method */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-300 mb-2">
              Discovery Method
            </h4>
            <div className="space-y-2">
              {discoveryMethods.map((method) => (
                <div key={method} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`method-${method}`}
                    className="h-4 w-4 text-blue-600"
                    checked={filters.discoveryMethods.includes(method)}
                    onChange={() => handleDiscoveryMethodChange(method)}
                  />
                  <label
                    htmlFor={`method-${method}`}
                    className="ml-2 text-sm text-gray-300"
                  >
                    {method}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Year Range */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-300 mb-2">
              Discovery Year
            </h4>
            <div className="flex space-x-4">
              <div>
                <label
                  htmlFor="year-min"
                  className="block text-xs text-gray-400"
                >
                  Min
                </label>
                <input
                  type="number"
                  id="year-min"
                  min="1990"
                  max={yearMax}
                  value={yearMin}
                  onChange={(e) => setYearMin(e.target.value)}
                  onBlur={handleYearRangeChange}
                  className="w-20 bg-gray-700 text-white text-sm rounded px-2 py-1"
                />
              </div>
              <div>
                <label
                  htmlFor="year-max"
                  className="block text-xs text-gray-400"
                >
                  Max
                </label>
                <input
                  type="number"
                  id="year-max"
                  min={yearMin}
                  max={new Date().getFullYear()}
                  value={yearMax}
                  onChange={(e) => setYearMax(e.target.value)}
                  onBlur={handleYearRangeChange}
                  className="w-20 bg-gray-700 text-white text-sm rounded px-2 py-1"
                />
              </div>
            </div>
          </div>

          {/* Distance Range */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-300 mb-2">
              Distance from Earth (parsecs)
            </h4>
            <div className="flex space-x-4">
              <div>
                <label
                  htmlFor="distance-min"
                  className="block text-xs text-gray-400"
                >
                  Min
                </label>
                <input
                  type="number"
                  id="distance-min"
                  min="0"
                  max={distanceMax}
                  value={distanceMin}
                  onChange={(e) => setDistanceMin(e.target.value)}
                  onBlur={handleDistanceRangeChange}
                  className="w-20 bg-gray-700 text-white text-sm rounded px-2 py-1"
                />
              </div>
              <div>
                <label
                  htmlFor="distance-max"
                  className="block text-xs text-gray-400"
                >
                  Max
                </label>
                <input
                  type="number"
                  id="distance-max"
                  min={distanceMin}
                  value={distanceMax}
                  onChange={(e) => setDistanceMax(e.target.value)}
                  onBlur={handleDistanceRangeChange}
                  className="w-20 bg-gray-700 text-white text-sm rounded px-2 py-1"
                />
              </div>
            </div>
          </div>

          {/* Temperature Range */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-300 mb-2">
              Temperature (Kelvin)
            </h4>
            <div className="flex space-x-4">
              <div>
                <label
                  htmlFor="temp-min"
                  className="block text-xs text-gray-400"
                >
                  Min
                </label>
                <input
                  type="number"
                  id="temp-min"
                  min="0"
                  max={tempMax}
                  value={tempMin}
                  onChange={(e) => setTempMin(e.target.value)}
                  onBlur={handleTemperatureRangeChange}
                  className="w-20 bg-gray-700 text-white text-sm rounded px-2 py-1"
                />
              </div>
              <div>
                <label
                  htmlFor="temp-max"
                  className="block text-xs text-gray-400"
                >
                  Max
                </label>
                <input
                  type="number"
                  id="temp-max"
                  min={tempMin}
                  value={tempMax}
                  onChange={(e) => setTempMax(e.target.value)}
                  onBlur={handleTemperatureRangeChange}
                  className="w-20 bg-gray-700 text-white text-sm rounded px-2 py-1"
                />
              </div>
            </div>

            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Earth: ~288K</span>
              <span>Habitable: ~180-310K</span>
            </div>
          </div>

          {/* Planet Radius Range */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-300 mb-2">
              Planet Radius (Earth radii)
            </h4>
            <div className="flex space-x-4">
              <div>
                <label
                  htmlFor="radius-min"
                  className="block text-xs text-gray-400"
                >
                  Min
                </label>
                <input
                  type="number"
                  id="radius-min"
                  min="0"
                  max={radiusMax}
                  step="0.1"
                  value={radiusMin}
                  onChange={(e) => setRadiusMin(e.target.value)}
                  onBlur={handleRadiusRangeChange}
                  className="w-20 bg-gray-700 text-white text-sm rounded px-2 py-1"
                />
              </div>
              <div>
                <label
                  htmlFor="radius-max"
                  className="block text-xs text-gray-400"
                >
                  Max
                </label>
                <input
                  type="number"
                  id="radius-max"
                  min={radiusMin}
                  step="0.1"
                  value={radiusMax}
                  onChange={(e) => setRadiusMax(e.target.value)}
                  onBlur={handleRadiusRangeChange}
                  className="w-20 bg-gray-700 text-white text-sm rounded px-2 py-1"
                />
              </div>
            </div>

            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Earth: 1R⊕</span>
              <span>Jupiter: ~11R⊕</span>
            </div>
          </div>

          {/* Habitability Toggle */}
          <div className="mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="habitable-toggle"
                className="h-4 w-4 text-blue-600"
                checked={filters.habitableOnly}
                onChange={handleHabitableToggle}
              />
              <label
                htmlFor="habitable-toggle"
                className="ml-2 text-sm text-gray-300"
              >
                Show only potentially habitable planets
              </label>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Planets with temperatures between 180-310K and sizes less than 2.5
              Earth radii
            </p>
          </div>

          {/* Filter actions */}
          <div className="flex justify-between">
            <button
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700"
              onClick={resetFilters}
            >
              Reset Filters
            </button>

            <span className="text-sm text-gray-400">
              Showing {getActiveFilterCount() > 0 ? 'filtered' : 'all'} planets
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
