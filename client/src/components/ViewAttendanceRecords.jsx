import React, { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import { GetUser } from "./GlobalState";
import { Form, Row } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import Record from "./Record";
import { hrFetcher } from "../API/hrFetcher";

const ViewAttendanceRecord = () => {
	const { user } = GetUser();
	const [records, setRecords] = useState([]);
	const [showAlert, setShowAlert] = useState(false);
	const [spinner, setSpinner] = useState(false);
	const [id, setId] = useState(null);

	const handleSubmission = async () => {
		setSpinner(true);
		const data = await hrFetcher.viewAttendanceRecords(id, user.token);
		if (data === "not a valid id") {
			setShowAlert(true);
		} else {
			setShowAlert(false);
			setRecords(data);
		}
		setSpinner(false);
	};

	return (
		<>
			<Alert
				variant="danger"
				show={showAlert}
				onClose={() => setShowAlert(false)}
				dismissible
			>
				this is not a valid id
			</Alert>
			<Form.Group as={Row}>
				<Form.Control
					style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
					className="col-3 offset-3"
					type="text"
					placeholder="staff member id"
					onChange={(event) => {
						setId(event.target.value);
					}}
				/>
				<Button
					style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
					className="col-2 h-25"
					variant="secondary"
					onClick={handleSubmission}
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
					show
				</Button>
			</Form.Group>
			{records.map((e, idx) => {
				return (
					<Record
						idx={idx}
						day={e.day}
						weekDay={e.weekDay}
						compensation={e.compensation}
						totalTime={e.totalTime}
					></Record>
				);
			})}
		</>
	);
};
export default ViewAttendanceRecord;
