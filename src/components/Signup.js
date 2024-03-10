import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = (props) => {
  const [credentials, setCredentails] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });

  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = credentials;
    const response = await fetch("http://localhost:5000/api/auth/createuser", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjU1NzI4OWE4OTk3NDQ4Y2NmMzYwYTQzIn0sImlhdCI6MTcwMDIxMDg0Mn0.sbRyAEGM4pviRpJ02XBnVjdxqzay_O1SMeQphH08cHU",
      },

      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const json = await response.json();

    console.log(json);

    if (json.success) {
      //redirect

      localStorage.setItem("token", json.authtoken);
      navigate("/");
      props.showAlert("Account Created Succesfully " , "success");
    } else {
      props.showAlert("Invalid Credentials" , "danger");
    }
  };

  const onChange = (e) => {
    setCredentails({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mt-2">
    
    <h2 className="my-2">Create an account to use iNotebook</h2>
      <form onSubmit={handleSubmit}>
        <div className="my-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="name"
            className="form-control"
            id="name"
            aria-describedby="emailHelp"
            name="name"
            onChange={onChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            aria-describedby="emailHelp"
            onChange={onChange}
            name="email"
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
            type="password"
            className="form-control"
            id="password"
            onChange={onChange}
            name="password"
            minLength={5}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className="form-control"
            id="cpassword"
            onChange={onChange}
            name="cpassword"
            minLength={5}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Signup;
