import { useCallback, useEffect, useState } from 'react';
import { buildApiEndpoint, normalizeApiResponse } from './api';
import ResourcePage from './ResourcePage';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const endpoint = buildApiEndpoint('teams');

  const loadTeams = useCallback(async () => {
    setLoading(true);
    setError('');

    console.log('Teams endpoint:', endpoint);

    try {
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const payload = await response.json();
      const normalizedTeams = normalizeApiResponse(payload);

      console.log('Teams fetched data:', payload);

      setTeams(normalizedTeams);
    } catch (fetchError) {
      console.error('Teams fetch failed:', fetchError);
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  return (
    <ResourcePage
      title="Teams"
      description="Team data from the Django REST API presented with a shared Bootstrap table and modal layout."
      endpoint={endpoint}
      items={teams}
      loading={loading}
      error={error}
      emptyMessage="No teams returned from the API."
      columns={['ID', 'Name', 'Profile Link']}
      getItemKey={(team) => team.id ?? team.name}
      getSearchText={(team) => `${team.id ?? ''} ${team.name ?? ''}`}
      onRefresh={loadTeams}
      renderRow={(team) => (
        <>
          <td>{team.id ?? 'N/A'}</td>
          <td className="fw-semibold">{team.name ?? 'Unnamed team'}</td>
          <td>
            <a className="link-primary" href={endpoint} target="_blank" rel="noreferrer">
              Team API
            </a>
          </td>
        </>
      )}
      renderDetails={(team) => (
        <div className="card border-0 bg-body-tertiary">
          <div className="card-body">
            <h5 className="card-title">{team.name ?? 'Unnamed team'}</h5>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Team ID</label>
                <input className="form-control" value={team.id ?? 'N/A'} readOnly />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Name</label>
                <input className="form-control" value={team.name ?? 'Unnamed team'} readOnly />
              </div>
            </div>
          </div>
        </div>
      )}
    />
  );
}

export default Teams;