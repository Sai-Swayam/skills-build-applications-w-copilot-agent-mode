import { useMemo, useState } from 'react';

function ResourcePage({
  title,
  description,
  endpoint,
  items,
  loading,
  error,
  emptyMessage,
  columns,
  getItemKey,
  getSearchText,
  renderRow,
  renderDetails,
  onRefresh,
}) {
  const [query, setQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return items;
    }

    return items.filter((item) => getSearchText(item).toLowerCase().includes(normalizedQuery));
  }, [getSearchText, items, query]);

  function handleSubmit(event) {
    event.preventDefault();
  }

  function handleCloseModal() {
    setSelectedItem(null);
  }

  return (
    <section className="resource-section">
      <div className="card border-0 shadow-sm resource-card">
        <div className="card-body p-4 p-xl-5">
          <div className="d-flex flex-column flex-xl-row justify-content-between align-items-xl-start gap-4 mb-4">
            <div>
              <h2 className="h3 mb-2">{title}</h2>
              <p className="text-secondary mb-2">{description}</p>
              <a
                className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover small fw-semibold"
                href={endpoint}
                target="_blank"
                rel="noreferrer"
              >
                Open REST endpoint
              </a>
            </div>

            <div className="resource-meta card border-0 bg-body-tertiary">
              <div className="card-body p-3">
                <p className="text-uppercase small fw-semibold text-secondary mb-2">API Endpoint</p>
                <p className="mb-0 small endpoint-link">{endpoint}</p>
              </div>
            </div>
          </div>

          <form className="row g-3 align-items-end mb-4" onSubmit={handleSubmit}>
            <div className="col-12 col-lg-6">
              <label className="form-label fw-semibold" htmlFor={`${title}-search`}>
                Filter {title.toLowerCase()}
              </label>
              <input
                id={`${title}-search`}
                className="form-control"
                type="search"
                value={query}
                placeholder={`Search ${title.toLowerCase()}...`}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <div className="col-12 col-lg-6">
              <div className="d-flex flex-wrap gap-2">
                <button className="btn btn-primary" type="submit">
                  Search
                </button>
                <button className="btn btn-outline-secondary" type="button" onClick={() => setQuery('')}>
                  Clear
                </button>
                <button className="btn btn-outline-dark" type="button" onClick={onRefresh}>
                  Refresh Data
                </button>
              </div>
            </div>
          </form>

          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <h3 className="h5 mb-0">{title} Table</h3>
            <span className="badge text-bg-light border text-dark px-3 py-2">
              Showing {filteredItems.length} of {items.length}
            </span>
          </div>

          {loading ? <div className="alert alert-info">Loading {title.toLowerCase()}...</div> : null}
          {error ? <div className="alert alert-danger">{error}</div> : null}

          {!loading && !error && filteredItems.length === 0 ? (
            <div className="alert alert-light border">{emptyMessage}</div>
          ) : null}

          {!loading && !error && filteredItems.length > 0 ? (
            <div className="table-responsive border rounded-4 overflow-hidden">
              <table className="table table-striped table-hover align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    {columns.map((column) => (
                      <th key={column} scope="col">
                        {column}
                      </th>
                    ))}
                    <th scope="col" className="text-end">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item, index) => (
                    <tr key={getItemKey(item, index)}>
                      {renderRow(item, index)}
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          type="button"
                          onClick={() => setSelectedItem(item)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </div>

      {selectedItem ? (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content border-0 shadow-lg">
                <div className="modal-header">
                  <h4 className="modal-title h5 mb-0">{title} Details</h4>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={handleCloseModal}
                  />
                </div>
                <div className="modal-body">{renderDetails(selectedItem)}</div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={handleCloseModal} />
        </>
      ) : null}
    </section>
  );
}

export default ResourcePage;