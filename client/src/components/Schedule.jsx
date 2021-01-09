import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Table from "react-bootstrap/Table";
import Cell from "./Cell";

const Schedule = (props) => {
	const [arr, setArr] = useState([]);
	useEffect(() => {
		const scheduler = (sessions) => {
			let arr = Array(40).fill(undefined);
			for (let i = 0; i < sessions.length; i++) {
				const idx = sessions[i].weekDay * 5 + sessions[i].slot;
				arr[idx].push(sessions[i]);
			}
			return arr;
		};
		setArr(scheduler(props.sessions));
	}, [props.sessions]);

	return (
		<Table bordered>
			<thead>
				<tr>
					<th>#</th>
					<th>1</th>
					<th>2</th>
					<th>3</th>
					<th>4</th>
					<th>5</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>Sunday</td>
					<Cell session={arr[1]}></Cell>
					<Cell session={arr[2]}></Cell>
					<Cell session={arr[3]}></Cell>
					<Cell session={arr[4]}></Cell>
					<Cell session={arr[5]}></Cell>
				</tr>
				<tr>
					<td>Monday</td>
					<Cell session={arr[6]}></Cell>
					<Cell session={arr[7]}></Cell>
					<Cell session={arr[8]}></Cell>
					<Cell session={arr[9]}></Cell>
					<Cell session={arr[10]}></Cell>
				</tr>
				<tr>
					<td>Tuesday</td>
					<Cell session={arr[11]}></Cell>
					<Cell session={arr[12]}></Cell>
					<Cell session={arr[13]}></Cell>
					<Cell session={arr[14]}></Cell>
					<Cell session={arr[15]}></Cell>
				</tr>
				<tr>
					<td>Wednesday</td>
					<Cell session={arr[16]}></Cell>
					<Cell session={arr[17]}></Cell>
					<Cell session={arr[18]}></Cell>
					<Cell session={arr[19]}></Cell>
					<Cell session={arr[20]}></Cell>
				</tr>
				<tr>
					<td>Thursday</td>
					<Cell session={arr[21]}></Cell>
					<Cell session={arr[22]}></Cell>
					<Cell session={arr[23]}></Cell>
					<Cell session={arr[24]}></Cell>
					<Cell session={arr[25]}></Cell>
				</tr>
				<tr>
					<td>Saturday</td>
					<Cell session={arr[31]}></Cell>
					<Cell session={arr[32]}></Cell>
					<Cell session={arr[33]}></Cell>
					<Cell session={arr[34]}></Cell>
					<Cell session={arr[35]}></Cell>
				</tr>
			</tbody>
		</Table>
	);
};

export default Schedule;
