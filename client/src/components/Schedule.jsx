import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Table from "react-bootstrap/Table";
import Cell from "./Cell";


const Schedule = (props) => {
	const arr = Array(40).fill(undefined);
	
	return (
		<Table bordered hover >
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
					<Cell></Cell>
					<Cell></Cell>
					<Cell></Cell>
					<Cell></Cell>
					<Cell></Cell>
					<Cell></Cell>
				</tr>
				<tr>
					<td>2</td>
					<Cell></Cell>
					<Cell></Cell>
					<Cell></Cell>
					<Cell></Cell>
					<Cell></Cell>
					<Cell></Cell>
				</tr>
				<tr>
					<td>3</td>
					<Cell></Cell>
					<Cell></Cell>
					<Cell></Cell>
					<Cell></Cell>
					<Cell></Cell>
					<Cell></Cell>
				</tr>
				<tr>
					<td>4</td>
					<Cell></Cell>
					<Cell></Cell>
					<Cell></Cell>
					<Cell></Cell>
					<Cell></Cell>
					<Cell></Cell>
				</tr>
				<tr>
					<td>5</td>
					<Cell></Cell>
					<Cell></Cell>
					<Cell></Cell>
					<Cell></Cell>
					<Cell></Cell>
					<Cell></Cell>
				</tr>
			</tbody>
		</Table>
	);
};

export default Schedule;
