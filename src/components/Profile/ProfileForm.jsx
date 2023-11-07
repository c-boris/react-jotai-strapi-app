import { useEffect, useCallback, useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { userAtom, tokenAtom, uidAtom } from '../../atoms/atoms';

const ProfileForm = () => {
  const token = useAtomValue(tokenAtom);
  const uid = useAtomValue(uidAtom);
  const [user, setUser] = useAtom(userAtom);
  const [newUsername, setNewUsername] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const loadData = useCallback(async () => {
    if (!uid) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:1337/api/users/${uid}`, {
        method: 'get',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Error:', error);
    }
  }, [token, uid, setUser]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleUpdateUsername = async () => {
    try {
      const response = await fetch(`http://localhost:1337/api/users/${uid}`, {
        method: 'put',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: newUsername }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const updatedUserData = { ...user, username: newUsername };
      setUser(updatedUserData);
      setNewUsername('');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUpdateDescription = async () => {
    try {
      const response = await fetch(`http://localhost:1337/api/users/${uid}`, {
        method: 'put',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: newDescription }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const updatedUserData = { ...user, description: newDescription };
      setUser(updatedUserData);
      setNewDescription('');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2>User Profile</h2>
      {user && (
        <div>
          <p>Username : {user.username}</p>
          <p>Email : {user.email}</p>
          <p>Description : {user.description}</p>

          <div>
            <input
              type="text"
              placeholder="New username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
            <br />
            <button onClick={handleUpdateUsername}>Change username</button>
          </div>
          
          <div>
            <input
              type="text"
              placeholder="New description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
            <br />
            <button onClick={handleUpdateDescription}>Change description</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileForm;
