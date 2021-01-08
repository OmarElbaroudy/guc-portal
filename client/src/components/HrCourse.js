import NavBar from "./NavBar";
import React, { component, useEffect, useState } from "react";
import { hrFetcher } from "../API/hrFetcher";
import { GetUser } from "./GlobalState";
import "bootstrap/dist/css/bootstrap.css";
import HrCourseTemp from "./HrCourseTemp";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";

const HrCourse = () => {
    const { user } = GetUser();
    const [ course,setCourse ]=useState([])
    const [showAdd, setShowAdd] = useState(false);
    const [name,setName]=useState(null)
    const [department,setDepartment]=useState(null)

    const handleClose1 = () => setShowAdd(false);
    const handleShow1 = () => setShowAdd(true);

    useEffect(()=>{
        const data = async () => {
            try {
              const res = await hrFetcher.viewAllCourses( user.token);
              console.log("result "+res)
              setCourse(res);
            } catch (err) {
              console.log(err);
            }
          };
          data();
        }, []);

        const deleteCourse=async (name) => {
            try{
                const res=await hrFetcher.deleteCourse(user.token,name)
                setCourse(res)
            } catch(err){
                console.log(err)
            }
        }

        const updateCourse = async(name,
          newName,
          department) => {
          try{
            console.log("dep " +department)
      
            const res = await hrFetcher.updateCourse(user.token, name,newName,department);
            setCourse(res);
          }catch(err){
            console.log(err)
          }
        }
      
        const addCourse= async()=>{
          try{
            const res=await hrFetcher.addCourse(user.token, name, department)
            setCourse(res);
          }
          catch(err){
            console.log(err)
          }
        }
    return(
    <div>
      <NavBar />
      <h1 style={{ fontWeight: 1, padding: 50 }} class="display-6">
        Courses
      </h1>
      <Button
        onClick={() => handleShow1()}
        className="col-4 offset-4"
        variant="dark"
        style={{ padding: 8 }}
      >
        Add Course
      </Button>{" "}
      <div class="col-9">
      {
          course.map((obj)=>{
              return <HrCourseTemp  key={obj.id}
              name={obj.name}
              handleDelete={deleteCourse}
              handleUpdate={updateCourse}
              />

          })
      }
      </div>
      <Modal
        show={showAdd}
        onHide={handleClose1}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Name</Form.Label>
                <Form.Control placeholder="Enter course name" onChange={(event)=>{setName(event.target.value)}} />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Department</Form.Label>
                <Form.Control placeholder="enter department name" onChange={(event)=>{setDepartment(event.target.value)}}/>
              </Form.Group>
            </Form.Row>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>handleClose1}>
            Close
          </Button>
          <Button variant="primary" onClick={()=>addCourse() }>Add</Button>
        </Modal.Footer>
      </Modal>
      
    </div>
   
  )
}

export default HrCourse;