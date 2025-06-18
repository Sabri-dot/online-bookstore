import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingLog, setEditingLog] = useState(null);
  const [formData, setFormData] = useState({
    userId: '',
    action: '',
    details: '',
    ipAddress: '',
    status: '',
    error: '',
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const token = localStorage.getItem('token');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5001/api/logs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching logs:', error);
      setErrorMsg('Gabim gjatë marrjes së logeve');
      setLoading(false);
      clearMessagesAfterDelay();
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const clearMessagesAfterDelay = () => {
    setTimeout(() => {
      setErrorMsg('');
      setSuccessMsg('');
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const startEdit = (log) => {
    setEditingLog(log);
    setFormData({
      userId: log.userId || '',
      action: log.action || '',
      details: JSON.stringify(log.details || {}),
      ipAddress: log.ipAddress || '',
      status: log.status || '',
      error: log.error || '',
    });
    setErrorMsg('');
    setSuccessMsg('');
  };

  const cancelEdit = () => {
    setEditingLog(null);
    setFormData({
      userId: '',
      action: '',
      details: '',
      ipAddress: '',
      status: '',
      error: '',
    });
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleUpdate = async () => {
    try {
      const updatedLog = {
        userId: formData.userId,
        action: formData.action,
        details: JSON.parse(formData.details || '{}'),
        ipAddress: formData.ipAddress,
        status: formData.status,
        error: formData.error,
      };
      await axios.put(`http://localhost:5001/api/logs/${editingLog._id}`, updatedLog, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchLogs();
      setSuccessMsg('Log-u u editua me sukses');
      clearMessagesAfterDelay();
      cancelEdit();
    } catch (error) {
      console.error('Gabim gjatë përditësimit të logut:', error);
      setErrorMsg('Gabim gjatë përditësimit të logut');
      clearMessagesAfterDelay();
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/logs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchLogs();
      setSuccessMsg('Log-u u fshi me sukses');
      clearMessagesAfterDelay();
      setConfirmDeleteId(null);
    } catch (error) {
      console.error('Gabim gjatë fshirjes së logut:', error);
      setErrorMsg('Gabim gjatë fshirjes së logut');
      clearMessagesAfterDelay();
      setConfirmDeleteId(null);
    }
  };

  const handleAdd = async () => {
    try {
      const newLog = {
        userId: formData.userId,
        action: formData.action,
        details: JSON.parse(formData.details || '{}'),
        ipAddress: formData.ipAddress,
        status: formData.status,
        error: formData.error,
      };
      await axios.post('http://localhost:5001/api/logs', newLog, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchLogs();
      setSuccessMsg('Log-u u krijua me sukses');
      clearMessagesAfterDelay();
      cancelEdit();
    } catch (error) {
      console.error('Gabim gjatë shtimit të logut:', error);
      setErrorMsg('Gabim gjatë shtimit të logut');
      clearMessagesAfterDelay();
    }
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4">Menaxhimi i Logeve</h2>

      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>User ID</th>
                <th>Veprimi</th>
                <th>Detajet</th>
                <th>IP Adresa</th>
                <th>Status</th>
                <th>Error</th>
                <th>Data</th>
                <th>Veprime</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id}>
                  <td>{log.userId || '-'}</td>
                  <td>{log.action}</td>
                  <td>
                    <pre className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                      {JSON.stringify(log.details, null, 2)}
                    </pre>
                  </td>
                  <td>{log.ipAddress || '-'}</td>
                  <td>{log.status}</td>
                  <td>{log.error || '-'}</td>
                  <td>{new Date(log.createdAt).toLocaleString()}</td>
                  <td>
                    <button className="btn btn-sm btn-primary me-2" onClick={() => startEdit(log)}>
                      Edit
                    </button>

                    {confirmDeleteId === log._id ? (
                      <>
                        <button
                          className="btn btn-sm btn-danger me-2"
                          onClick={() => handleDelete(log._id)}
                        >
                          Po, Fshi
                        </button>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => setConfirmDeleteId(null)}
                        >
                          Jo, Anulo
                        </button>
                      </>
                    ) : (
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => setConfirmDeleteId(log._id)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>{editingLog ? 'Edito Log' : 'Shto Log të Ri'}</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              editingLog ? handleUpdate() : handleAdd();
            }}
          >
            <div className="mb-3">
              <label className="form-label">User ID</label>
              <input
                type="text"
                name="userId"
                className="form-control"
                value={formData.userId}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">
                Veprimi (action) <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="action"
                className="form-control"
                value={formData.action}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Detajet JSON</label>
              <textarea
                name="details"
                className="form-control"
                value={formData.details}
                onChange={handleChange}
                rows={4}
                placeholder='p.sh. {"field": "value"}'
              />
            </div>
            <div className="mb-3">
              <label className="form-label">IP Adresa</label>
              <input
                type="text"
                name="ipAddress"
                className="form-control"
                value={formData.ipAddress}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">
                Statusi <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="status"
                className="form-control"
                value={formData.status}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Error</label>
              <input
                type="text"
                name="error"
                className="form-control"
                value={formData.error}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn btn-success me-2">
              {editingLog ? 'Ruaj Ndryshimet' : 'Shto Log'}
            </button>
            {editingLog && (
              <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                Anulo
              </button>
            )}
          </form>
        </>
      )}
    </div>
  );
};

export default ManageLogs;
