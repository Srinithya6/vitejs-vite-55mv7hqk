// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import FilterPanel from './FilterPanel';
import ExoplanetCard from './ExoplanetCard';
import PlanetDetailModal from './PlanetDetailModal';
import TimeDiscoveryChart from './visualizations/TimeDiscoveryChart';
import OrbitVisualizer from './visualizations/OrbitVisualizer';
import HabitabilityScore from './visualizations/HabitabilityScore';
import CompareSystems from './visualizations/CompareSystems';
import SizeComparisonChart from './visualizations/SizeComparisonChart';
import { filterPlanets } from '../utils/helpers';

const Dashboard = ({
  planets = [],
  isLoading = false,
  currentView = 'gallery',
}) => {
  // State for filters
  const [filters, setFilters] = useState({});

  // Filtered planets
  const [filteredPlanets, setFilteredPlanets] = useState(planets);

  // Selected planet for details
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Selected system for comparison
  const [selectedSystem, setSelectedSystem] = useState(null);

  // Grid layout settings
  const [gridColumns, setGridColumns] = useState(3);

  // Update filtered planets when filters or planets change
  useEffect(() => {
    const results = filterPlanets(planets, filters);
    setFilteredPlanets(results);
  }, [planets, filters]);

  // Handle planet selection
  const handlePlanetSelect = (planet) => {
    setSelectedPlanet(planet);
    setIsModalOpen(true);
  };

  // Handle system selection for comparison
  const handleSystemSelect = (planet) => {
    // Find all planets in this system
    const systemPlanets = planets.filter((p) => p.hostname === planet.hostname);
    setSelectedSystem(systemPlanets);
  };

  // Get unique systems
  const uniqueSystems = [...new Set(planets.map((planet) => planet.hostname))];

  // Render content based on current view
  const renderContent = () => {
    switch (currentView) {
      case 'chart':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <SizeComparisonChart
                planets={filteredPlanets}
                selectedPlanet={selectedPlanet}
                width={600}
                height={400}
              />
            </div>
            <div>
              <OrbitVisualizer
                planets={selectedSystem || filteredPlanets.slice(0, 5)}
                selectedPlanetName={selectedPlanet?.pl_name}
                width={600}
                height={400}
                animated={true}
              />
            </div>
          </div>
        );

      case 'compare':
        return (
          <div className="grid grid-cols-1 gap-6">
            {/* System selection */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-medium text-white mb-4">
                Select a Planetary System
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-60 overflow-y-auto">
                {uniqueSystems.map((system) => {
                  const systemPlanets = planets.filter(
                    (p) => p.hostname === system
                  );
                  const isSelected =
                    selectedSystem && selectedSystem[0].hostname === system;

                  return (
                    <button
                      key={system}
                      className={`text-left p-3 rounded ${
                        isSelected ? 'bg-blue-800' : 'bg-gray-700'
                      } hover:bg-blue-700`}
                      onClick={() => handleSystemSelect(systemPlanets[0])}
                    >
                      <h4 className="font-medium text-white">{system}</h4>
                      <p className="text-sm text-gray-300">
                        {systemPlanets.length} planets
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* System comparison */}
            <CompareSystems
              exoplanetSystem={selectedSystem || []}
              width={800}
              height={500}
              comparisonType="all"
            />
          </div>
        );

      case 'timeline':
        return (
          <div>
            <TimeDiscoveryChart
              planets={planets}
              width={800}
              height={500}
              chartType="composed"
              showByMethod={true}
            />
          </div>
        );

      case 'map':
        return (
          <div className="bg-gray-800 rounded-lg p-4 h-96 flex items-center justify-center">
            <p className="text-gray-400">
              Star Map visualization will be implemented in a future update.
            </p>
          </div>
        );

      case 'gallery':
      default:
        return (
          <div>
            {/* Controls for gallery view */}
            <div className="flex justify-between items-center mb-4">
              <div className="text-white">
                Showing{' '}
                <span className="font-medium">{filteredPlanets.length}</span> of{' '}
                <span className="font-medium">{planets.length}</span> exoplanets
              </div>

              <div className="flex space-x-2">
                <button
                  className={`p-2 rounded ${
                    gridColumns === 1 ? 'bg-blue-600' : 'bg-gray-700'
                  }`}
                  onClick={() => setGridColumns(1)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  className={`p-2 rounded ${
                    gridColumns === 2 ? 'bg-blue-600' : 'bg-gray-700'
                  }`}
                  onClick={() => setGridColumns(2)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  className={`p-2 rounded ${
                    gridColumns === 3 ? 'bg-blue-600' : 'bg-gray-700'
                  }`}
                  onClick={() => setGridColumns(3)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                  </svg>
                </button>
                <button
                  className={`p-2 rounded ${
                    gridColumns === 4 ? 'bg-blue-600' : 'bg-gray-700'
                  }`}
                  onClick={() => setGridColumns(4)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Planet cards grid */}
            <div
              className={`grid grid-cols-1 md:grid-cols-${gridColumns} gap-6`}
            >
              {filteredPlanets.map((planet) => (
                <ExoplanetCard
                  key={planet.pl_name}
                  planet={planet}
                  onClick={handlePlanetSelect}
                  selected={selectedPlanet?.pl_name === planet.pl_name}
                />
              ))}
            </div>

            {filteredPlanets.length === 0 && !isLoading && (
              <div className="bg-gray-800 rounded-lg p-8 text-center">
                <h3 className="text-lg font-medium text-white mb-2">
                  No planets match your filters
                </h3>
                <p className="text-gray-400">
                  Try adjusting your filter criteria to see more results.
                </p>
                <button
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => setFilters({})}
                >
                  Reset Filters
                </button>
              </div>
            )}

            {isLoading && (
              <div className="bg-gray-800 rounded-lg p-8 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-white mt-4">Loading exoplanet data...</p>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="dashboard">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar with filters */}
        <div className="md:col-span-1">
          <FilterPanel
            planets={planets}
            onFiltersChange={setFilters}
            initialFilters={filters}
            collapsible={true}
          />

          {selectedPlanet && (
            <div className="mt-6 bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-medium text-white mb-2">
                Selected Planet
              </h3>
              <ExoplanetCard
                planet={selectedPlanet}
                onClick={handlePlanetSelect}
                selected={true}
              />

              <div className="mt-4">
                <HabitabilityScore planet={selectedPlanet} compact={true} />
              </div>
            </div>
          )}
        </div>

        {/* Main content area */}
        <div className="md:col-span-3">{renderContent()}</div>
      </div>

      {/* Detail modal */}
      <PlanetDetailModal
        planet={selectedPlanet}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
