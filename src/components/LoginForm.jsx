import { useState } from "react";
import PropTypes from "prop-types";
const LoginForm = ({ handleLogin }) => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const login = (e) => {
    e.preventDefault();
    const objecLogin = {
      username,
      password,
    };
    handleLogin(objecLogin);
    setPassword("");
    setUserName("");
  };
  return (
    <div>
      <form onSubmit={login}>
        <div>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUserName(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <div>
          <button type="submit">log in</button>
        </div>
      </form>
    </div>
  );
};
LoginForm.prototype = {
  handleLogin: PropTypes.func.isRequired,
};
export default LoginForm;
