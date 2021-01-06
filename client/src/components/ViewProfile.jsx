import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Schedule from "./Schedule";
import Modal from "react-bootstrap/Modal";
import { GetUser } from "./GlobalState";
import { academicFetcher } from "../API/academicFetcher";

const ViewProfile = () => {
	const { user } = GetUser();
	const [show, setShow] = useState(false);
	const [sessions, setSessions] = useState([]);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	useEffect(() => {
		const data = async () => {
			try {
        const res = await academicFetcher.viewSchedule(user.token);
				setSessions(res);
			} catch (err) {
				console.log(err);
			}
		};

		data();
	}, [user.token]);

	return (
		<>
			<Button variant="primary" onClick={handleShow}>
				view schedule
			</Button>

			<Modal size="lg" show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Schedule</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Schedule sessions={sessions}></Schedule>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Close
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};
export default ViewProfile;
