// src/components/PlanetDetailModal.js
import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from 'recharts';

import HabitabilityScore from './visualizations/HabitabilityScore';
import OrbitVisualizer from './visualizations/OrbitVisualizer';
import {
  formatDistance,
  formatTemperature,
  formatMass,
  formatRadius,
  formatOrbitalPeriod,
  getStarTypeColor,
  getDiscoveryMethodInfo,
} from '../utils/helpers';
import {
  calculateHabitabilityScore,
  calculateRelativeSurfaceGravity,
  categorizePlanetType,
  isInHabitableZone,
} from '../utils/calculations';

const PlanetDetailModal = ({ planet, onClose, isOpen }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // If modal is not open or no planet is selected
  if (!isOpen || !planet) {
    return null;
  }

  

  // Discovery method pie chart data
  const starInfo = [
    { name: 'Temperature', value: planet.st_teff || 0 },
    { name: 'Radius', value: planet.st_rad || 0 },
    { name: 'Mass', value: planet.st_mass || 0 },
  ];
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  // Get discovery method info
  const discoveryInfo = getDiscoveryMethodInfo(planet.discoverymethod);

  // Calculate habitability status
  const habitabilityScore = calculateHabitabilityScore(planet);
  const inHabitableZone = isInHabitableZone(planet);
  const planetType = categorizePlanetType(planet.pl_rade);

  // Calculate relative gravity
  const surfaceGravity = calculateRelativeSurfaceGravity(
    planet.pl_bmasse,
    planet.pl_rade
  );

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'orbit':
        return (
          <div className="orbit-tab">
            <h3 className="text-lg font-medium text-white mb-4">
              Orbital Characteristics
            </h3>

            <div className="orbit-visualization mb-6">
              <OrbitVisualizer
                planets={[planet]}
                width={600}
                height={300}
                animated={true}
                selectedPlanetName={planet.pl_name}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700 p-3 rounded">
                <h4 className="text-sm font-medium text-gray-300">
                  Orbit Distance
                </h4>
                <p className="text-lg text-white">
                  {formatDistance(planet.pl_orbsmax, 'au')}
                </p>
              </div>

              <div className="bg-gray-700 p-3 rounded">
                <h4 className="text-sm font-medium text-gray-300">
                  Orbital Period
                </h4>
                <p className="text-lg text-white">
                  {formatOrbitalPeriod(planet.pl_orbper)}
                </p>
              </div>

              <div className="bg-gray-700 p-3 rounded">
                <h4 className="text-sm font-medium text-gray-300">
                  Orbit Eccentricity
                </h4>
                <p className="text-lg text-white">
                  {planet.pl_orbeccen
                    ? planet.pl_orbeccen.toFixed(3)
                    : 'Unknown'}
                </p>
              </div>

              <div className="bg-gray-700 p-3 rounded">
                <h4 className="text-sm font-medium text-gray-300">
                  Habitable Zone Status
                </h4>
                <p className="text-lg text-white">
                  {inHabitableZone
                    ? '✅ Within habitable zone'
                    : '❌ Outside habitable zone'}
                </p>
              </div>
            </div>

            <div className="orbit-notes mt-6 text-sm text-gray-400">
              <p>
                The habitable zone is the region around a star where conditions
                might allow liquid water on a planet's surface.
              </p>
              <p>
                A circular orbit (low eccentricity) typically provides more
                stable conditions for life.
              </p>
            </div>
          </div>
        );

      case 'star':
        return (
          <div className="star-tab">
            <h3 className="text-lg font-medium text-white mb-4">
              Host Star Information
            </h3>

            <div className="flex items-center mb-6">
              <div
                className="w-16 h-16 rounded-full mr-4"
                style={{
                  backgroundColor: getStarTypeColor(planet.st_spectype),
                }}
              ></div>

              <div>
                <h4 className="text-xl font-medium text-white">
                  {planet.hostname}
                </h4>
                <p className="text-gray-400">
                  {planet.st_spectype
                    ? `Spectral Type: ${planet.st_spectype}`
                    : 'Spectral type unknown'}
                </p>
                <p className="text-gray-400">
                  {planet.st_dist
                    ? `Distance from Earth: ${formatDistance(
                        planet.st_dist,
                        'pc'
                      )}`
                    : 'Distance unknown'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-700 p-3 rounded">
                <h4 className="text-sm font-medium text-gray-300">
                  Star Temperature
                </h4>
                <p className="text-lg text-white">
                  {planet.st_teff ? `${planet.st_teff} K` : 'Unknown'}
                </p>
              </div>

              <div className="bg-gray-700 p-3 rounded">
                <h4 className="text-sm font-medium text-gray-300">
                  Star Radius
                </h4>
                <p className="text-lg text-white">
                  {planet.st_rad
                    ? `${planet.st_rad} R☉ (Solar radii)`
                    : 'Unknown'}
                </p>
              </div>

              <div className="bg-gray-700 p-3 rounded">
                <h4 className="text-sm font-medium text-gray-300">Star Mass</h4>
                <p className="text-lg text-white">
                  {planet.st_mass
                    ? `${planet.st_mass} M☉ (Solar masses)`
                    : 'Unknown'}
                </p>
              </div>

              <div className="bg-gray-700 p-3 rounded">
                <h4 className="text-sm font-medium text-gray-300">
                  System Planet Count
                </h4>
                <p className="text-lg text-white">
                  {planet.sy_pnum ? `${planet.sy_pnum} planets` : 'Unknown'}
                </p>
              </div>
            </div>

            <div className="star-comparison mb-6">
              <h4 className="text-sm font-medium text-gray-300 mb-2">
                Star Properties Compared to Our Sun
              </h4>

              <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={starInfo}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {starInfo.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="star-notes text-sm text-gray-400">
              <p>
                Star spectral types range from hottest (O, B, A) to coolest (K,
                M).
              </p>
              <p>
                Our Sun is a G-type star with temperature 5772K, radius 1 R☉,
                and mass 1 M☉.
              </p>
              <p>
                The lifetime of a star depends on its mass - smaller stars live
                longer than larger ones.
              </p>
            </div>
          </div>
        );

      case 'habitability':
        return (
          <div className="habitability-tab">
            <HabitabilityScore planet={planet} showDetails={true} />
          </div>
        );

      case 'discovery':
        return (
          <div className="discovery-tab">
            <h3 className="text-lg font-medium text-white mb-4">
              Discovery Information
            </h3>

            <div className="discovery-details bg-gray-700 p-4 rounded mb-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3">
                  <span className="material-icons">{discoveryInfo.icon}</span>
                </div>

                <div>
                  <h4 className="font-medium text-white">
                    Discovered via {discoveryInfo.displayName}
                  </h4>
                  <p className="text-sm text-gray-300">
                    Year: {planet.disc_year}
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-300 mb-3">
                {discoveryInfo.description}
              </p>
            </div>

            <div className="bg-gray-800 p-4 border border-gray-700 rounded mb-6">
              <h4 className="font-medium text-white mb-2">
                About {discoveryInfo.displayName} Method
              </h4>
              <p className="text-sm text-gray-300">
                {discoveryInfo.description} This method is most sensitive to
                {planet.discoverymethod === 'Transit'
                  ? ' planets orbiting close to their stars.'
                  : planet.discoverymethod === 'Radial Velocity'
                  ? ' massive planets.'
                  : planet.discoverymethod === 'Imaging'
                  ? ' young planets far from their stars.'
                  : ' various types of planetary systems.'}
              </p>
            </div>

            <div className="discovery-statistics grid grid-cols-2 gap-4">
              <div className="bg-gray-700 p-3 rounded">
                <h4 className="text-sm font-medium text-gray-300">
                  Years Since Discovery
                </h4>
                <p className="text-lg text-white">
                  {planet.disc_year
                    ? `${new Date().getFullYear() - planet.disc_year} years`
                    : 'Unknown'}
                </p>
              </div>

              <div className="bg-gray-700 p-3 rounded">
                <h4 className="text-sm font-medium text-gray-300">
                  First of Its Kind?
                </h4>
                <p className="text-lg text-white">
                  {planet.pl_name === 'Kepler-186f' && planet.disc_year === 2014
                    ? '✅ First Earth-sized planet in habitable zone'
                    : planet.pl_name === 'K2-18b' && planet.disc_year === 2015
                    ? '✅ First habitable zone planet with detected water vapor'
                    : planet.pl_name === '51 Peg b' && planet.disc_year === 1995
                    ? '✅ First exoplanet around a Sun-like star'
                    : '❌ Not a first discovery milestone'}
                </p>
              </div>
            </div>
          </div>
        );

      case 'overview':
      default:
        return (
          <div className="overview-tab">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-4">
                  Planet Characteristics
                </h3>

                <div className="stats-grid grid grid-cols-2 gap-3">
                  <div className="bg-gray-700 p-3 rounded">
                    <h4 className="text-xs font-medium text-gray-300">
                      Planet Type
                    </h4>
                    <p className="text-base text-white">{planetType}</p>
                  </div>

                  <div className="bg-gray-700 p-3 rounded">
                    <h4 className="text-xs font-medium text-gray-300">
                      Radius
                    </h4>
                    <p className="text-base text-white">
                      {formatRadius(planet.pl_rade)}
                    </p>
                  </div>

                  <div className="bg-gray-700 p-3 rounded">
                    <h4 className="text-xs font-medium text-gray-300">Mass</h4>
                    <p className="text-base text-white">
                      {formatMass(planet.pl_bmasse)}
                    </p>
                  </div>

                  <div className="bg-gray-700 p-3 rounded">
                    <h4 className="text-xs font-medium text-gray-300">
                      Temperature
                    </h4>
                    <p className="text-base text-white">
                      {formatTemperature(planet.pl_eqt)}
                    </p>
                  </div>

                  <div className="bg-gray-700 p-3 rounded">
                    <h4 className="text-xs font-medium text-gray-300">
                      Orbital Period
                    </h4>
                    <p className="text-base text-white">
                      {formatOrbitalPeriod(planet.pl_orbper)}
                    </p>
                  </div>

                  <div className="bg-gray-700 p-3 rounded">
                    <h4 className="text-xs font-medium text-gray-300">
                      Distance from Star
                    </h4>
                    <p className="text-base text-white">
                      {formatDistance(planet.pl_orbsmax, 'au')}
                    </p>
                  </div>

                  <div className="bg-gray-700 p-3 rounded">
                    <h4 className="text-xs font-medium text-gray-300">
                      Surface Gravity
                    </h4>
                    <p className="text-base text-white">
                      {surfaceGravity !== null
                        ? `${surfaceGravity.toFixed(2)}g`
                        : 'Unknown'}
                    </p>
                  </div>

                  <div className="bg-gray-700 p-3 rounded">
                    <h4 className="text-xs font-medium text-gray-300">
                      Discovery Year
                    </h4>
                    <p className="text-base text-white">
                      {planet.disc_year || 'Unknown'}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-white mb-4">
                  Host Star
                </h3>

                <div className="flex items-center mb-4">
                  <div
                    className="w-12 h-12 rounded-full mr-3"
                    style={{
                      backgroundColor: getStarTypeColor(planet.st_spectype),
                    }}
                  ></div>

                  <div>
                    <h4 className="font-medium text-white">
                      {planet.hostname}
                    </h4>
                    <p className="text-sm text-gray-300">
                      {planet.st_spectype
                        ? `Type: ${planet.st_spectype}`
                        : 'Type unknown'}
                    </p>
                  </div>
                </div>

                <div className="stats-grid grid grid-cols-2 gap-3">
                  <div className="bg-gray-700 p-3 rounded">
                    <h4 className="text-xs font-medium text-gray-300">
                      Star Temperature
                    </h4>
                    <p className="text-base text-white">
                      {planet.st_teff ? `${planet.st_teff} K` : 'Unknown'}
                    </p>
                  </div>

                  <div className="bg-gray-700 p-3 rounded">
                    <h4 className="text-xs font-medium text-gray-300">
                      Star Mass
                    </h4>
                    <p className="text-base text-white">
                      {planet.st_mass ? `${planet.st_mass} M☉` : 'Unknown'}
                    </p>
                  </div>

                  <div className="bg-gray-700 p-3 rounded">
                    <h4 className="text-xs font-medium text-gray-300">
                      Distance from Earth
                    </h4>
                    <p className="text-base text-white">
                      {formatDistance(planet.st_dist, 'pc')}
                    </p>
                  </div>

                  <div className="bg-gray-700 p-3 rounded">
                    <h4 className="text-xs font-medium text-gray-300">
                      System Planets
                    </h4>
                    <p className="text-base text-white">
                      {planet.sy_pnum || 'Unknown'}
                    </p>
                  </div>
                </div>

                <h3 className="text-lg font-medium text-white mt-6 mb-4">
                  Habitability
                </h3>
                <HabitabilityScore planet={planet} compact={true} />
              </div>
            </div>

            {planet.description && (
              <div className="planet-description mt-6 bg-gray-700 p-4 rounded">
                <h3 className="text-lg font-medium text-white mb-2">
                  About {planet.pl_name}
                </h3>
                <p className="text-gray-300">{planet.description}</p>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="border-b border-gray-700 px-6 py-4 flex items-center justify-between sticky top-0 bg-gray-800 z-10">
          <div>
            <h2 className="text-2xl font-bold text-white">{planet.pl_name}</h2>
            <p className="text-gray-400">
              {planet.hostname} system · {formatDistance(planet.st_dist, 'pc')}{' '}
              away
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700 px-6 py-2 flex space-x-4 overflow-x-auto sticky top-16 bg-gray-800 z-10">
          <button
            className={`py-2 px-1 text-sm font-medium border-b-2 focus:outline-none ${
              activeTab === 'overview'
                ? 'text-blue-400 border-blue-400'
                : 'text-gray-400 border-transparent hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`py-2 px-1 text-sm font-medium border-b-2 focus:outline-none ${
              activeTab === 'orbit'
                ? 'text-blue-400 border-blue-400'
                : 'text-gray-400 border-transparent hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('orbit')}
          >
            Orbit
          </button>
          <button
            className={`py-2 px-1 text-sm font-medium border-b-2 focus:outline-none ${
              activeTab === 'star'
                ? 'text-blue-400 border-blue-400'
                : 'text-gray-400 border-transparent hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('star')}
          >
            Host Star
          </button>
          <button
            className={`py-2 px-1 text-sm font-medium border-b-2 focus:outline-none ${
              activeTab === 'habitability'
                ? 'text-blue-400 border-blue-400'
                : 'text-gray-400 border-transparent hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('habitability')}
          >
            Habitability
          </button>
          <button
            className={`py-2 px-1 text-sm font-medium border-b-2 focus:outline-none ${
              activeTab === 'discovery'
                ? 'text-blue-400 border-blue-400'
                : 'text-gray-400 border-transparent hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('discovery')}
          >
            Discovery
          </button>
        </div>

        {/* Content */}
        <div className="p-6">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default PlanetDetailModal;
