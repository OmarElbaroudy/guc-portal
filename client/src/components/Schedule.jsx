import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Table from "react-bootstrap/Table";
import Cell from "./Cell";

const Schedule = (props) => {
	const arr = Array(40).fill(undefined);
	for (let i = 0; i < props.length; i++) {
		const idx = props[i].weekDay * 7 + props[i].slot;
		arr[idx] = props[i];
	}

	return (
		<Table bordered hover>
			<thead>
				<tr>
					<th>#</th>
					<th>Sunday</th>
					<th>Monday</th>
					<th>Tuesday</th>
					<th>Wednesday</th>
					<th>Thursday</th>
					<th>Saturday</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>1</td>
					<Cell session={arr[0]}></Cell>
					<Cell session={arr[1]}></Cell>
					<Cell session={arr[2]}></Cell>
					<Cell session={arr[3]}></Cell>
					<Cell session={arr[4]}></Cell>
					<Cell session={arr[6]}></Cell>
				</tr>
				<tr>
					<td>2</td>
					<Cell session={arr[7]}></Cell>
					<Cell session={arr[8]}></Cell>
					<Cell session={arr[9]}></Cell>
					<Cell session={arr[10]}></Cell>
					<Cell session={arr[11]}></Cell>
					<Cell session={arr[13]}></Cell>
				</tr>
				<tr>
					<td>3</td>
					<Cell session={arr[14]}></Cell>
					<Cell session={arr[15]}></Cell>
					<Cell session={arr[16]}></Cell>
					<Cell session={arr[17]}></Cell>
					<Cell session={arr[18]}></Cell>
					<Cell session={arr[20]}></Cell>
				</tr>
				<tr>
					<td>4</td>
					<Cell session={arr[21]}></Cell>
					<Cell session={arr[22]}></Cell>
					<Cell session={arr[23]}></Cell>
					<Cell session={arr[24]}></Cell>
					<Cell session={arr[25]}></Cell>
					<Cell session={arr[27]}></Cell>
				</tr>
				<tr>
					<td>5</td>
					<Cell session={arr[28]}></Cell>
					<Cell session={arr[29]}></Cell>
					<Cell session={arr[30]}></Cell>
					<Cell session={arr[31]}></Cell>
					<Cell session={arr[32]}></Cell>
					<Cell session={arr[34]}></Cell>
				</tr>
			</tbody>
		</Table>
	);
};

export default Schedule;
