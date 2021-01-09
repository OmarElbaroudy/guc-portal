import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Cell = (props) => {
	return (
		props.session && (
			<td className="cont">
				{props.session.map((e) => {
					return (
						<>
							{e.course && <h5 className="">{e.course}</h5>}
							{e.location && <h5 className="">{e.location}</h5>}
							{e.type && <h6 className="">{e.type}</h6>}
						</>
					);
				})}
			</td>
		)
	);
};

export default Cell;
