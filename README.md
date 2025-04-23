# Processing the Cosmos: Visualizing Exoplanet Data

A React application for visualizing and exploring NASA's exoplanet data. This project provides interactive visualizations, comparison tools, and detailed information about exoplanets discovered so far.


## Features

- **Exoplanet Gallery**: Browse and filter discovered exoplanets
- **Data Visualizations**: Various charts and visualizations for exoplanet data
- **System Comparison**: Compare different planetary systems with our Solar System
- **Orbit Visualizer**: See how planets orbit their host stars
- **Habitability Scoring**: Analyze which planets might support life
- **Discovery Timeline**: Track exoplanet discoveries over time
- **Connect to NASA API**: Use real-time data from the NASA Exoplanet Archive

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm or yarn

### Installation

1. Clone the repository and navigate to the project directory:

```bash
git clone https://github.com/Srinithya6/vitejs-vite-55mv7hqk.git
cd vitejs-vite-55mv7hqk
```
2. Install dependencies:

```bash
npm install
```
3. Start the development server:

```bash
npm run dev
```
4. Open your browser and navigate to http://localhost:5173 (or the port shown in your terminal)

### StackBlitz Setup
To work on this project in StackBlitz:

1. Go to StackBlitz
2. Create a new React + Vite project
3. Copy the project files to the StackBlitz workspace
4. Install required dependencies:

```bash
npm install recharts tailwindcss postcss autoprefixer axios lodash
npm install -D @tailwindcss/forms @tailwindcss/typography
```
5. Initialize Tailwind CSS:

```bash
npx tailwindcss init -p
```
## Data Sources
This application can use two data sources:

### Sample Data: A curated list of interesting exoplanets included in the project
### NASA API: Live data from the NASA Exoplanet Archive

## API Reference
The application connects to the NASA Exoplanet Archive using their Table Access Protocol (TAP) service. Documentation is available at:
https://exoplanetarchive.ipac.caltech.edu

## Main Components
### OrbitVisualizer.jsx
Visualizes planetary orbits using SVG. Features include:

- Dynamic orbit path generation based on planet data
- Animated planet revolution
- Proper scaling to show relative orbital distances
- Star color based on spectral type

### HabitabilityScore.jsx
Calculates and displays a visual score based on planet conditions:

- Temperature assessment
- Size/mass evaluation
- Star type consideration
- Orbit zone analysis

### CompareSystems.jsx
Compares exoplanet systems to our Solar System:

- Side-by-side visualization
- Multiple comparison views (distance, size, temperature)
- Interactive data charts

### TimeDiscoveryChart.jsx
Tracks exoplanet discoveries over time:

- Filter by discovery method
- Multiple chart types (line, bar, area)
- Cumulative and per-year statistics

### FilterPanel.jsx
A comprehensive filtering system:

- Filter by planet type
- Filter by discovery method
- Filter by physical characteristics
- Filter by habitability potential

## Extending the Project
### Adding New Visualizations

- Create a new component in the src/components/visualizations directory
- Import it in the Dashboard component
- Add a new view option in the Navbar component

### Connecting to Additional Data Sources
Modify the exoplanetAPI.js file to include additional API endpoints or data sources.

### Technologies Used

- React: UI framework
- Vite: Build tool
- Tailwind CSS: Styling
- Recharts: Data visualization
- Axios: API requests


## Acknowledgments

- Data provided by NASA Exoplanet Archive
- Planet habitability calculations based on current scientific understanding
- Icons from Material Icons

## Contributors

- **Sri Nithya Anne** – M.S. Electrical & Computer Engineering – srinithya@northeastern.edu
- **Shayda Moezzi** – Ph.D. Electrical & Computer Engineering – shayda@northeastern.edu
- **Satya Nandivada** – M.S. Electrical & Computer Engineering – satya@northeastern.edu
