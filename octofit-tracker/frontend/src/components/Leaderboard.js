import { useCallback, useEffect, useState } from 'react';
import { normalizeApiResponse } from './api';
import ResourcePage from './ResourcePage';

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const endpoint = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`
    : 'http://localhost:8000/api/leaderboard/';

  const loadLeaderboard = useCallback(async () => {
    setLoading(true);
    setError('');

    console.log('Leaderboard endpoint:', endpoint);

    try {
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const payload = await response.json();
      const normalizedEntries = normalizeApiResponse(payload);

      console.log('Leaderboard fetched data:', payload);

      setEntries(normalizedEntries);
    } catch (fetchError) {
      console.error('Leaderboard fetch failed:', fetchError);
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  return (
    <ResourcePage
      title="Leaderboard"
      description="Competitive rankings from the Django REST API using a standardized Bootstrap table, actions, filters, and detail modal."
      endpoint={endpoint}
      items={entries}
      loading={loading}
      error={error}
      emptyMessage="No leaderboard entries returned from the API."
      columns={['Rank', 'User', 'Email', 'Points']}
      getItemKey={(entry, index) => entry.id ?? `${entry.user?.username}-${index}`}
      getSearchText={(entry) => `${entry.user?.username ?? ''} ${entry.user?.email ?? ''} ${entry.points ?? ''}`}
      onRefresh={loadLeaderboard}
      renderRow={(entry, index) => (
        <>
          <td>{index + 1}</td>
          <td className="fw-semibold">{entry.user?.username ?? 'Unknown user'}</td>
          <td>
            {entry.user?.email ? (
              <a className="link-primary" href={`mailto:${entry.user.email}`}>
                {entry.user.email}
              </a>
            ) : (
              'N/A'
            )}
          </td>
          <td>{entry.points ?? 0}</td>
        </>
      )}
      renderDetails={(entry) => (
        <div className="card border-0 bg-body-tertiary">
          <div className="card-body">
            <h5 className="card-title">{entry.user?.username ?? 'Unknown user'}</h5>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Email</label>
                <input className="form-control" value={entry.user?.email ?? 'N/A'} readOnly />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Points</label>
                <input className="form-control" value={entry.points ?? 0} readOnly />
              </div>
            </div>
          </div>
        </div>
      )}
    />
  );
}

export default Leaderboard;