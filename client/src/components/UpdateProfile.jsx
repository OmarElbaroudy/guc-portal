import React, { useState } from "react";
import { GetUser } from "./GlobalState";
import { staffFetcher } from "../API/staffFetcher";
import { Col, Form, Row } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";

const UpdateProfile = (props) => {
  const { user } = GetUser();
  const [gender, setGender] = useState("undefined");
  const [personalInfo, setPersonalInfo] = useState("undefined");
  const [spinner, setSpinner] = useState(false);

  const handleSubmission = async () => {
    try {
      setSpinner(true);
      const message = await staffFetcher.updateProfile(
        gender,
        personalInfo,
        user.token
      );
      setSpinner(false);
      props.handleClose();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Form.Group as={Row}>
        <Form.Label column="md" md="4">
          <span>
            <strong>change gender:</strong>
          </span>
        </Form.Label>
        <Col xs="auto" className="my-1">
          <Form.Control
            as="select"
            className="mr-sm-2"
            id="requestType"
            custom
            onChange={(event) => {
              setGender(event.target.value);
            }}
          >
            <option value="undefined">choose...</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </Form.Control>
        </Col>
      </Form.Group>
      <Form.Group as={Row}>
        <Form.Label column="md" md={4}>
          <strong>personalInfo:</strong>
        </Form.Label>
        <Form.Control
          as="textarea"
          className="col-7"
          rows="5"
          type="textarea"
          placeholder="optional"
          onChange={(event) => {
            setPersonalInfo(event.target.value);
          }}
        />
      </Form.Group>
      <Button className="col-3" variant="primary" onClick={handleSubmission}>
        {spinner ? (
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />
        ) : null}
        Submit
      </Button>
    </>
  );
};

export default UpdateProfile;
