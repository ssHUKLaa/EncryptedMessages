const express = require('express')
const app = express()
const port = 5050
const Gun = require('gun');

app.use(Gun.serve)

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = Gun.user(username);
    const userData = await user.then();
    if (userData && userData.alias && userData.sea) {
      const { encUsername, encPassword } = userData.sea;
      const { priv } = await user.pair(password);
      const decryptedUsername = await Gun.SEA.decrypt(encUsername, priv);
      const decryptedPassword = await Gun.SEA.decrypt(encPassword, priv);
      if (username === decryptedUsername && password === decryptedPassword) {
        res.send({ success: true });
      } else {
        res.send({ success: false, error: 'Invalid credentials' });
      }
    } else {
      res.send({ success: false, error: 'User not found' });
    }
  });

const server = app.listen(port, () => {
    console.log('Gun server running on port ${port}')
})
Gun({web: server  })