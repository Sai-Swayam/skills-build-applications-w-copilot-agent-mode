import { useCallback, useEffect, useState } from 'react';
import { buildApiEndpoint, normalizeApiResponse } from './api';
import ResourcePage from './ResourcePage';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const endpoint = buildApiEndpoint('users');

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError('');

    console.log('Users endpoint:', endpoint);

    try {
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const payload = await response.json();
      const normalizedUsers = normalizeApiResponse(payload);

      console.log('Users fetched data:', payload);

      setUsers(normalizedUsers);
    } catch (fetchError) {
      console.error('Users fetch failed:', fetchError);
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <ResourcePage
      title="Users"
      description="User data from the Django REST API in a consistent Bootstrap table layout."
      endpoint={endpoint}
      items={users}
      loading={loading}
      error={error}
      emptyMessage="No users returned from the API."
      columns={['Username', 'Email', 'Team']}
      getItemKey={(user) => user.id ?? user.username}
      getSearchText={(user) => `${user.username ?? ''} ${user.email ?? ''} ${user.team?.name ?? ''}`}
      onRefresh={loadUsers}
      renderRow={(user) => (
        <>
          <td>
            <span className="fw-semibold">{user.username ?? 'Unknown user'}</span>
          </td>
          <td>
            {user.email ? (
              <a className="link-primary" href={`mailto:${user.email}`}>
                {user.email}
              </a>
            ) : (
              'No email available'
            )}
          </td>
          <td>{user.team?.name ?? 'Unassigned'}</td>
        </>
      )}
      renderDetails={(user) => (
        <div className="card border-0 bg-body-tertiary">
          <div className="card-body">
            <h5 className="card-title">{user.username ?? 'Unknown user'}</h5>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Email</label>
                <input className="form-control" value={user.email ?? 'No email available'} readOnly />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Team</label>
                <input className="form-control" value={user.team?.name ?? 'Unassigned'} readOnly />
              </div>
            </div>
          </div>
        </div>
      )}
    />
  );
}

export default Users;