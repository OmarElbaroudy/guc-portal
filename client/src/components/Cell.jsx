import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Jumbotron from "react-bootstrap/Jumbotron";
import getterFetcher from "../API/getterFetcher";

const Cell = (props) => {
	const session = props.session;
	const [courseName, setCourseName] = useState("");
	const [locationName, setLocationName] = useState("");
	const [type, setType] = useState("");
	const [updated, setUpdated] = useState(false);

	if (session && session.courseId) {
		const name = getterFetcher.getCourseNameById(session.courseId);
		setCourseName(name);
		setUpdated(true);
	}

	if (session && session.locationId) {
		const name = getterFetcher.getLocationNameById(session.locationId);
		setLocationName(name);
		setUpdated(true);
	}

	if (session && session.type) {
		setType(session.type);
		setUpdated(true);
	}

	return updated ? (
		<Jumbotron fluid>
			<td>
				<h1>{courseName}</h1>
				<h2>{locationName}</h2>
				<h4>{type}</h4>
			</td>
		</Jumbotron>
	) : null;
};

export default Cell;
