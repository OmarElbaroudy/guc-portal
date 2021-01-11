import React, { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import "bootstrap/dist/css/bootstrap.min.css";
import { hrFetcher } from "../../API/hrFetcher";
import Card from "react-bootstrap/Card";
import { GetUser } from "../common/GlobalState";
import Profile from "../common/Profile";
import NavBar from "../misc/NavBar";

const MissingHours = () => {
  const { user } = GetUser();
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const data = async () => {
      const ret = await hrFetcher.viewMissingHours(user.token);
      setProfiles(ret);
    };
    data();
  }, [profiles, user.token]);

  return (
    <div>
      <NavBar sticky="top" />
      <h1 style={{ fontWeight: 1, padding: 50 }} class="display-6">
        Staff Members With Missing Hours
      </h1>
      {profiles.map((profile) => {
        return (
          <div style={{ marginTop: 15 }} className="container row offset-1">
            <div className="col-xl-12">
              <Accordion defaultActiveKey="1">
                <Card>
                  <Accordion.Toggle as={Card.Header} eventKey="0">
                    <span style={{ fontWeight: "bold" }}>
                      {profile.name}({profile.id})
                    </span>
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      <Profile
                        name={profile.name}
                        email={profile.email}
                        salary={profile.salary}
                        id={profile.id}
                        accidentalLeaveBalance={
                          profile.accidentalLeaveBalance.balance
                        }
                        annualLeaveBalance={profile.annualLeaveBalance.balance}
                        gender={profile.gender}
                        personalInfo={profile.personalInfo}
                        department={profile.departmentId}
                        location={profile.officeLocationId}
                        faculty={profile.facultyId}
                        dayOff={profile.dayOff}
                      ></Profile>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MissingHours;
