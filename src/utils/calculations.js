// src/utils/calculations.js

// Constants for calculations
const EARTH_RADIUS_KM = 6371; // km
const EARTH_MASS_KG = 5.972e24; // kg
const SOLAR_RADIUS_KM = 695700; // km
const SOLAR_MASS_KG = 1.989e30; // kg
const AU_TO_KM = 149597870.7; // 1 AU in km
const PARSEC_TO_LIGHT_YEARS = 3.26156; // 1 parsec in light years

// Calculate habitability score based on multiple parameters
export const calculateHabitabilityScore = (planet) => {
  if (!planet) return 0;

  let score = 0;

  // Temperature score - based on Earth-like temperatures (260K-310K)
  if (planet.pl_eqt) {
    const tempScore = 100 - Math.min(100, Math.abs(planet.pl_eqt - 285) / 2);
    score += tempScore * 0.35; // Temperature is 35% of total score
  }

  // Size score - based on Earth-like size (0.5-2.0 Earth radii)
  if (planet.pl_rade) {
    let sizeScore = 0;
    if (planet.pl_rade >= 0.5 && planet.pl_rade <= 2.0) {
      sizeScore = 100 - Math.abs(planet.pl_rade - 1) * 50;
    } else {
      sizeScore = Math.max(0, 100 - Math.abs(planet.pl_rade - 1) * 30);
    }
    score += sizeScore * 0.25; // Size is 25% of total score
  }

  // Mass score - based on Earth-like mass (0.5-5.0 Earth masses)
  if (planet.pl_bmasse) {
    let massScore = 0;
    if (planet.pl_bmasse >= 0.5 && planet.pl_bmasse <= 5.0) {
      massScore = 100 - Math.abs(planet.pl_bmasse - 1) * 20;
    } else {
      massScore = Math.max(0, 100 - Math.abs(planet.pl_bmasse - 1) * 15);
    }
    score += massScore * 0.2; // Mass is 20% of total score
  }

  // Star type score - based on longevity and stability
  if (planet.st_spectype) {
    let starScore = 0;
    if (planet.st_spectype.startsWith('G')) {
      starScore = 100; // G-type stars like our Sun get max score
    } else if (planet.st_spectype.startsWith('K')) {
      starScore = 80; // K-type stars are good candidates
    } else if (planet.st_spectype.startsWith('F')) {
      starScore = 60; // F-type stars are shorter-lived
    } else if (planet.st_spectype.startsWith('M')) {
      starScore = 50; // M-type stars have habitability challenges (flares, tidal locking)
    } else {
      starScore = 30; // Other star types are less ideal
    }
    score += starScore * 0.2; // Star type is 20% of total score
  }

  return Math.round(score);
};

// Calculate distance in light years from parsecs
export const calculateLightYearDistance = (parsecs) => {
  if (!parsecs) return null;
  return parsecs * PARSEC_TO_LIGHT_YEARS;
};

// Convert Earth radii to kilometers
export const earthRadiiToKm = (earthRadii) => {
  if (!earthRadii) return null;
  return earthRadii * EARTH_RADIUS_KM;
};

// Convert Earth masses to kilograms
export const earthMassToKg = (earthMass) => {
  if (!earthMass) return null;
  return earthMass * EARTH_MASS_KG;
};

// Convert AU to kilometers
export const auToKm = (au) => {
  if (!au) return null;
  return au * AU_TO_KM;
};

// Calculate orbital period in Earth years
export const daysToYears = (days) => {
  if (!days) return null;
  return days / 365.25;
};

// Calculate orbital velocity in km/s
export const calculateOrbitalVelocity = (semiMajorAxisAU, periodDays) => {
  if (!semiMajorAxisAU || !periodDays) return null;

  const orbitCircumference = 2 * Math.PI * auToKm(semiMajorAxisAU);
  const periodSeconds = periodDays * 24 * 60 * 60;

  return orbitCircumference / periodSeconds;
};

// Calculate relative surface gravity compared to Earth
export const calculateRelativeSurfaceGravity = (
  planetMassEarth,
  planetRadiusEarth
) => {
  if (!planetMassEarth || !planetRadiusEarth) return null;

  return planetMassEarth / (planetRadiusEarth * planetRadiusEarth);
};

// Calculate the habitable zone boundaries for a star based on its luminosity
export const calculateHabitableZone = (starTeff, starRadius) => {
  if (!starTeff || !starRadius) return null;

  // Calculate stellar luminosity relative to Sun using Stefan-Boltzmann law
  const luminosityRelative =
    starRadius * starRadius * Math.pow(starTeff / 5772, 4);

  // Conservative habitable zone boundaries (in AU)
  const innerBoundary = 0.95 * Math.sqrt(luminosityRelative);
  const outerBoundary = 1.67 * Math.sqrt(luminosityRelative);

  return {
    inner: innerBoundary,
    outer: outerBoundary,
  };
};

// Check if a planet is in its star's habitable zone
export const isInHabitableZone = (planet) => {
  if (!planet || !planet.st_teff || !planet.st_rad || !planet.pl_orbsmax) {
    return false;
  }

  const habitableZone = calculateHabitableZone(planet.st_teff, planet.st_rad);

  if (!habitableZone) return false;

  return (
    planet.pl_orbsmax >= habitableZone.inner &&
    planet.pl_orbsmax <= habitableZone.outer
  );
};

// Categorize planet type based on radius
export const categorizePlanetType = (radiusEarth) => {
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

// Generate orbit coordinates for visualization
export const generateOrbitCoordinates = (
  semiMajorAxis,
  eccentricity = 0,
  points = 100
) => {
  if (!semiMajorAxis) return [];

  // Default to circular orbit if eccentricity not provided
  eccentricity = eccentricity || 0;

  // Calculate semi-minor axis
  const semiMinorAxis =
    semiMajorAxis * Math.sqrt(1 - eccentricity * eccentricity);

  // Generate points around the ellipse
  const coordinates = [];
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * 2 * Math.PI;
    const x = semiMajorAxis * Math.cos(angle);
    const y = semiMinorAxis * Math.sin(angle);

    // Adjust for focal point offset (star position)
    const offsetX = -semiMajorAxis * eccentricity;

    coordinates.push({
      x: x + offsetX,
      y: y,
    });
  }

  return coordinates;
};
