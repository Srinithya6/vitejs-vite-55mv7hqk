// src/components/Navbar.jsx
import React, { useState } from 'react';

const Navbar = ({
  onDataSourceChange,
  dataSource = 'sample', // 'sample' or 'api'
  onViewChange,
  currentView = 'gallery', // 'gallery', 'chart', 'compare', 'timeline', 'map'
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Views configuration
  const views = [
    { id: 'gallery', name: 'Planet Gallery', icon: 'grid_view' },
    { id: 'chart', name: 'Data Visualization', icon: 'bar_chart' },
    { id: 'compare', name: 'System Comparison', icon: 'compare' },
    { id: 'timeline', name: 'Discovery Timeline', icon: 'timeline' },
    { id: 'map', name: 'Star Map', icon: 'public' },
  ];

  return (
    <nav className="bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and app title */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-500"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z" />
              </svg>
              <span className="ml-2 text-white font-bold text-xl">
                ExoplanetExplorer
              </span>
            </div>
          </div>

          {/* Navigation and controls */}
          <div className="hidden md:flex items-center">
            <div className="flex space-x-4">
              {views.map((view) => (
                <button
                  key={view.id}
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                    currentView === view.id
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                  onClick={() => onViewChange && onViewChange(view.id)}
                >
                  <span className="material-icons text-sm mr-1">
                    {view.icon}
                  </span>
                  {view.name}
                </button>
              ))}
            </div>

            {/* Data source toggle */}
            <div className="ml-6 flex items-center border-l border-gray-700 pl-6">
              <span className="text-gray-300 text-sm mr-2">Data Source:</span>
              <select
                className="bg-gray-800 text-white text-sm rounded px-2 py-1 border border-gray-700"
                value={dataSource}
                onChange={(e) =>
                  onDataSourceChange && onDataSourceChange(e.target.value)
                }
              >
                <option value="sample">Sample Data</option>
                <option value="api">NASA API</option>
              </select>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button
              type="button"
              className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {views.map((view) => (
            <button
              key={view.id}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                currentView === view.id
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
              onClick={() => {
                onViewChange && onViewChange(view.id);
                setIsMenuOpen(false);
              }}
            >
              <span className="material-icons text-sm mr-1">{view.icon}</span>
              {view.name}
            </button>
          ))}

          {/* Mobile data source toggle */}
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="px-3">
              <p className="text-gray-300 text-sm mb-2">Data Source:</p>
              <select
                className="w-full bg-gray-800 text-white text-sm rounded px-2 py-1 border border-gray-700"
                value={dataSource}
                onChange={(e) => {
                  onDataSourceChange && onDataSourceChange(e.target.value);
                  setIsMenuOpen(false);
                }}
              >
                <option value="sample">Sample Data</option>
                <option value="api">NASA API</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
