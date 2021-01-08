import NavBar from "./components/NavBar";
import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.css";
import AttendanceRecord from "./components/AttendanceRecord";

const StaffHome = () => {
  const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  


	const viewAttendance = () => {
		handleShow();
	};

	return (
		<>
			<Modal size="lg" show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Attendance Records</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<AttendanceRecord></AttendanceRecord>
				</Modal.Body>
				<Modal.Footer>
					{true ? (
						<Button variant="secondary" onClick={handleClose}>
							Close
						</Button>
					) : null}
				</Modal.Footer>
			</Modal>
			<div class="container-fluid">
				<NavBar />
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
									onClick={() => {
										viewAttendance();
									}}
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
							<button type="button" href="#" class="btn">
								<span class="far fa-calendar-times fa-3x"> </span>
							</button>
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
		</>
	);
};
export default StaffHome;
