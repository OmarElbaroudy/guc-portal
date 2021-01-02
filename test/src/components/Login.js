import React, { useState } from "react";
import { GetUser } from "../GlobalState";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import { Link, Redirect } from "react-router-dom";

const Login = () => {
  const { user, setUser } = GetUser();
  const [email, SetEmail] = useState("");
  const [password, SetPassword] = useState("");
  const [redirect, setRedirect] = useState("");

  const login = async () => {
    try {
      const params = { email: email, password: password };
      console.log(params);
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        body: JSON.stringify(params),
        headers: {
          Authorization: "",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const data = await res.json();
      console.log(data);
      setUser({
        token: data.token,
        email: email,
      });
      console.log(user);
      setRedirect("/homePage");
    } catch (error) {
      console.log(error);
    }
  };

  if (redirect) return <Redirect to="/homePage" />;

  return (
    <div>
      <body class="st">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col col-xl-7 col-lg-7 col-md-8 col-sm-11 col-md-xs-10 offset-xl-2 offset-lg-1 offset-xs-2">
              <img
                src="https://www.guc.edu.eg/img/guc_logo_og.png"
                class="img-circle"
              />
            </div>
            <div class="col col-xl-5 col-lg-6 col-md-8 col-sm-12 col-md-xs-12">
              <div class="form-container">
                <Form>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      onChange={(event) => {
                        SetEmail(event.target.value);
                      }}
                      type="email"
                      placeholder="Enter email"
                    />
                    <Form.Text className="text-muted">
                      enter your @guc mail.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      onChange={(event) => {
                        SetPassword(event.target.value);
                      }}
                      type="password"
                      placeholder="Password"
                    />
                  </Form.Group>
                  <button
                    onClick={() => login()}
                    type="button"
                    class="btn btn-dark"
                  >
                    login
                  </button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </body>
    </div>
  );
};

export default Login;
