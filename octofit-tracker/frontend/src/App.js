import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';
import './App.css';

function App() {
  const navigationItems = [
    { path: '/users', label: 'Users' },
    { path: '/teams', label: 'Teams' },
    { path: '/activities', label: 'Activities' },
    { path: '/workouts', label: 'Workouts' },
    { path: '/leaderboard', label: 'Leaderboard' },
  ];

  return (
    <div className="app-shell">
      <header className="app-header sticky-top">
        <nav className="navbar navbar-expand-lg border-bottom bg-white shadow-sm">
          <div className="container py-2">
            <div className="brand-lockup d-flex align-items-center gap-3">
              <img
                className="brand-logo"
                src={`${process.env.PUBLIC_URL}/octofitapp-small.png`}
                alt="OctoFit logo"
              />
              <div>
                <span className="navbar-brand mb-0 h1 fw-bold text-dark">OctoFit Tracker</span>
                <p className="text-secondary small mb-0">React frontend for the Django REST backend</p>
              </div>
            </div>

            <div className="navbar-nav flex-row flex-wrap justify-content-lg-end gap-1 ms-lg-auto mt-3 mt-lg-0">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `nav-link px-3 py-2 rounded-pill ${isActive ? 'active bg-dark text-white' : 'text-dark'}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>

        <div className="container py-4">
          <div className="card border-0 shadow-sm hero-card">
            <div className="card-body p-4 p-lg-5">
              <div className="row align-items-center g-4">
                <div className="col-lg-8">
                  <p className="text-uppercase fw-semibold text-primary small mb-2">Dashboard</p>
                  <h1 className="display-6 fw-bold mb-3">Frontend connected to the Django REST API</h1>
                  <p className="lead text-secondary mb-0">
                    Browse users, teams, activities, workouts, and leaderboard data through a consistent Bootstrap interface.
                  </p>
                </div>
                <div className="col-lg-4">
                  <div className="card border-0 bg-body-tertiary h-100 feature-card">
                    <div className="card-body text-center text-lg-start">
                      <img
                        className="hero-logo img-fluid mb-3"
                        src={`${process.env.PUBLIC_URL}/octofitapp-small.png`}
                        alt="OctoFit badge"
                      />
                      <h2 className="h5 mb-3">What&apos;s included</h2>
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item bg-transparent px-0">Bootstrap navigation and cards</li>
                        <li className="list-group-item bg-transparent px-0">Bootstrap tables and forms</li>
                        <li className="list-group-item bg-transparent px-0">Bootstrap buttons, links, and modals</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-4 py-lg-5">
        <Routes>
          <Route path="/" element={<Navigate to="/users" replace />} />
          <Route path="/users" element={<Users />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
