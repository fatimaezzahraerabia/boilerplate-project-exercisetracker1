import React, { useState, useEffect } from 'react';

const API = 'http://localhost:3000/api';

function App() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [desc, setDesc] = useState('');
  const [duration, setDuration] = useState('');
  const [date, setDate] = useState('');
  const [log, setLog] = useState(null);

  useEffect(() => {
    fetch(API + '/users')
      .then(res => res.json())
      .then(setUsers);
  }, []);

  const createUser = e => {
    e.preventDefault();
    fetch(API + '/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    })
      .then(res => res.json())
      .then(user => {
        setUsers([...users, user]);
        setUsername('');
      });
  };

  const addExercise = e => {
    e.preventDefault();
    fetch(`${API}/users/${selectedUser}/exercises`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: desc, duration, date })
    })
      .then(res => res.json())
      .then(() => {
        setDesc('');
        setDuration('');
        setDate('');
      });
  };

  const getLog = () => {
    fetch(`${API}/users/${selectedUser}/logs`)
      .then(res => res.json())
      .then(setLog);
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <h2>Create User</h2>
      <form onSubmit={createUser}>
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="username" required />
        <button type="submit">Create</button>
      </form>
      <h2>Users</h2>
      <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
        <option value="">Select user</option>
        {users.map(u => <option key={u._id} value={u._id}>{u.username}</option>)}
      </select>
      <h2>Add Exercise</h2>
      <form onSubmit={addExercise}>
        <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="description" required />
        <input value={duration} onChange={e => setDuration(e.target.value)} placeholder="duration (min)" type="number" required />
        <input value={date} onChange={e => setDate(e.target.value)} placeholder="date (yyyy-mm-dd)" type="date" />
        <button type="submit" disabled={!selectedUser}>Add</button>
      </form>
      <h2>Logs</h2>
      <button onClick={getLog} disabled={!selectedUser}>Get Logs</button>
      {log && (
        <div>
          <p>User: {log.username}</p>
          <p>Count: {log.count}</p>
          <ul>
            {log.log.map((e, i) => (
              <li key={i}>{e.description} - {e.duration} min - {e.date}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
