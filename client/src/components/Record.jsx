import React from "react";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

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

const Record = (props) => {
	return (
		<Accordion>
			<Card>
				<Card.Header>
					<Accordion.Toggle as={Button} variant="link" eventKey="0">
						{props.idx + 1}
					</Accordion.Toggle>
				</Card.Header>
				<Accordion.Collapse eventKey="0">
					<Card.Body>{props.day.toString()}</Card.Body>
					<Card.Body>{getDay(props.weekDay)}</Card.Body>
					{props.compensation && (
						<Card.Body>this day is considered as compensation</Card.Body>
					)}
				</Accordion.Collapse>
			</Card>
		</Accordion>
	);
};

export default Record;
