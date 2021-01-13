import React, { useState } from "react";
import { GetUser } from "../common/GlobalState";
import "bootstrap/dist/css/bootstrap.min.css";
import { loginFetcher } from "../../API/loginFetcher";
import { getterFetcher } from "../../API/getterFetcher";
import Form from "react-bootstrap/Form";
import { Redirect } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import "../../views/btn.css";

const Login = () => {
  const { setUser } = GetUser();
  const [email, SetEmail] = useState("");
  const [password, SetPassword] = useState("");
  const [redirect, setRedirect] = useState("");
  const [color, setColor] = useState("danger");
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState("oops something went wrong");
  const [spinner, setSpinner] = useState(false);
  const [spinner1, setSpinner1] = useState(false);

  const login = async () => {
    setSpinner(true);
    const data = await loginFetcher.login(email, password);
    if (data === "This email doesn't exist") {
      setColor("danger");
      setMessage("This email doesn't exist");
      setShowAlert(true);
      setSpinner(false);
      return;
    }
    if (data === "wrong password") {
      setColor("danger");
      setMessage("wrong password");
      setShowAlert(true);
      setSpinner(false);
      return;
    }
    let hod = false;
    let academic = false;
    let instructor = false;
    let coordinator = false;
    //notify when wrong password or email
    if (data.type === "academic") {
      for (const entry of data.user.courses) {
        if (entry.position === "hod") hod = true;
        if (entry.position === "academic") academic = true;
        if (entry.position === "instructor") instructor = true;
        if (entry.position === "coordinator") coordinator = true;
      }

      const valid = await getterFetcher.isHod(
        data.user.departmentId,
        data.user._id,
        data.token
      );
      if (valid) hod = true;

      if (data) {
        setUser({
          token: data.token,
          email: email,
          hod: hod,
          academic: academic,
          instructor: instructor,
          coordinator: coordinator,
          type: "academic",
        });
        setSpinner(false);
        setRedirect("/staffHome");
      }
    } else {
      setUser({
        token: data.token,
        email: email,
        type: "Hr",
      });
      setSpinner(false);
      setRedirect("/staffHome");
    }
  };

  const addFirst = async () => {
    setSpinner1(true);
    const res = await loginFetcher.AddFirst();
    if (res === "the data base contains at least a user") {
      setColor("danger");
      setMessage(res);
      setShowAlert(true);
      setSpinner1(false);
      return;
    } else {
      setColor("success");
      setMessage(res);
      setShowAlert(true);
      setSpinner1(false);
      return;
    }
  };

  if (redirect) return <Redirect to={redirect} />;

  return (
    <div>
      <body class="st">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col col-xl-7 col-lg-7 col-md-8 col-sm-11 col-md-xs-10 offset-xl-2 offset-lg-1 offset-xs-2">
              <img
                src="https://www.guc.edu.eg/img/guc_logo_og.png"
                class="img-circle"
                alt="guc logo"
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
                      enter your mail.
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
                  <Alert
                    variant={color}
                    show={showAlert}
                    onClose={() => setShowAlert(false)}
                    dismissible
                  >
                    {message}
                  </Alert>
                  <button
                    onClick={() => login()}
                    type="button"
                    class="btn"
                    id="close"
                  >
                    {spinner ? (
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    ) : null}
                    login
                  </button>

                  <Button
                    style={{ marginLeft: 60 }}
                    onClick={() => addFirst()}
                    type="button"
                    class="btn btn-dark"
                    variant="success"
                  >
                    {spinner1 ? (
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    ) : null}
                    Add Ashry (HR)
                  </Button>
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
