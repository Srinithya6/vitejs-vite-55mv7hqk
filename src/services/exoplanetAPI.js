// src/services/exoplanetAPI.js
import axios from 'axios';

// Base URL for NASA Exoplanet Archive API
const API_BASE_URL = 'https://exoplanetarchive.ipac.caltech.edu/TAP/sync';

// Function to build query parameters
const buildParams = (query, format = 'json', maxRows = 2000) => {
  return {
    query,
    format,
    maxrows: maxRows,
  };
};

// Get all confirmed planets with specified columns
export const getConfirmedPlanets = async () => {
  try {
    const query = `SELECT 
      pl_name, hostname, discoverymethod, disc_year, pl_orbper, pl_orbsmax, 
      pl_rade, pl_bmasse, pl_eqt, st_spectype, st_rad, st_mass, st_teff, 
      st_dist, sy_pnum 
    FROM ps 
    WHERE default_flag = 1 
    ORDER BY disc_year DESC`;

    const response = await axios.get(API_BASE_URL, {
      params: buildParams(query),
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching exoplanet data:', error);
    throw error;
  }
};

// Get planets discovered in a specific year range
export const getPlanetsByYearRange = async (startYear, endYear) => {
  try {
    const query = `SELECT 
      pl_name, hostname, discoverymethod, disc_year, pl_orbper, pl_orbsmax, 
      pl_rade, pl_bmasse, pl_eqt, st_spectype, st_rad, st_mass, st_teff, 
      st_dist, sy_pnum 
    FROM ps 
    WHERE default_flag = 1 
    AND disc_year BETWEEN ${startYear} AND ${endYear} 
    ORDER BY disc_year ASC`;

    const response = await axios.get(API_BASE_URL, {
      params: buildParams(query),
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching planets by year range:', error);
    throw error;
  }
};

// Get planets by discovery method
export const getPlanetsByDiscoveryMethod = async (method) => {
  try {
    const query = `SELECT 
      pl_name, hostname, discoverymethod, disc_year, pl_orbper, pl_orbsmax, 
      pl_rade, pl_bmasse, pl_eqt, st_spectype, st_rad, st_mass, st_teff, 
      st_dist, sy_pnum 
    FROM ps 
    WHERE default_flag = 1 
    AND discoverymethod LIKE '%${method}%' 
    ORDER BY disc_year DESC`;

    const response = await axios.get(API_BASE_URL, {
      params: buildParams(query),
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching planets by discovery method:', error);
    throw error;
  }
};

// Get potentially habitable planets (simple criteria: planets with equilibrium temp between 180-310K and radius < 2.5 Earth radii)
export const getPotentiallyHabitablePlanets = async () => {
  try {
    const query = `SELECT 
      pl_name, hostname, discoverymethod, disc_year, pl_orbper, pl_orbsmax, 
      pl_rade, pl_bmasse, pl_eqt, st_spectype, st_rad, st_mass, st_teff, 
      st_dist, sy_pnum 
    FROM ps 
    WHERE default_flag = 1 
    AND pl_eqt BETWEEN 180 AND 310 
    AND pl_rade < 2.5 
    AND pl_rade IS NOT NULL 
    AND pl_eqt IS NOT NULL 
    ORDER BY pl_eqt ASC`;

    const response = await axios.get(API_BASE_URL, {
      params: buildParams(query),
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching potentially habitable planets:', error);
    throw error;
  }
};

// Get detailed information about a specific planet
export const getPlanetDetails = async (planetName) => {
  try {
    const query = `SELECT * FROM ps WHERE default_flag = 1 AND pl_name = '${planetName}'`;

    const response = await axios.get(API_BASE_URL, {
      params: buildParams(query),
    });

    return response.data[0]; // Return first match
  } catch (error) {
    console.error(`Error fetching details for planet ${planetName}:`, error);
    throw error;
  }
};

// Get all planets in a specific system
export const getPlanetsInSystem = async (hostName) => {
  try {
    const query = `SELECT 
      pl_name, hostname, discoverymethod, disc_year, pl_orbper, pl_orbsmax, 
      pl_rade, pl_bmasse, pl_eqt, st_spectype, st_rad, st_mass, st_teff, 
      st_dist, sy_pnum 
    FROM ps 
    WHERE default_flag = 1 
    AND hostname = '${hostName}' 
    ORDER BY pl_orbsmax ASC`;

    const response = await axios.get(API_BASE_URL, {
      params: buildParams(query),
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching planets in system ${hostName}:`, error);
    throw error;
  }
};

// Get planet count by discovery method for statistics
export const getDiscoveryMethodStats = async () => {
  try {
    const query = `SELECT 
      discoverymethod, COUNT(*) as count 
    FROM ps 
    WHERE default_flag = 1 
    GROUP BY discoverymethod 
    ORDER BY count DESC`;

    const response = await axios.get(API_BASE_URL, {
      params: buildParams(query),
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching discovery method statistics:', error);
    throw error;
  }
};

// Get planet count by year for timeline visualization
export const getDiscoveryTimelineData = async () => {
  try {
    const query = `SELECT 
      disc_year, COUNT(*) as count 
    FROM ps 
    WHERE default_flag = 1 AND disc_year IS NOT NULL 
    GROUP BY disc_year 
    ORDER BY disc_year ASC`;

    const response = await axios.get(API_BASE_URL, {
      params: buildParams(query),
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching discovery timeline data:', error);
    throw error;
  }
};
