import NavBar from "./NavBar";
import React, { component, useEffect, useState } from "react";
import { hrFetcher } from "../API/hrFetcher";
import { GetUser } from "./GlobalState";
import "bootstrap/dist/css/bootstrap.css";
import HrStaffMemberTemp from "./HrStaffMemberTemp";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
//import hr from "../../../server/models/hr";

const HrStaffMember = () => {
  const { user } = GetUser();
  const [showAdd, setShowAdd] = useState(false);
  const [staff, setStaff] = useState([]);
  const [email,setEmail]=useState(null)
  const [name,setName]=useState(null)
  const [officeLocation,setOfficeLocation]=useState(null)
  const [salary,setSalary]=useState(null)
  const [personalInfo,setPersonalInfo]=useState("")
  const [gender,setGender]=useState("male")
  const [type,setType]=useState("hr")

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
  }, []);

  const deleteStaff = async (id) => {
    try {
      const res = await hrFetcher.deleteStaffMember(user.token, id);
      setStaff(res);
    } catch (err) {
      console.log(err);
    }
  };

  const addStaff= async()=>{
    try{
      const res=await hrFetcher.addStaffMember(user.token, name, email, officeLocation, salary, gender, type, personalInfo)
      setStaff(res);
    }
    catch(err){
      console.log(err)
    }
  }
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
              handleDelete={deleteStaff}
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
                <Form.Control placeholder="Enter name" onChange={(event)=>{setName(event.target.value)}} />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Office Location</Form.Label>
                <Form.Control placeholder="ex: c7.202" onChange={(event)=>{setOfficeLocation(event.target.value)}}/>
              </Form.Group>
            </Form.Row>

            <Form.Group controlId="formGridAddress1">
              <Form.Label>Email</Form.Label>
              <Form.Control placeholder="ex: test@guc.edu.eg" onChange={(event)=>{setEmail(event.target.value)}}/>
            </Form.Group>

            <Form.Group controlId="formGridAddress2">
              <Form.Label>personal Information</Form.Label>
              <Form.Control placeholder="personal info" onChange={(event)=>{setPersonalInfo(event.target.value)}}/>
            </Form.Group>

            <Form.Row>
              <Form.Group as={Col} controlId="formGridCity">
                <Form.Label>salary</Form.Label>
                <Form.Control placeholder="10000" onChange={(event)=>{setSalary(event.target.value)}}/>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>Gender</Form.Label>
                <Form.Control as="select" defaultValue="Male" onChange={(event)=>{setGender(event.target.value)}}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </Form.Control>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>Type</Form.Label>
                <Form.Control as="select" defaultValue="hr" onChange={(event)=>{setType(event.target.value)}}>
                  <option value="hr">hr</option>
                  <option value="academic">academic</option>
                </Form.Control>
              </Form.Group>
            </Form.Row>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>handleClose1}>
            Close
          </Button>
          <Button variant="primary" onClick={()=>addStaff()}>Add</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default HrStaffMember;
