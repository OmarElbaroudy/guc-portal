import "./App.css";
import React from "react";
import HodHome from "./HodHome";
import HrHome from "./HrHome";
import { UserProvider } from "./components/GlobalState";
import Login from "./components/Login";
import ViewStaff from "./components/ViewStaff";
import ViewRequest from "./components/ViewRequests";
import CourseCoverage from "./components/CourseCoverage";
import StaffHome from "./StaffHome";
import HrStaffMember from "./components/HrStaffMember";
import HrLocation from "./components/HrLocation";
import HrDepartment from "./components/HrDepartment";
import HrFaculty from "./components/HrFaculty";
import InstructorHome from "./instHome";
import HrCourse from "./components/HrCourse";
import CoordinatorReq from "./components/coordinatorReq";
import AcademicHome from "./AcademicHome";
import CoordinatorHome from "./CoordinatorHome";
import ViewReplacementRequests from "./components/ViewReplacementRequests";
import ViewSubmittedRequests from "./components/ViewSubmittedRequests";
import InstructorCourses from "./components/instructorComponents/instCourseCoverage";
import InstructorStaff from "./components/instructorComponents/instStaffMem";
import MissingHours from "./components/MissingHours";
import MissingDays from "./components/MissingDays";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
	return (
		<UserProvider>
			<Router>
				<Switch>
					<Route exact path="/" component={Login} />
					<Route exact path="/hodHome" component={HodHome} />
					<Route exact path="/staffHome" component={StaffHome} />
					<Route exact path="/hrHome" component={HrHome} />
					<Route exact path="/academicHome" component={AcademicHome} />
					<Route exact path="/homePage/requests" component={ViewRequest} />
					<Route exact path="/homePage/staffMembers" component={ViewStaff} />
					<Route exact path="/hr/StaffMembers" component={HrStaffMember} />
					<Route exact path="/hr/Locations" component={HrLocation} />
					<Route exact path="/hr/Departments" component={HrDepartment} />
					<Route exact path="/hr/Faculties" component={HrFaculty} />
					<Route exact path="/hr/Courses" component={HrCourse} />
					<Route exact path="/hr/missingDays" component={MissingDays} />
					<Route exact path="/hr/missingHours" component={MissingHours} />
					<Route exact path="/coordinatorHome" component={CoordinatorHome} />
					<Route exact path="/coordinator/request" component={CoordinatorReq} />
					<Route
						exact
						path="/academicHome/replacementRequests"
						component={ViewReplacementRequests}
					/>
					<Route
						exact
						path="/academicHome/submittedRequests"
						component={ViewSubmittedRequests}
					/>
					<Route exact path="/homePage/coursesCoverage" component={CourseCoverage} />
					<Route exact path="/instructorHome" component={InstructorHome} />
					<Route exact path="/instructor/staffMembers" component={InstructorStaff} />
					<Route exact path="/instructor/courses" component={InstructorCourses} />
				</Switch>
			</Router>
		</UserProvider>
	);
}

export default App;
