// src/utils/helpers.js

// Format large numbers with commas
export const formatNumber = (num, decimals = 2) => {
  if (num === null || num === undefined) return 'Unknown';

  return num.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

// Format distance in appropriate units (AU, light years)
export const formatDistance = (distance, unit = 'pc') => {
  if (distance === null || distance === undefined) return 'Unknown';

  if (unit === 'pc') {
    if (distance < 1) {
      return `${formatNumber(distance * 3.26)} light years`;
    } else {
      return `${formatNumber(distance)} parsecs (${formatNumber(
        distance * 3.26
      )} light years)`;
    }
  } else if (unit === 'au') {
    if (distance < 0.01) {
      return `${formatNumber(distance * 149597871)} kilometers`;
    } else {
      return `${formatNumber(distance)} AU`;
    }
  }

  return `${formatNumber(distance)} ${unit}`;
};

// Format temperature with appropriate unit
export const formatTemperature = (temp, unit = 'K') => {
  if (temp === null || temp === undefined) return 'Unknown';

  if (unit === 'K') {
    return `${formatNumber(temp)} K (${formatNumber(temp - 273.15)}°C)`;
  } else if (unit === 'C') {
    return `${formatNumber(temp)}°C (${formatNumber(temp + 273.15)} K)`;
  }

  return `${formatNumber(temp)} ${unit}`;
};

// Format planet mass in appropriate units
export const formatMass = (mass, unit = 'earth') => {
  if (mass === null || mass === undefined) return 'Unknown';

  if (unit === 'earth') {
    if (mass > 50) {
      return `${formatNumber(mass / 317.8)} Jupiter masses (${formatNumber(
        mass
      )} Earth masses)`;
    } else {
      return `${formatNumber(mass)} Earth masses`;
    }
  } else if (unit === 'jupiter') {
    if (mass < 0.1) {
      return `${formatNumber(mass * 317.8)} Earth masses (${formatNumber(
        mass
      )} Jupiter masses)`;
    } else {
      return `${formatNumber(mass)} Jupiter masses`;
    }
  }

  return `${formatNumber(mass)} ${unit}`;
};

// Format planet radius in appropriate units
export const formatRadius = (radius, unit = 'earth') => {
  if (radius === null || radius === undefined) return 'Unknown';

  if (unit === 'earth') {
    if (radius > 10) {
      return `${formatNumber(radius / 11.2)} Jupiter radii (${formatNumber(
        radius
      )} Earth radii)`;
    } else {
      return `${formatNumber(radius)} Earth radii`;
    }
  } else if (unit === 'jupiter') {
    if (radius < 0.2) {
      return `${formatNumber(radius * 11.2)} Earth radii (${formatNumber(
        radius
      )} Jupiter radii)`;
    } else {
      return `${formatNumber(radius)} Jupiter radii`;
    }
  }

  return `${formatNumber(radius)} ${unit}`;
};

// Format time (days to years if appropriate)
export const formatOrbitalPeriod = (days) => {
  if (days === null || days === undefined) return 'Unknown';

  if (days < 1) {
    return `${formatNumber(days * 24)} hours`;
  } else if (days > 365) {
    return `${formatNumber(days / 365.25)} years (${formatNumber(days)} days)`;
  } else {
    return `${formatNumber(days)} days`;
  }
};

// Generate a color based on planet type/category
export const getPlanetTypeColor = (type) => {
  const colors = {
    'Sub-Earth': '#6BAED6', // Light blue
    'Earth-like': '#41AB5D', // Green
    'Super-Earth/Mini-Neptune': '#4292C6', // Blue
    'Neptune-like': '#2171B5', // Dark blue
    'Gas Giant': '#F16913', // Orange
    Unknown: '#969696', // Gray
  };

  return colors[type] || colors['Unknown'];
};

// Generate a color based on habitability score
export const getHabitabilityColor = (score) => {
  if (score >= 80) {
    return '#41AB5D'; // Green - excellent
  } else if (score >= 60) {
    return '#74C476'; // Light green - good
  } else if (score >= 40) {
    return '#FD8D3C'; // Orange - moderate
  } else if (score >= 20) {
    return '#F16913'; // Dark orange - poor
  } else {
    return '#D73027'; // Red - very poor
  }
};

// Generate a color based on star type
export const getStarTypeColor = (spectralType) => {
  if (!spectralType) return '#FFFFFF';

  const type = spectralType.charAt(0);

  switch (type) {
    case 'O':
      return '#9BB0FF'; // Blue
    case 'B':
      return '#AAC4FF'; // Blue-white
    case 'A':
      return '#CAD7FF'; // White
    case 'F':
      return '#F8F7FF'; // Yellow-white
    case 'G':
      return '#FFF4EA'; // Yellow (like our Sun)
    case 'K':
      return '#FFD2A1'; // Orange
    case 'M':
      return '#FFCC6F'; // Red
    default:
      return '#FFFFFF';
  }
};

// Get discovery method display name and icon
export const getDiscoveryMethodInfo = (method) => {
  const methods = {
    Transit: {
      displayName: 'Transit',
      icon: 'brightness_4',
      description:
        'Detects planets by measuring the dimming of starlight as a planet passes in front of its star.',
    },
    'Radial Velocity': {
      displayName: 'Radial Velocity',
      icon: 'timeline',
      description:
        'Detects planets by measuring the wobble of a star caused by the gravitational pull of an orbiting planet.',
    },
    Imaging: {
      displayName: 'Direct Imaging',
      icon: 'camera_alt',
      description:
        'Directly observes planets by blocking the light from their host star.',
    },
    Microlensing: {
      displayName: 'Microlensing',
      icon: 'zoom_in',
      description:
        'Detects planets when their gravitational field temporarily magnifies light from a background star.',
    },
    'Transit Timing Variations': {
      displayName: 'Transit Timing Variations',
      icon: 'access_time',
      description:
        'Detects planets by measuring variations in the timing of known transiting planets.',
    },
    Astrometry: {
      displayName: 'Astrometry',
      icon: 'explore',
      description:
        'Measures the precise positions of stars to detect the presence of planets.',
    },
    default: {
      displayName: 'Other Method',
      icon: 'science',
      description: 'Detected using specialized techniques.',
    },
  };

  return methods[method] || methods['default'];
};

// Filter planets based on user-selected criteria
export const filterPlanets = (planets, filters) => {
  if (!planets || !filters) return planets;

  return planets.filter((planet) => {
    // Filter by planet type
    if (filters.planetTypes && filters.planetTypes.length > 0) {
      const planetType = categorizePlanetType(planet.pl_rade);
      if (!filters.planetTypes.includes(planetType)) {
        return false;
      }
    }

    // Filter by discovery method
    if (filters.discoveryMethods && filters.discoveryMethods.length > 0) {
      if (!filters.discoveryMethods.includes(planet.discoverymethod)) {
        return false;
      }
    }

    // Filter by discovery year range
    if (
      filters.yearRange &&
      (planet.disc_year < filters.yearRange[0] ||
        planet.disc_year > filters.yearRange[1])
    ) {
      return false;
    }

    // Filter by distance range (in parsecs)
    if (filters.distanceRange && planet.st_dist) {
      if (
        planet.st_dist < filters.distanceRange[0] ||
        planet.st_dist > filters.distanceRange[1]
      ) {
        return false;
      }
    }

    // Filter by temperature range (in Kelvin)
    if (filters.temperatureRange && planet.pl_eqt) {
      if (
        planet.pl_eqt < filters.temperatureRange[0] ||
        planet.pl_eqt > filters.temperatureRange[1]
      ) {
        return false;
      }
    }

    // Filter by planet radius range (in Earth radii)
    if (filters.radiusRange && planet.pl_rade) {
      if (
        planet.pl_rade < filters.radiusRange[0] ||
        planet.pl_rade > filters.radiusRange[1]
      ) {
        return false;
      }
    }

    // Filter by habitability
    if (filters.habitableOnly && !isInHabitableZone(planet)) {
      return false;
    }

    return true;
  });
};

// Helper function to categorize planet type
const categorizePlanetType = (radiusEarth) => {
  if (!radiusEarth) return 'Unknown';

  if (radiusEarth < 0.5) {
    return 'Sub-Earth';
  } else if (radiusEarth < 1.6) {
    return 'Earth-like';
  } else if (radiusEarth < 4) {
    return 'Super-Earth/Mini-Neptune';
  } else if (radiusEarth < 10) {
    return 'Neptune-like';
  } else {
    return 'Gas Giant';
  }
};

// Check if a planet is in its star's habitable zone (simplified version for filtering)
const isInHabitableZone = (planet) => {
  if (!planet || !planet.pl_eqt) {
    return false;
  }

  // Simple temperature-based approximation for habitability
  return planet.pl_eqt >= 180 && planet.pl_eqt <= 310;
};
