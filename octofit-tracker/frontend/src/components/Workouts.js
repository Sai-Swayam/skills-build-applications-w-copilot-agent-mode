import { useCallback, useEffect, useState } from 'react';
import { normalizeApiResponse } from './api';
import ResourcePage from './ResourcePage';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const endpoint = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`
    : 'http://localhost:8000/api/workouts/';

  const loadWorkouts = useCallback(async () => {
    setLoading(true);
    setError('');

    console.log('Workouts endpoint:', endpoint);

    try {
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const payload = await response.json();
      const normalizedWorkouts = normalizeApiResponse(payload);

      console.log('Workouts fetched data:', payload);

      setWorkouts(normalizedWorkouts);
    } catch (fetchError) {
      console.error('Workouts fetch failed:', fetchError);
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    loadWorkouts();
  }, [loadWorkouts]);

  return (
    <ResourcePage
      title="Workouts"
      description="Workout recommendations from the Django REST API with a matching Bootstrap card, table, form, and modal pattern."
      endpoint={endpoint}
      items={workouts}
      loading={loading}
      error={error}
      emptyMessage="No workouts returned from the API."
      columns={['Name', 'Duration', 'Description']}
      getItemKey={(workout) => workout.id ?? workout.name}
      getSearchText={(workout) => `${workout.name ?? ''} ${workout.description ?? ''}`}
      onRefresh={loadWorkouts}
      renderRow={(workout) => (
        <>
          <td className="fw-semibold">{workout.name ?? 'Workout'}</td>
          <td>{workout.duration ?? 'N/A'} min</td>
          <td>{workout.description ?? 'No description available.'}</td>
        </>
      )}
      renderDetails={(workout) => (
        <div className="card border-0 bg-body-tertiary">
          <div className="card-body">
            <h5 className="card-title">{workout.name ?? 'Workout'}</h5>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label fw-semibold">Duration</label>
                <input className="form-control" value={`${workout.duration ?? 'N/A'} min`} readOnly />
              </div>
              <div className="col-md-8">
                <label className="form-label fw-semibold">Description</label>
                <textarea className="form-control" value={workout.description ?? 'No description available.'} readOnly rows="4" />
              </div>
            </div>
          </div>
        </div>
      )}
    />
  );
}

export default Workouts;