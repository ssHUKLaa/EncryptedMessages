import React, { useState } from 'react';
import Gun from 'gun';
import 'gun/sea';

const gun = Gun();
const user = gun.user();

function Registration() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registrationComplete, setRegistrationComplete] = useState(false);

  async function encryptCredentials(username, password) {
    const { pub } = await user.pair();
    const encUsername = await Gun.SEA.encrypt(username, pub);
    const encPassword = await Gun.SEA.encrypt(password, pub);
    return { encUsername, encPassword };
  }

  async function handleRegistration(event) {
    event.preventDefault();
    const { encUsername, encPassword } = await encryptCredentials(username, password);
    user.create(username, password, (ack) => {
      console.log(ack);
      setRegistrationComplete(true);
    }, { alias: encUsername });
  }

  return (
    <div>
      {registrationComplete ? (
        <p>Registration complete. Please check your email to verify your account.</p>
      ) : (
        <form onSubmit={handleRegistration}>
          <label>
            Username:
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>
          <label>
            Password:
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <button type="submit">Register</button>
        </form>
      )}
    </div>
  );
}

export default Registration;
