import NavBar from "./NavBar";
import React, { component, useEffect, useState } from "react";
import { GetUser } from "./GlobalState";
import "bootstrap/dist/css/bootstrap.css";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { getterFetcher } from "../API/getterFetcher";

const HrStaffMemberTemp = (props) => {
  const { user } = GetUser();

  const [office, setOffice] = useState("");

  useEffect(() => {
    const x = async () => {
      const y=await getterFetcher.getLocationNameById(
        props.office,
        user.token
      );
      console.log(y)
      setOffice(y);
    };
    x();
  }, [props.office]);

  return (
    <div className="col-xl-10 offset-3" style={{ marginTop: 10 }}>
      <Accordion defaultActiveKey="1">
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey="0">
            <span>{props.name}</span>
            <span style={{ paddingInline: 300 }}>{props.id}</span>
            <span style={{ paddingInline: 0 }}>props.type</span>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="0">
            <Card.Body>
              <dl class="row">
                <dt class="col-sm-3">e-mail</dt>
                <dd class="col-sm-9">{props.email}</dd>

                <dt class="col-sm-3">salary</dt>
                <dd class="col-sm-9">{props.salary}</dd>

                <dt class="col-sm-3 text-truncate">Office location</dt>
                <dd class="col-sm-9">{office.name}</dd>
              </dl>
              <Button className="col col-3" variant="light">
                Add course
              </Button>
              <Button
                onClick={() => {
                  props.handleDelete(props.id);
                }}
                className="col col-3"
                variant="light"
              >
                Delete User
              </Button>
              <Button className="col col-3" variant="light">
                update course
              </Button>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </div>
  );
};
export default HrStaffMemberTemp;
