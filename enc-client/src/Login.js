import React, { Component } from 'react';
import Gun from 'gun';
import SEA from 'gun/sea';
import './App.css';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      loggedIn: false,
      loginError: '',
    };

    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleUsernameChange(event) {
    this.setState({ username: event.target.value });
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  async handleSubmit(event) {
    event.preventDefault();

    const gun = Gun();
    const user = gun.user();

    try {
      const encrypted = await user.get(this.state.username).then(encrypted => encrypted);
      const decrypted = await SEA.decrypt(encrypted, this.state.password);
      if (decrypted !== this.state.username) {
        this.setState({ loginError: 'Invalid username or password.' });
        return;
      }

      const pair = await SEA.pair();
      const encryptedPair = await SEA.encrypt(pair, this.state.password);
      await user.auth(this.state.username, encryptedPair);

      this.setState({ loggedIn: true });
      this.props.setLoggedInUser(this.state.username);
    } catch (error) {
      console.error(error);
      this.setState({ loginError: 'An error occurred while logging in. Please try again later.' });
    }
  }

  render() {
    if (this.state.loggedIn) {
      return <div>You are logged in as {this.state.username}.</div>;
    }

    return (
      <div className="login-form">
        <h2>Login</h2>
        {this.state.loginError ? <div className="error">{this.state.loginError}</div> : null}
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" value={this.state.username} onChange={this.handleUsernameChange} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" value={this.state.password} onChange={this.handlePasswordChange} />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

export default Login;
