import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Jumbotron from "react-bootstrap/Jumbotron";
import getterFetcher from "../API/getterFetcher";

const Cell = (props) => {
	const [courseName, setCourseName] = useState("");
	const [locationName, setLocationName] = useState("");
	const [type, setType] = useState("");
	const [updated, setUpdated] = useState(false);

	if (props && props.courseId) {
		const name = getterFetcher.getCourseNameById(props.courseId);
		setCourseName(name);
		setUpdated(true);
	}

	if (props && props.locationId) {
		const name = getterFetcher.getLocationNameById(props.locationId);
		setLocationName(name);
		setUpdated(true);
	}

	if (props && props.type) {
		setType(props.type);
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
