import NavBar from "../misc/NavBar";
import React, { useEffect, useState } from "react";
import { hrFetcher } from "../../API/hrFetcher";
import { GetUser } from "../common/GlobalState";
import "bootstrap/dist/css/bootstrap.css";
import HrStaffMemberTemp from "./HrStaffMemberTemp";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";

const HrStaffMember = () => {
	const { user } = GetUser();
	const [showAdd, setShowAdd] = useState(false);
	const [staff, setStaff] = useState([]);
	const [email, setEmail] = useState(null);
	const [name, setName] = useState(null);
	const [officeLocation, setOfficeLocation] = useState(null);
	const [salary, setSalary] = useState(null);
	const [personalInfo, setPersonalInfo] = useState("");
	const [gender, setGender] = useState("male");
	const [type, setType] = useState("hr");

	const [showAlert, setShowAlert] = useState(false);
	const [message, setMessage] = useState("oops something went wrong");
	const [spinner, setSpinner] = useState(false);
	const [spinner1, setSpinner1] = useState(false);
	const [spinner2, setSpinner2] = useState(false);
	const [spinner3, setSpinner3] = useState(false);

	const handleClose1 = () => setShowAdd(false);
	const handleShow1 = () => setShowAdd(true);

	useEffect(() => {
		const data = async () => {
			try {
				const res = await hrFetcher.viewAllStaffMembers(user.token);
				setStaff(res);
			} catch (err) {
				console.log(err);
			}
		};
		data();
	}, [user.token]);

	const assignDep = async (name, dep) => {
		setSpinner3(true);
		const res = await hrFetcher.assignDep(name, dep, user.token);

		if (res === "invalid academic id" || res === "invalid department name") {
			setSpinner3(false);
			setMessage(res);
			setShowAlert(true);
			return;
		}
		var newStaff = [...staff];
		var foundIndex = newStaff.findIndex((x) => x.id === res.id);
		newStaff[foundIndex] = res;
		setStaff(newStaff);
		setSpinner3(false);
	};

	const deleteStaff = async (id) => {
		setSpinner1(true);
		try {
			const res = await hrFetcher.deleteStaffMember(user.token, id);
			setStaff(res);
			setSpinner1(false);
		} catch (err) {
			console.log(err);
		}
	};
	const updateStaff = async (id, name, officeLocation, email, salary) => {
		try {
			setSpinner2(true);
			const res = await hrFetcher.updateStaffMember(
				user.token,
				id,
				name,
				email,
				officeLocation,
				salary
			);
			if (
				res === "this user does not exist" ||
				res === "this location does not exist" ||
				res === "this location is not an office" ||
				res === "this location is full" ||
        res === "not a valid number" ||
        res === "email already exists"
			) {
				setSpinner2(false);
				setMessage(res);
				setShowAlert(true);
				return;
			}
			setStaff(res);
			setSpinner2(false);
		} catch (err) {
			console.log(err);
		}
	};

	const addStaff = async () => {
		try {
			setSpinner(true);
			console.log("office" + officeLocation);
			const res = await hrFetcher.addStaffMember(
				user.token,
				name,
				email,
				officeLocation,
				salary,
				gender,
				type,
				personalInfo
			);
			if (
				res ===
					"each member should have name, salary, email, and office location" ||
				res === "not a valid number" ||
				res === "this location does not exist" ||
				res === "this location is not an office" ||
				res === "this location is full" ||
        res === "email already exists"
			) {
				setSpinner(false);
				setMessage(res);
				setShowAlert(true);
				return;
			}
			setStaff(res);
			setSpinner(false);
		} catch (err) {
			console.log(err);
		}
	};
	return (
		<div>
			<NavBar />
			<h1 style={{ fontWeight: 1, padding: 50 }} class="display-6">
				Staff Members
			</h1>
			<Button
				onClick={() => handleShow1()}
				className="col-4 offset-4"
				variant="dark"
				style={{ padding: 8 }}
			>
				Add Staff Member
			</Button>{" "}
			<div class="col-9">
				{staff.map((obj) => {
					return (
						<HrStaffMemberTemp
							key={obj.id}
							name={obj.name}
							id={obj.id}
							email={obj.email}
							salary={obj.salary}
							office={obj.officeLocationId}
							department={obj.departmentId}
							handleDelete={deleteStaff}
							handleUpdate={updateStaff}
							handleAssignDep={assignDep}
							spinner={spinner1}
							spinner2={spinner2}
							spinner3={spinner3}
							setShowAlert={setShowAlert}
							showAlert={showAlert}
							message={message}
						/>
					);
				})}
			</div>
			<Modal
				show={showAdd}
				onHide={handleClose1}
				backdrop="static"
				keyboard={false}
			>
				<Modal.Header closeButton>
					<Modal.Title>add Staff Member</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Row>
							<Form.Group as={Col} controlId="formGridEmail">
								<Form.Label>Name</Form.Label>
								<Form.Control
									placeholder="Enter name"
									onChange={(event) => {
										setName(event.target.value);
									}}
								/>
							</Form.Group>

							<Form.Group as={Col} controlId="formGridPassword">
								<Form.Label>Office Location</Form.Label>
								<Form.Control
									placeholder="ex: c7.202"
									onChange={(event) => {
										setOfficeLocation(event.target.value);
									}}
								/>
							</Form.Group>
						</Form.Row>

						<Form.Group controlId="formGridAddress1">
							<Form.Label>Email</Form.Label>
							<Form.Control
								placeholder="ex: test@guc.edu.eg"
								onChange={(event) => {
									setEmail(event.target.value);
								}}
							/>
						</Form.Group>

						<Form.Group controlId="formGridAddress2">
							<Form.Label>personal Information</Form.Label>
							<Form.Control
								placeholder="personal info"
								onChange={(event) => {
									setPersonalInfo(event.target.value);
								}}
							/>
						</Form.Group>

						<Form.Row>
							<Form.Group as={Col} controlId="formGridCity">
								<Form.Label>salary</Form.Label>
								<Form.Control
									placeholder="10000"
									onChange={(event) => {
										setSalary(event.target.value);
									}}
								/>
							</Form.Group>

							<Form.Group as={Col} controlId="formGridState">
								<Form.Label>Gender</Form.Label>
								<Form.Control
									as="select"
									defaultValue="Male"
									onChange={(event) => {
										setGender(event.target.value);
									}}
								>
									<option value="male">Male</option>
									<option value="female">Female</option>
								</Form.Control>
							</Form.Group>

							<Form.Group as={Col} controlId="formGridState">
								<Form.Label>Type</Form.Label>
								<Form.Control
									as="select"
									defaultValue="hr"
									onChange={(event) => {
										setType(event.target.value);
									}}
								>
									<option value="hr">hr</option>
									<option value="academic">academic</option>
								</Form.Control>
							</Form.Group>
						</Form.Row>
					</Form>
					<Alert
						variant="danger"
						show={showAlert}
						onClose={() => setShowAlert(false)}
						dismissible
					>
						{message}
					</Alert>
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant="secondary"
						onClick={() => {
							handleClose1();
							setShowAlert(false);
						}}
					>
						Close
					</Button>
					<Button variant="primary" onClick={() => addStaff()}>
						{spinner ? (
							<Spinner
								as="span"
								animation="border"
								size="sm"
								role="status"
								aria-hidden="true"
							/>
						) : null}
						Add
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
};

export default HrStaffMember;
