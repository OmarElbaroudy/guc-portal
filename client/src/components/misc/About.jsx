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
					<Card style={{ width: "20rem" }}>
						<Card.Img
							variant="top"
							src="https://scontent.xx.fbcdn.net/v/t1.15752-9/s720x720/138951866_764536617484475_6974011879311629003_n.jpg?_nc_cat=106&ccb=2&_nc_sid=f79d6e&_nc_ohc=McMoDo4FS8MAX9jW8UU&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&tp=7&oh=91b4e26e94986b90788c6dfd4a80fabb&oe=6000F029"
						/>
						<Card.Body>
							<Card.Title>Omar Sameh</Card.Title>
							<Card.Text>
								<h6>
									<strong>Artist</strong>
								</h6>
								<i>
									"it’s easier to ask for forgiveness than it is to get permission."
								</i>{" "}
								-Rear Admiral Grace Murray Hopper,1986
							</Card.Text>
						</Card.Body>
						<Card.Footer className="text-center">
							omar.abouhegaziah@icloud.com
						</Card.Footer>
					</Card>
				</div>
				<div class="col-4">
					<Card style={{ width: "20rem" }}>
						<Card.Img
							variant="top"
							src="https://scontent.xx.fbcdn.net/v/t1.15752-9/138591006_793878194534283_6750957260143956199_n.jpg?_nc_cat=100&ccb=2&_nc_sid=f79d6e&_nc_ohc=1VMPWIGiZTAAX_bnvhO&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=ca77b42c5730717ca20eb572847743e7&oe=6000B8A0"
						/>
						<Card.Body>
							<Card.Title>Omar Elbaroudy</Card.Title>
							<Card.Text>
								<h6>
									<strong>Problem Solver</strong>
								</h6>
								<i>
									"Man is not made for defeat. A man can be destroyed but not defeated."
								</i>{" "}
								-Ernest Hemingway,1952
							</Card.Text>
						</Card.Body>
						<Card.Footer className="text-center">elbaroudyomar@gmail.com</Card.Footer>
					</Card>
				</div>
				<div class="col-4">
					<Card style={{ width: "20rem" }}>
						<Card.Img
							variant="top"
							src="https://scontent.xx.fbcdn.net/v/t1.15752-9/s720x720/138833035_1394775897531883_3066412916662182419_n.jpg?_nc_cat=107&ccb=2&_nc_sid=f79d6e&_nc_ohc=qaq0EgwO4yMAX8S0YWp&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&tp=7&oh=61120c625ff44a3152240477cf683a80&oe=6000D0B1"
						/>
						<Card.Body>
							<Card.Title>Omar Hany</Card.Title>
							<Card.Text>
								<h6>
									<strong>Philosopher</strong>
								</h6>
								<i>
									"The only way humans have ever figured out of getting somewhere is to
									leave something behind"
								</i>{" "}
								-Nolan,2014
							</Card.Text>
						</Card.Body>
						<Card.Footer className="text-center">omar3hany@gmail.com</Card.Footer>
					</Card>
				</div>
			</div>
			<div style={{ marginTop: 50 }} class="row offset-3">
				<div class="col-4">
					<Card style={{ width: "20rem" }}>
						<Card.Img
							variant="top"
							src="https://scontent.xx.fbcdn.net/v/t1.15752-9/s720x720/138619068_1053862135119224_6131964751020921059_n.jpg?_nc_cat=102&ccb=2&_nc_sid=f79d6e&_nc_ohc=y_A5UEACZgcAX-K8OWJ&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&tp=7&oh=e70db1ee9f60ebc35c2811fb3f4c0e05&oe=6000EDD4"
						/>
						<Card.Body>
							<Card.Title>Ahmed El-Gohary</Card.Title>
							<Card.Text>
								<h6>
									<strong>Team Leader</strong>
								</h6>
								<i>"The things you own end up owning you"</i> -Tyler Durden,1999
							</Card.Text>
						</Card.Body>
						<Card.Footer className="text-center">ahmedysr@gmail.com</Card.Footer>
					</Card>
				</div>
				<div class="col-4">
					<Card style={{ width: "20rem" }}>
						<Card.Img
							variant="top"
							src="https://scontent.xx.fbcdn.net/v/t1.15752-9/s720x720/138782183_426203795394788_4183793643832427885_n.jpg?_nc_cat=107&ccb=2&_nc_sid=f79d6e&_nc_ohc=-6Ec545DJ3kAX9lY5r1&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&tp=7&oh=68f0aec0917b1f16fd250c0eeeed772e&oe=6000BADB"
						/>
						<Card.Body>
							<Card.Title>Ahmed Medhat</Card.Title>
							<Card.Text>
								<h6>
									<strong>Developer</strong>
								</h6>
								<i>"A man is what he thinks about all day long"</i> -Ralph Emerson,1840
							</Card.Text>
						</Card.Body>
						<Card.Footer className="text-center">
							ahmed.sadekibrahim@gmail.com
						</Card.Footer>
					</Card>
				</div>
			</div>
		</React.Fragment>
	);
};

export default About;
