import React from "react";

const LoginScreen = () => {
  return (
    <div className="LoginScreen">
      <div className="inputBody">
        <input type="text" placeholder="E-Mail Address" />
        <input type="password" placeholder="Password" />
      </div>

      <div className="buttonBody">
        <button>Login</button>
        <button>Cancel</button>
      </div>
    </div>
  );
};

export default LoginScreen;
