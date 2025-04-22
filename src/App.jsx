// src/App.jsx
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Dashboard from './components/Dashboard.jsx';
import sampleExoplanets from './data/sampleExoplanets.js';
import * as exoplanetAPI from './services/exoplanetAPI.js';

const App = () => {
  // State for exoplanet data
  const [planets, setPlanets] = useState(sampleExoplanets);
  const [isLoading, setIsLoading] = useState(false);

  // State for app configuration
  const [dataSource, setDataSource] = useState('sample'); // 'sample' or 'api'
  const [currentView, setCurrentView] = useState('gallery'); // 'gallery', 'chart', 'compare', 'timeline', 'map'

  // Load data from API when data source changes
  useEffect(() => {
    const fetchData = async () => {
      if (dataSource === 'api') {
        setIsLoading(true);
        try {
          // Fetch planet data from NASA API
          const apiData = await exoplanetAPI.getConfirmedPlanets();

          // Process data to match our expected format
          const processedData = apiData.map((planet) => ({
            ...planet,
            description: getRandomDescription(planet),
            // Manually compute habitability for API data
            habitable:
              planet.pl_eqt >= 180 &&
              planet.pl_eqt <= 310 &&
              planet.pl_rade < 2.5,
          }));

          setPlanets(processedData);
        } catch (error) {
          console.error('Error fetching exoplanet data:', error);
          // Fall back to sample data if API fails
          setPlanets(sampleExoplanets);
          setDataSource('sample');
          alert(
            'Failed to fetch data from NASA API. Using sample data instead.'
          );
        } finally {
          setIsLoading(false);
        }
      } else {
        // Use sample data
        setPlanets(sampleExoplanets);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dataSource]);

  // Handle data source change
  const handleDataSourceChange = (source) => {
    if (source !== dataSource) {
      setDataSource(source);
    }
  };

  // Handle view change
  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  // Generate descriptions for planets from API
  const getRandomDescription = (planet) => {
    const descriptions = [
      `${planet.pl_name} is a ${
        planet.pl_rade < 1.6 ? 'rocky' : 'gaseous'
      } planet orbiting ${planet.hostname}.`,
      `Discovered in ${planet.disc_year}, ${
        planet.pl_name
      } is notable for its ${
        planet.pl_eqt < 300 ? 'cool' : 'hot'
      } temperature of ${planet.pl_eqt}K.`,
      `${planet.pl_name} completes an orbit around its star every ${
        planet.pl_orbper < 365
          ? Math.round(planet.pl_orbper) + ' days'
          : (planet.pl_orbper / 365).toFixed(1) + ' years'
      }.`,
      `With a radius of ${planet.pl_rade} times that of Earth, ${
        planet.pl_name
      } is considered a ${
        planet.pl_rade < 1.6
          ? 'potentially habitable'
          : planet.pl_rade < 4
          ? 'super-Earth'
          : 'gas giant'
      }.`,
    ];

    const randomIndex = Math.floor(Math.random() * descriptions.length);
    return descriptions[randomIndex];
  };

  return (
    <div className="app min-h-screen bg-space-dark text-white">
      <Navbar
        onDataSourceChange={handleDataSourceChange}
        dataSource={dataSource}
        onViewChange={handleViewChange}
        currentView={currentView}
      />

      <main className="container mx-auto py-6 px-4">
        <Dashboard
          planets={planets}
          isLoading={isLoading}
          currentView={currentView}
        />
      </main>

      <footer className="bg-gray-900 py-4 text-center text-gray-400 text-sm">
        <p>Exoplanet Explorer | Data sourced from NASA Exoplanet Archive</p>
        <p className="mt-1">
          <a
            href="https://exoplanetarchive.ipac.caltech.edu/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            https://exoplanetarchive.ipac.caltech.edu/
          </a>
        </p>
      </footer>
    </div>
  );
};

export default App;
