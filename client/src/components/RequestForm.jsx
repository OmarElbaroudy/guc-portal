import React, { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { getterFetcher } from "../API/getterFetcher";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import { GetUser } from "./GlobalState";

const RequestForm = () => {
	const { user } = GetUser();

	const [requestType, setRequestType] = useState("undefined");
	const [id, setId] = useState(null);
	const [slot, setSlot] = useState(1);
	const [courseName, setCourseName] = useState(null);
	const [weekDay, setWeekDay] = useState(0);
	const [date, setDate] = useState(null);
	const [location, setLocation] = useState(null);
	const [newDayOff, setNewDayOff] = useState(0);
	const [comment, setComment] = useState("");

	// useEffect(() => {
	// 	const data = async () => {
	// 		const res = await getterFetcher.getCourseIdByName(user.token);
	// 	};
	// 	data();
	// }, [user.token]);

	return (
		<Form>
			<Form.Group as={Row}>
				<Form.Label column="lg" lg={2}>
					type:
				</Form.Label>
				<Col xs="auto" className="my-1">
					<Form.Control
						as="select"
						className="mr-sm-2"
						id="requestType"
						custom
						onChange={(event) => {
							setRequestType(event.target.value);
						}}
					>
						<option value="undefined">Choose...</option>
						<option value="replacement">replacement</option>
						<option value="slotLinking">slot linking</option>
						<option value="maternity">maternity</option>
						<option value="accidental">accidental</option>
						<option value="annual">annual</option>
						<option value="sick">sick</option>
						<option value="compensation">compensation</option>
						<option value="changeDayOff">change day off</option>
					</Form.Control>
				</Col>
			</Form.Group>
			{requestType === "replacement" ? (
				<>
					<Form.Group as={Row}>
						<Form.Label column="lg" lg={2}>
							receiver id:
						</Form.Label>
						<Col>
							<Form.Control
								className="col-3"
								type="text"
								placeholder="optional"
								onChange={(event) => {
									setId(event.target.value);
								}}
							/>
						</Col>
					</Form.Group>
					<Form.Group as={Row}>
						<Form.Label column="lg" lg={2}>
							slot:
						</Form.Label>
						<Col xs="auto" className="my-1">
							<Form.Control
								as="select"
								className="mr-sm-2"
								id="requestType"
								custom
								onChange={(event) => {
									setSlot(parseInt(event.target.value));
								}}
							>
								<option value="1">first</option>
								<option value="2">second</option>
								<option value="3">third</option>
								<option value="4">fourth</option>
								<option value="5">fifth</option>
							</Form.Control>
						</Col>
					</Form.Group>
				</>
			) : null}
			{requestType === "slotLinking" ? (
				<Form.Group as={Row}>
					<Form.Label column="lg" lg={2}>
						week day:
					</Form.Label>
					<Col xs="auto" className="my-1">
						<Form.Control
							as="select"
							className="mr-sm-2"
							id="requestType"
							custom
							onChange={(event) => {
								setWeekDay(parseInt(event.target.value));
							}}
						>
							<option value="0">Sunday</option>
							<option value="1">Monday</option>
							<option value="2">Tuesday</option>
							<option value="3">Wednesday</option>
							<option value="4">Thursday</option>
							<option value="6">Saturday</option>
						</Form.Control>
					</Col>

					<Form.Label column="lg" lg={1}>
						slot:
					</Form.Label>
					<Col xs="auto" className="my-1">
						<Form.Control
							as="select"
							className="mr-sm-2"
							id="requestType"
							custom
							onChange={(event) => {
								setSlot(parseInt(event.target.value));
							}}
						>
							<option value="1">first</option>
							<option value="2">second</option>
							<option value="3">third</option>
							<option value="4">fourth</option>
							<option value="5">fifth</option>
						</Form.Control>
					</Col>
				</Form.Group>
			) : null}
			{requestType === "replacement" || requestType === "slotLinking" ? (
				<Form.Group as={Row}>
					<Form.Label column="lg" lg={2}>
						course:
					</Form.Label>
					<Col>
						<Form.Control
							className="col-4"
							type="text"
							placeholder="enter course name"
							onChange={(event) => {
								setCourseName(event.target.value);
							}}
						/>
					</Col>
				</Form.Group>
			) : null}
			{requestType !== "changeDayOff" &&
			requestType !== "slotLinking" &&
			requestType !== "undefined" ? (
				<Form.Group controlId="dob" as={Row}>
					<Form.Label column="lg" lg={2}>
						Date:
					</Form.Label>
					<Col>
						<Form.Control
							type="date"
							name="dob"
							className="col-4"
							onChange={(event) => {
								setDate(event.target.value);
							}}
						/>
					</Col>
				</Form.Group>
			) : null}
			{requestType === "slotLinking" ? (
				<Form.Group as={Row}>
					<Form.Label column="lg" lg={2}>
						location:
					</Form.Label>
					<Col>
						<Form.Control
							className="col-4"
							type="text"
							placeholder="enter location name"
							onChange={(event) => {
								setLocation(event.target.value);
							}}
						/>
					</Col>
				</Form.Group>
			) : null}
			{requestType === "changeDayOff" ? (
				<>
					<Form.Group as={Row}>
						<Form.Label column="lg" lg="2">
							newDayOff:
						</Form.Label>
						<Col xs="auto" className="my-1">
							<Form.Control
								as="select"
								className="mr-sm-2"
								id="requestType"
								custom
								onChange={(event) => {
									setNewDayOff(parseInt(event.target.value));
								}}
							>
								<option value="0">Sunday</option>
								<option value="1">Monday</option>
								<option value="2">Tuesday</option>
								<option value="3">Wednesday</option>
								<option value="4">Thursday</option>
								<option value="6">Saturday</option>
							</Form.Control>
						</Col>
					</Form.Group>
				</>
			) : null}
			{requestType !== "undefined" &&
			requestType !== "replacement" &&
			requestType !== "slotLinking" ? (
				<Form.Group as={Row}>
					<Form.Label column="lg" lg={2}>
						comment:
					</Form.Label>
					<Form.Control
						as="textarea"
						className="col-7"
						rows="5"
						type="textarea"
						placeholder="optional"
						onChange={(event) => {
							setComment(event.target.value);
						}}
					/>
				</Form.Group>
			) : null}
			{requestType !== "undefined" ? (
				<Button className="col-5" variant="primary" type="submit">
					Submit
				</Button>
			) : null}
		</Form>
	);
};

export default RequestForm;
