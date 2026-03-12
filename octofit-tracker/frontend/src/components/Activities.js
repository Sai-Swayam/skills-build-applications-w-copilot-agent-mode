import { useCallback, useEffect, useState } from 'react';
import { normalizeApiResponse } from './api';
import ResourcePage from './ResourcePage';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const endpoint = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`
    : 'http://localhost:8000/api/activities/';

  const loadActivities = useCallback(async () => {
    setLoading(true);
    setError('');

    console.log('Activities endpoint:', endpoint);

    try {
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const payload = await response.json();
      const normalizedActivities = normalizeApiResponse(payload);

      console.log('Activities fetched data:', payload);

      setActivities(normalizedActivities);
    } catch (fetchError) {
      console.error('Activities fetch failed:', fetchError);
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  return (
    <ResourcePage
      title="Activities"
      description="Activity records from the Django REST API using a shared Bootstrap table, form controls, and modal details."
      endpoint={endpoint}
      items={activities}
      loading={loading}
      error={error}
      emptyMessage="No activities returned from the API."
      columns={['Type', 'User', 'Duration', 'Distance', 'Created']}
      getItemKey={(activity) => activity.id ?? `${activity.type}-${activity.created_at}`}
      getSearchText={(activity) => `${activity.type ?? ''} ${activity.user?.username ?? ''} ${activity.created_at ?? ''}`}
      onRefresh={loadActivities}
      renderRow={(activity) => (
        <>
          <td className="text-capitalize fw-semibold">{activity.type ?? 'Activity'}</td>
          <td>{activity.user?.username ?? 'Unknown user'}</td>
          <td>{activity.duration ?? 'N/A'} min</td>
          <td>{activity.distance ?? 'N/A'} km</td>
          <td>{activity.created_at ?? 'N/A'}</td>
        </>
      )}
      renderDetails={(activity) => (
        <div className="card border-0 bg-body-tertiary">
          <div className="card-body">
            <h5 className="card-title text-capitalize">{activity.type ?? 'Activity'}</h5>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">User</label>
                <input className="form-control" value={activity.user?.username ?? 'Unknown user'} readOnly />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Duration</label>
                <input className="form-control" value={`${activity.duration ?? 'N/A'} min`} readOnly />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Distance</label>
                <input className="form-control" value={`${activity.distance ?? 'N/A'} km`} readOnly />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Created</label>
                <input className="form-control" value={activity.created_at ?? 'N/A'} readOnly />
              </div>
            </div>
          </div>
        </div>
      )}
    />
  );
}

export default Activities;