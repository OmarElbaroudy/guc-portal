import HodHome from "./components/home/HodHome";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { UserProvider } from "./components/common/GlobalState";
import Login from "./components/misc/Login";
import StaffHome from "./components/home/StaffHome";
import HrHome from "./components/home/HrHome";
import AcademicHome from "./components/home/AcademicHome";
import ViewRequest from "./components/hod/ViewRequests";
import ViewStaff from "./components/hod/ViewStaff";
import HrStaffMember from "./components/hr/HrStaffMember";
import HrLocation from "./components/hr/HrLocation";
import HrDepartment from "./components/hr/HrDepartment";
import HrFaculty from "./components/hr/HrFaculty";
import HrCourse from "./components/hr/HrCourse";
import MissingDays from "./components/staff/MissingDays";
import MissingHours from "./components/staff/MissingHours";
import CoordinatorHome from "./components/home/CoordinatorHome";
import ViewReplacementRequests from "./components/academic/ViewReplacementRequests";
import ViewSubmittedRequests from "./components/academic/ViewSubmittedRequests";
import CourseCoverage from "./components/common/CourseCoverage";
import CoordinatorReq from "./components/coordinator/CoordinatorReq";
import InstructorHome from "./components/home/InstHome";
import InstructorStaff from "./components/instructor/InstStaffMem";
import InstructorCourses from "./components/instructor/InstCourseCoverage";
import About from "./components/misc/About";
import FAQ from "./components/misc/FAQ";
import React from "react";
import "./views/App.css";

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
					<Route exact path="/about" component={About} />
					<Route exact path="/faq" component={FAQ} />
				</Switch>
			</Router>
		</UserProvider>
	);
}

export default App;
