import React from "react";
import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import NavBar from "./NavBar";
import Card from "react-bootstrap/Card";

const About = () => {
  return (
    <React.Fragment>
      <NavBar />

      <Jumbotron fluid>
        <Container>
          <h1 style={{ textAlign: "center" }}>About us</h1>
          <h4 style={{ textAlign: "center", marginTop: 30 }}>
            A peek about the team behind the website
          </h4>
        </Container>
      </Jumbotron>
      <div class="row offset-1">
        <div class="col-4">
          <Card style={{ width: "19rem" }}>
            <Card.Img
              variant="top"
              src="https://source.unsplash.com/collection/190727/100x180%22%3E"
            />
            <Card.Body>
              <Card.Title>Omar Sameh</Card.Title>
              <Card.Text>
                <h6>Artist</h6>
                "it’s easier to ask for forgiveness than it is to get
                permission."-Rear Admiral Grace Murray Hopper,1986<br></br>
                <strong>omar.abouhegaziah@icloud.com</strong>
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
        <div class="col-4">
          <Card style={{ width: "19rem" }}>
            <Card.Img
              variant="top"
              src="https://source.unsplash.com/collection/190727/100x180%22%3E"
            />
            <Card.Body>
              <Card.Title>Omar Baroudy</Card.Title>
              <Card.Text>
                <h6>Problem solver</h6>
                "I was born to code and to code I was born" -Omar Elbaroudy,
                2020<br></br>
                <strong>elbaroudyomar@gmail.com</strong>
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
        <div class="col-4">
          <Card style={{ width: "19rem" }}>
            <Card.Img
              variant="top"
              src="https://source.unsplash.com/collection/190727/100x180%22%3E"
            />
            <Card.Body>
              <Card.Title>Omar Hany</Card.Title>
              <Card.Text>
                <h6> Philospher</h6>
                "The only way humans have ever figured out of getting somewhere
                is to leave something behind"
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      </div>
      <div style={{ marginTop: 50 }} class="row offset-3">
        <div class="col-4">
          <Card style={{ width: "19rem" }}>
            <Card.Img
              variant="top"
              src="https://source.unsplash.com/collection/190727/100x180%22%3E"
            />
            <Card.Body>
              <Card.Title>Ahmed El-Gohary</Card.Title>
              <Card.Text>
                <h6>Team leader</h6>
                "The things you own end up owning you" - tyler durden,1999
                <br></br>
                <strong>ahmedysr@gmail.com</strong>
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
        <div class="col-4">
          <Card style={{ width: "19rem" }}>
            <Card.Img
              variant="top"
              src="https://source.unsplash.com/collection/190727/100x180%22%3E"
            />
            <Card.Body>
              <Card.Title>Ahmed Medhat</Card.Title>
              <Card.Text>
                <h6> Developer</h6>
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default About;
