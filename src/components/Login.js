import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = (props) => {
  const [credentials, setCredentails] = useState({ email: "", password: "" });

  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://127.0.0.1:5000/api/auth/login", {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    const json = await response.json();

    console.log(json);

    if (json.success) {
      //redirect

      localStorage.setItem("token", json.authtoken);
      
      props.showAlert("Logged In Succesfully " , "success");
      navigate("/");
    } else {
      props.showAlert("Invalid Details" , "danger");
    }
  };

  const onChange = (e) => {
    setCredentails({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="mt-3">
    <h2>Login to continue to NoteTrackr</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            onChange={onChange}
            type="email"
            className="form-control"
            id="email"
            value={credentials.email}
            name="email"
            aria-describedby="emailHelp"
            placeholder="Enter your Email"
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            onChange={onChange}
            type="password"
            name="password"
            value={credentials.password}
            className="form-control"
            id="password"
            placeholder="Enter your Password"
          />
        </div>
        <center>

        <button type="submit" className="btn btn-primary my-3">
          Submit
        </button>
        <p className ="text-center last-para mx-3">Don't have an account?
        <a href="/signup">Signup</a></p>
        </center>

      </form>
    </div>
  );
};

export default Login;
