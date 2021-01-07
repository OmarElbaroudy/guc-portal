import React, { useState } from "react";
import { GetUser } from "./GlobalState";
import "bootstrap/dist/css/bootstrap.min.css";
import { loginFetcher } from "../API/loginFetcher";
import { hodFetcher } from "../API/hodFetcher";
import Form from "react-bootstrap/Form";
import { Redirect } from "react-router-dom";

const Login = () => {
	const { setUser } = GetUser();
	const [email, SetEmail] = useState("");
	const [password, SetPassword] = useState("");
	const [redirect, setRedirect] = useState("");

	const login = async () => {
    const data = await loginFetcher.login(email, password);
    if(data){
      setUser({
        token: data.token,
        email: email,
	  });
      setRedirect("/homePage");
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
										<Form.Text className="text-muted">enter your @guc mail.</Form.Text>
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
									<button onClick={() => login()} type="button" class="btn btn-dark">
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
