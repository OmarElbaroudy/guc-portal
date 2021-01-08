import React, { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import "bootstrap/dist/css/bootstrap.css";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Popover from "react-bootstrap/Popover";
import { GetUser } from "./components/GlobalState";
import { staffFetcher } from "./API/staffFetcher";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import AttendanceRecord from "./components/AttendanceRecord";

const StaffHome = () => {
	const { user } = GetUser();
	const [show, setShow] = useState(false);
	const [variant, setVariant] = useState("success");
	const [showAlert, setShowAlert] = useState(false);
	const [message, setMessage] = useState("");
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const signIn = async () => {
		const data = await staffFetcher.signIn(user.token);
		console.log(data);
		setMessage(data.message);
		setVariant(data.variant);
		setShowAlert(true);
	};

	const signOut = async () => {
		const data = await staffFetcher.signOut(user.token);
		setMessage(data.message);
		setVariant(data.variant);
		setShowAlert(true);
	};

	const missingDays = async () => {
		const data = await staffFetcher.missingDays(user.token);
	};

	const missingHours = async () => {
		const data = await staffFetcher.missingHours(user.token);
	};

	const popover = (
		<Popover id="popover-basic">
			<Popover.Title as="h3">Popover right</Popover.Title>
			<Popover.Content>
				And here's some <strong>amazing</strong> content. It's very engaging. right?
			</Popover.Content>
		</Popover>
	);

	return (
		<>
			<NavBar />
			<Alert
				class=".col-6"
				variant={variant}
				show={showAlert}
				onClose={() => setShowAlert(false)}
				dismissible
			>
				{message}
			</Alert>
			<Modal size="lg" show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Attendance Records</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<AttendanceRecord></AttendanceRecord>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Close
					</Button>
				</Modal.Footer>
			</Modal>

			<div class="container-fluid">
				<div class="col col-12 head containerIntro">
					<h1>Home</h1>
					<span className="m-2">Welcome</span>
				</div>
				<div class="container">
					<div class="row center">
						<div class="col-md-3 containerIntro">
							<button type="button" href="#" class="btn">
								<span
									class="far fa-clipboard fa-3x"
									href="#"
									onClick={handleShow}
								></span>
							</button>
							<p>Attendance Records</p>
							<br />
							<span class=" border-dark icons">view attendance records</span>
						</div>

						<div class="col-md-3 containerIntro">
							<button type="button" href="#" class="btn">
								<span class="far fa-user fa-3x"> </span>
							</button>
							<p>Profile</p>
							<br />
							<span class=" border-dark icons">view profile</span>
						</div>

						<div class="col-md-3 containerIntro">
							<OverlayTrigger trigger="click" placement="top" overlay={popover}>
								<button type="button" href="#" class="btn">
									<span class="far fa-calendar-times fa-3x"> </span>
								</button>
							</OverlayTrigger>

							<p>Missing Days</p>
							<br />
							<span class=" border-dark icons">view missing days</span>
						</div>

						<div class="col-md-3 containerIntro">
							<button type="button" href="#" class="btn">
								<span class="far fa-clock fa-3x"> </span>
							</button>
							<p>Missing/Extra hours</p>
							<br />
							<span class=" border-dark icons">view missing/extra hours</span>
						</div>
					</div>
				</div>
			</div>
			<div class="container-fluid">
				<div class="container">
					<div class="row center">
						<div class="offset-md-3 col-md-3 containerIntro">
							<button type="button" href="#" class="btn" onClick={signIn}>
								<span class="fas fa-sign-in-alt fa-3x"> </span>
							</button>
							<p>Sign In</p>
							<br />
							<span class=" border-dark icons">sign in</span>
						</div>

						<div class="col-md-3 containerIntro">
							<button type="button" href="#" class="btn" onClick={signOut}>
								<span class="fas fa-sign-out-alt fa-3x"> </span>
							</button>
							<p>Sign Out</p>
							<br />
							<span class=" border-dark icons">sign out</span>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default StaffHome;
