import React, { useEffect, useState } from "react";
import { GetUser } from "./GlobalState";
import { Col, Form, Row } from "react-bootstrap";
import { staffFetcher } from "../API/staffFetcher";
import Record from "./Record";

const AttendanceRecord = () => {
	const { user } = GetUser();
	const [records, setRecords] = useState([]);
	const [month, setMonth] = useState(-1);

	const arr = [
		"all",
		"january",
		"february",
		"march",
		"april",
		"may",
		"june",
		"july",
		"august",
		"september",
		"october",
		"november",
		"december",
	];

	useEffect(() => {
		if (month === -1) setRecords([]);
		else {
			const getRecords = async () => {
				const data = await staffFetcher.getAttendanceRecords(month, user.token);
				setRecords(data);
			};
			getRecords();
		}
	}, [month, user.token]);

	return (
		<Form.Group as={Row}>
			<Form.Label column="lg" lg={2}>
				Month:
			</Form.Label>
			<Col xs="auto" className="my-1">
				<Form.Control
					as="select"
					className="mr-sm-2"
					id="requestType"
					custom
					onChange={(event) => {
						setMonth(event.target.value);
					}}
				>
					<option value={-1}>choose...</option>
					{arr.map((name, idx) => {
						return <option value={idx}>{name}</option>;
					})}
				</Form.Control>
			</Col>
			{records.map((e, idx) => {
				return (
					<Record
						idx={idx}
						day={e.day}
						weekDay={e.weekDay}
						compensation={e.compensation}
					></Record>
				);
			})}
		</Form.Group>
	);
};

export default AttendanceRecord;
