import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../views/Cell.css";

const Cell = (props) => {
	return props.session && props.session.course ? (
		<td className="cont">
			<h5 className="primary">{props.session.course}</h5>
			<h5 className="primary">{props.session.location}</h5>
			<h6 className="secondary">{props.session.type}</h6>
		</td>
	) : (
		<td></td>
	);
};

export default Cell;
