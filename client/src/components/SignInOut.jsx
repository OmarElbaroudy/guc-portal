import React, { useState, useEffect } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { hrFetcher } from "../API/hrFetcher";
import { GetUser } from "./GlobalState";
import { Col, Form, Row } from "react-bootstrap";

const SignInOut = (props) => {
	const { user } = GetUser();
	const [showAlert, setShowAlert] = useState(false);
	const [message, setMessage] = useState("oops something went wrong");
	const [spinner, setSpinner] = useState(false);
	const [date, setDate] = useState(null);
	const [hours, setHours] = useState(0);
	const [minutes, setMinutes] = useState(0);
    const [id, setId] = useState(null);
    const [out, setOut] = useState(null);

	const getDate = () => {
		const d = new Date(Date.parse(date));
		if (d) {
			const ret = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
			return {
				year: ret.getFullYear(),
				month: ret.getMonth() + 1,
				day: ret.getDate(),
				hour: parseInt(hours),
				minute: parseInt(minutes),
			};
		}
		return undefined;
	};

	const getHours = () => {
		let arr = [];
		for (let i = 0; i < 24; i++) {
			arr.push(i);
		}

		return arr.map((element) => {
			return <option value={element}>{element}</option>;
		});
	};

	const getMinutes = () => {
		let arr = [];
		for (let i = 0; i < 60; i++) {
			arr.push(i);
		}

		return arr.map((element) => {
			return <option value={element}>{element}</option>;
		});
	};

	const handleSubmission = async (signOut) => {
		try {
            setSpinner(true);
            setOut(signOut);
			let data = "";

			if (signOut) {
				data = await hrFetcher.signInOut(id, null, getDate(), user.token);
			}

			if (!signOut) {
				data = await hrFetcher.signInOut(id, getDate(), null, user.token);
			}

			if (data === "done") {
				props.handleClose();
			} else {
				setMessage(data);
				setShowAlert(true);
			}
			setSpinner(false);
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<>
			<Alert
				variant="danger"
				show={showAlert}
				onClose={() => setShowAlert(false)}
				dismissible
			>
				{message}
			</Alert>
			<Form.Group as={Row}>
				<Form.Label column="lg" lg={2}>
					id:
				</Form.Label>
				<Col>
					<Form.Control
						className="col-6"
						type="text"
						placeholder="enter staff member id"
						onChange={(event) => {
							setId(event.target.value);
						}}
					/>
				</Col>
			</Form.Group>

			<Form.Group as={Row}>
				<Form.Label column="lg" lg={2}>
					Date:
				</Form.Label>
				<Col>
					<Form.Control
						type="date"
						name="dob"
						className="col-6"
						onChange={(event) => {
							setDate(event.target.value);
						}}
					/>
				</Col>
			</Form.Group>

			<Form.Group as={Row}>
				<Form.Label column="lg" lg={2}>
					<p>hours:</p>
				</Form.Label>
				<Col xs="auto" className="my-1">
					<Form.Control
						as="select"
						className="mr-sm-2"
						id="requestType"
						custom
						onChange={(event) => {
							setHours(event.target.value);
						}}
					>
						{getHours()}
					</Form.Control>
				</Col>
				<Form.Label column="lg" lg={2}>
					minutes:
				</Form.Label>
				<Col xs="auto" className="my-1">
					<Form.Control
						as="select"
						className="mr-sm-2"
						id="requestType"
						custom
						onChange={(event) => {
							setMinutes(event.target.value);
						}}
					>
						{getMinutes()}
					</Form.Control>
				</Col>
			</Form.Group>

			<Button
				className="col-3"
				variant="success"
				onClick={() => {
					handleSubmission(false);
				}}
			>
				{spinner && !out ? (
					<Spinner
						as="span"
						animation="border"
						size="sm"
						role="status"
						aria-hidden="true"
					/>
				) : null}
				SignIn
			</Button>
			<Button
				className="col-3"
				variant="danger"
				onClick={() => {
					handleSubmission(true);
				}}
			>
				{spinner && out ? (
					<Spinner
						as="span"
						animation="border"
						size="sm"
						role="status"
						aria-hidden="true"
					/>
				) : null}
				SignOut
			</Button>
		</>
	);
};

export default SignInOut;
