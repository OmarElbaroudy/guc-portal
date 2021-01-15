import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { getterFetcher } from "../../API/getterFetcher";
import { GetUser } from "./GlobalState";

const Profile = (props) => {
	const { user } = GetUser();
	const [department, setDepartment] = useState(null);
	const [location, setLocation] = useState(null);
	const [faculty, setFaculty] = useState(null);

	const getDay = (num) => {
		switch (num) {
			case 0:
				return "Sunday";
			case 1:
				return "Monday";
			case 2:
				return "Tuesday";
			case 3:
				return "Wednesday";
			case 4:
				return "Thursday";
			case 5:
				return "Friday";
			case 6:
				return "Saturday";
			default:
		}
	};

	useEffect(() => {
		//setInterval(() => {}, 10000);
		const getDepartment = async () => {
			const data = await getterFetcher.getDepNameById(
				props.department,
				user.token
			);
			console.log(data);
			setDepartment(data);
		};

		const getLocation = async () => {
			const data = await getterFetcher.getLocationNameById(
				props.location,
				user.token
			);
			setLocation(data.name);
		};

		const getFaculty = async () => {
			const data = await getterFetcher.getFacultyNameById(
				props.faculty,
				user.token
			);
			setFaculty(data.name);
		};

		getDepartment();
		getFaculty();
		getLocation();
	}, [props.location, props.department, props.faculty, user.token]);

	return (
		<ListGroup>
			{props.name && (
				<ListGroup.Item>
					name: <strong>{props.name}</strong>
				</ListGroup.Item>
			)}
			{props.email && (
				<ListGroup.Item>
					email: <strong>{props.email}</strong>
				</ListGroup.Item>
			)}
			{props.gender && (
				<ListGroup.Item>
					gender: <strong>{props.gender}</strong>
				</ListGroup.Item>
			)}
			{props.id && (
				<ListGroup.Item>
					id: <strong>{props.id}</strong>
				</ListGroup.Item>
			)}
			{props.accidentalLeaveBalance && (
				<ListGroup.Item>
					accidental leave balance: <strong>{props.accidentalLeaveBalance}</strong>
				</ListGroup.Item>
			)}
			{props.annualLeaveBalance && (
				<ListGroup.Item>
					annual leave balance: <strong>{props.annualLeaveBalance}</strong>
				</ListGroup.Item>
			)}

			{props.personalInfo && (
				<ListGroup.Item>
					personal info: <strong>{props.personalInfo}</strong>
				</ListGroup.Item>
			)}
			{props.salary && (
				<ListGroup.Item>
					salary: <strong>{props.salary}</strong> EGP
				</ListGroup.Item>
			)}
			{location && (
				<ListGroup.Item>
					office location: <strong>{location}</strong>
				</ListGroup.Item>
			)}
			{department && (
				<ListGroup.Item>
					department: <strong>{department}</strong>
				</ListGroup.Item>
			)}
			{faculty && (
				<ListGroup.Item>
					faculty: <strong>{faculty}</strong>
				</ListGroup.Item>
			)}
			{props.dayOff && (
				<ListGroup.Item>
					day off: <strong>{getDay(props.dayOff)}</strong>
				</ListGroup.Item>
			)}
		</ListGroup>
	);
};

export default Profile;
