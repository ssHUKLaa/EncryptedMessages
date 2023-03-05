import React, { useState } from 'react';
import Gun from 'gun';
import 'gun/sea';

const gun = Gun();
const user = gun.user();

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginFailed, setLoginFailed] = useState(false);

  async function decryptCredentials(encUsername, encPassword) {
    const { priv } = await user.pair();
    const username = await Gun.SEA.decrypt(encUsername, priv);
    const password = await Gun.SEA.decrypt(encPassword, priv);
    return { username, password };
  }

  async function handleLogin(event) {
    event.preventDefault();
    const existingUser = await user.get(username).then();
    if (existingUser) {
      const { encUsername, epub, salt } = existingUser._.sea;
      const encPassword = await Gun.SEA.besecure(password, salt, epub);
      const { username, password } = await decryptCredentials(encUsername, encPassword);
      user.auth(username, password, (ack) => {
        if (ack.err) {
          console.error(ack);
          setLoginFailed(true);
        } else {
          console.log(ack);
        }
      });
    } else {
      setLoginFailed(true);
    }
  }

  return (
    <div>
      {loginFailed ? (
        <p>Login failed. Please check your username and password.</p>
      ) : null}
      <form onSubmit={handleLogin}>
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
