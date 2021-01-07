import { academicFetcher } from "../API/academicFetcher";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import RequestForm from "./RequestForm";
import { GetUser } from "./GlobalState";
import Schedule from "./Schedule";

const ViewProfile = () => {
	const { user } = GetUser();
	const [show, setShow] = useState(false);
	const [sessions, setSessions] = useState([]);
	const [comp, setComp] = useState("");

	const handleClose = () => setShow(false);

	const handleShow = (comp) => {
		setComp(comp);
		setShow(true);
	};

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
			<Button
				variant="primary"
				onClick={() => {
					handleShow("schedule");
				}}
			>
				view schedule
			</Button>

			<Button
				variant="secondary"
				onClick={() => {
					handleShow("request");
				}}
			>
				send request
			</Button>

			<Modal size="lg" show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>
						{comp === "schedule" ? "Schedule" : "Request Form"}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{comp === "schedule" ? (
						<Schedule sessions={sessions}></Schedule>
					) : (
						<RequestForm close = {handleClose}></RequestForm>
					)}
				</Modal.Body>
				<Modal.Footer>
					{true ? (
						<Button variant="secondary" onClick={handleClose}>
							Close
						</Button>
					) : null}
				</Modal.Footer>
			</Modal>
		</>
	);
};
export default ViewProfile;
