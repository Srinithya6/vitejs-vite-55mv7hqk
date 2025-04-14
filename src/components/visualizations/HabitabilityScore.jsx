// src/components/visualizations/HabitabilityScore.js
import React from 'react';
import { calculateHabitabilityScore } from '../../utils/calculations';
import { getHabitabilityColor } from '../../utils/helpers';

const HabitabilityScore = ({
  planet,
  showDetails = false,
  compact = false,
}) => {
  if (!planet) return null;

  // Calculate the overall habitability score
  const score = calculateHabitabilityScore(planet);

  // Color based on score
  const scoreColor = getHabitabilityColor(score);

  // Define factor weights for detailed view
  const factors = [
    {
      name: 'Temperature',
      description: 'Earth-like temperatures (260K-310K) are ideal',
      value: planet.pl_eqt || 0,
      unit: 'K',
      ideal: '285K',
      weight: 0.35,
    },
    {
      name: 'Size',
      description:
        'Planets 0.5-2.0 Earth radii can retain atmospheres and have suitable gravity',
      value: planet.pl_rade || 0,
      unit: 'R⊕',
      ideal: '1.0R⊕',
      weight: 0.25,
    },
    {
      name: 'Mass',
      description: 'Planets 0.5-5.0 Earth masses support surface liquid water',
      value: planet.pl_bmasse || 0,
      unit: 'M⊕',
      ideal: '1.0M⊕',
      weight: 0.2,
    },
    {
      name: 'Star Type',
      description: 'G-type stars like our Sun are most favorable for life',
      value: planet.st_spectype || '',
      unit: '',
      ideal: 'G-type',
      weight: 0.2,
    },
  ];

  if (compact) {
    return (
      <div className="habitability-score-compact flex items-center space-x-2">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
          style={{ backgroundColor: scoreColor }}
        >
          {score}
        </div>
        <div>
          <div className="text-sm font-medium">Habitability Score</div>
          <div className="text-xs text-gray-400">{getScoreCategory(score)}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="habitability-score bg-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Habitability Score</h3>

        <div className="score-display flex items-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl mr-3"
            style={{ backgroundColor: scoreColor }}
          >
            {score}
          </div>
          <div className="text-lg font-medium text-white">
            {getScoreCategory(score)}
          </div>
        </div>
      </div>

      {showDetails && (
        <div className="score-details">
          <p className="text-gray-300 text-sm mb-3">
            Habitability is calculated based on multiple factors that influence
            a planet's potential to support Earth-like life.
          </p>

          <div className="factors space-y-4 mt-4">
            {factors.map((factor) => {
              // Calculate individual factor score
              let factorScore = 0;

              if (factor.name === 'Temperature' && planet.pl_eqt) {
                factorScore =
                  100 - Math.min(100, Math.abs(planet.pl_eqt - 285) / 2);
              } else if (factor.name === 'Size' && planet.pl_rade) {
                factorScore =
                  planet.pl_rade >= 0.5 && planet.pl_rade <= 2.0
                    ? 100 - Math.abs(planet.pl_rade - 1) * 50
                    : Math.max(0, 100 - Math.abs(planet.pl_rade - 1) * 30);
              } else if (factor.name === 'Mass' && planet.pl_bmasse) {
                factorScore =
                  planet.pl_bmasse >= 0.5 && planet.pl_bmasse <= 5.0
                    ? 100 - Math.abs(planet.pl_bmasse - 1) * 20
                    : Math.max(0, 100 - Math.abs(planet.pl_bmasse - 1) * 15);
              } else if (factor.name === 'Star Type' && planet.st_spectype) {
                if (planet.st_spectype.startsWith('G')) factorScore = 100;
                else if (planet.st_spectype.startsWith('K')) factorScore = 80;
                else if (planet.st_spectype.startsWith('F')) factorScore = 60;
                else if (planet.st_spectype.startsWith('M')) factorScore = 50;
                else factorScore = 30;
              }

              const factorColor = getHabitabilityColor(factorScore);

              return (
                <div key={factor.name} className="factor">
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-medium text-white">{factor.name}</div>
                    <div className="flex items-center">
                      <span className="text-gray-300 text-sm mr-2">
                        {factor.value} {factor.unit}
                      </span>
                      <span
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: factorColor }}
                      >
                        {Math.round(factorScore)}
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full"
                      style={{
                        width: `${factorScore}%`,
                        backgroundColor: factorColor,
                      }}
                    ></div>
                  </div>

                  <div className="text-xs text-gray-400 mt-1">
                    {factor.description}. Ideal: {factor.ideal} (Weight:{' '}
                    {factor.weight * 100}%)
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to categorize score
const getScoreCategory = (score) => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Moderate';
  if (score >= 20) return 'Poor';
  return 'Very Poor';
};

export default HabitabilityScore;
