export class hrFetcher {
	//staff members
	static async viewAllStaffMembers(token) {
		try {
			console.log(token);
			const res = await fetch("http://localhost:3000/hr/viewAllStaffMembers", {
				method: "GET",
				headers: {
					Authorization: "",
					"auth-token": token,
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});
			const data = await res.json();
			return data;
		} catch (error) {
			console.log(error);
		}
	}

	static async addStaffMember(
		token,
		name,
		email,
		officeLocation,
		salary,
		gender,
		type,
		personalInfo
	) {
		try {
			console.log("omar");
			const params = {
				name: name,
				officeLocation: officeLocation,
				email: email,
				salary: salary,
				gender: gender,
				personalInfo: personalInfo,
				type: type,
			};
			const res = await fetch("http://localhost:3000/hr/registerMember", {
				method: "POST",
				body: JSON.stringify(params),
				headers: {
					Authorization: "",
					"auth-token": token,
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});
			console.log("sameh");
			const data = await res.json();
			return data;
		} catch (error) {
			console.log(error);
		}
	}

	static async updateStaffMember(
		token,
		id,
		name,
		email,
		officeLocation,
		salary
	) {
		try {
			console.log("reached fetcher " + email);
			const params = {
				id: id,
				name: name,
				officeLocation: officeLocation,
				email: email,
				salary: salary,
			};
			const res = await fetch("http://localhost:3000/hr/updateStaffMember", {
				method: "PUT",
				body: JSON.stringify(params),
				headers: {
					Authorization: "",
					"auth-token": token,
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});
			const data = await res.json();
			return data;
		} catch (error) {
			console.log(error);
		}
	}

	static async deleteStaffMember(token, id) {
		try {
			console.log(token);
			const params = { id: id };
			const res = await fetch("http://localhost:3000/hr/deleteStaffMember", {
				method: "PUT",
				body: JSON.stringify(params),
				headers: {
					Authorization: "",
					"auth-token": token,
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});
			const data = await res.json();
			return data;
		} catch (error) {
			console.log(error);
		}
	}

	//locations
	static async viewAllLocations(token) {
		try {
			console.log(token);
			const res = await fetch("http://localhost:3000/hr/viewAllLocations", {
				method: "GET",
				headers: {
					Authorization: "",
					"auth-token": token,
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});
			const data = await res.json();
			return data;
		} catch (error) {
			console.log(error);
		}
	}

	static async addLocation(token, name, maxCapacity, type) {
		try {
			console.log("fetcher " + name);
			const params = {
				name: name,
				maxCapacity: maxCapacity,
				type: type,
			};
			const res = await fetch("http://localhost:3000/hr/location", {
				method: "POST",
				body: JSON.stringify(params),
				headers: {
					Authorization: "",
					"auth-token": token,
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});
			const data = await res.json();
			return data;
		} catch (error) {
			console.log(error);
		}
	}

	static async updateLocation(token, name, newName, maxCapacity, type) {
		try {
			console.log("fetcher " + name + " " + newName);
			const params = {
				name: name,
				newName: newName,
				maxCapacity: maxCapacity,
				type: type,
			};
			const res = await fetch("http://localhost:3000/hr/location", {
				method: "PUT",
				body: JSON.stringify(params),
				headers: {
					Authorization: "",
					"auth-token": token,
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});
			const data = await res.json();
			return data;
		} catch (error) {
			console.log(error);
		}
	}

	static async deleteLocation(token, name) {
		try {
			console.log(token);
			const params = { name: name };
			const res = await fetch("http://localhost:3000/hr/deleteLocation", {
				method: "DELETE",
				body: JSON.stringify(params),
				headers: {
					Authorization: "",
					"auth-token": token,
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});
			const data = await res.json();
			return data;
		} catch (error) {
			console.log(error);
		}
	}

	//faculties
	static async viewAllFaculties(token) {
		try {
			console.log(token);
			const res = await fetch("http://localhost:3000/hr/viewAllFaculties", {
				method: "GET",
				headers: {
					Authorization: "",
					"auth-token": token,
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});
			const data = await res.json();
			return data;
		} catch (error) {
			console.log(error);
		}
	}

	static async addFaculty(token, name) {
		try {
			console.log("fetcher " + name);
			const params = {
				name: name,
			};
			const res = await fetch("http://localhost:3000/hr/addFaculty", {
				method: "POST",
				body: JSON.stringify(params),
				headers: {
					Authorization: "",
					"auth-token": token,
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});
			const data = await res.json();
			return data;
		} catch (error) {
			console.log(error);
		}
	}

	static async updateFaculty(token, name, newName) {
		try {
			console.log("fetcher " + name + " " + newName);
			const params = {
				name: name,
				newName: newName,
			};
			const res = await fetch("http://localhost:3000/hr/updateFaculty", {
				method: "PUT",
				body: JSON.stringify(params),
				headers: {
					Authorization: "",
					"auth-token": token,
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});
			const data = await res.json();
			return data;
		} catch (error) {
			console.log(error);
		}
	}

	static async deleteFaculty(token, name) {
		try {
			console.log(token);
			const params = { name: name };
			const res = await fetch("http://localhost:3000/hr/deleteFaculty", {
				method: "DELETE",
				body: JSON.stringify(params),
				headers: {
					Authorization: "",
					"auth-token": token,
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});
			const data = await res.json();
			return data;
		} catch (error) {
			console.log(error);
		}
	}

	//departments
	static async viewAllDepartments(token) {
		try {
			console.log(token);
			const res = await fetch("http://localhost:3000/hr/viewAllDepartments", {
				method: "GET",
				headers: {
					Authorization: "",
					"auth-token": token,
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});
			const data = await res.json();
			return data;
		} catch (error) {
			console.log(error);
		}
	}

	static async addDepartment(token, name, faculty) {
		try {
			console.log("fetcher " + name + " " + faculty);
			const params = {
				name: name,
				faculty: faculty,
			};
			const res = await fetch("http://localhost:3000/hr/addDepartment", {
				method: "POST",
				body: JSON.stringify(params),
				headers: {
					Authorization: "",
					"auth-token": token,
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});
			const data = await res.json();
			return data;
		} catch (error) {
			console.log(error);
		}
	}

	static async updateDepartment(token, name, newName, newFaculty) {
		try {
			console.log("fetcher " + name + " " + newName + " " + newFaculty);
			const params = {
				name: name,
				newName: newName,
				newFaculty: newFaculty,
			};
			const res = await fetch("http://localhost:3000/hr/updateDepartment", {
				method: "PUT",
				body: JSON.stringify(params),
				headers: {
					Authorization: "",
					"auth-token": token,
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});
			const data = await res.json();
			return data;
		} catch (error) {
			console.log(error);
		}
	}

	static async deleteDepartment(token, name) {
		try {
			console.log(token);
			const params = { name: name };
			const res = await fetch("http://localhost:3000/hr/deleteDepartment", {
				method: "DELETE",
				body: JSON.stringify(params),
				headers: {
					Authorization: "",
					"auth-token": token,
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});
			const data = await res.json();
			return data;
		} catch (error) {
			console.log(error);
		}
	}

	//courses
	static async viewAllCourses(token) {
		try {
			console.log(token);
			const res = await fetch("http://localhost:3000/hr/viewAllCourses", {
				method: "GET",
				headers: {
					Authorization: "",
					"auth-token": token,
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});
			const data = await res.json();
			return data;
		} catch (error) {
			console.log(error);
		}
	}
	static async addCourse(token, name, department) {
		try {
			const params = {
				name: name,
				department: department,
			};
			const res = await fetch("http://localhost:3000/hr/addCourse", {
				method: "POST",
				body: JSON.stringify(params),
				headers: {
					Authorization: "",
					"auth-token": token,
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});
			const data = await res.json();
			return data;
		} catch (error) {
			console.log(error);
		}
	}

	static async updateCourse(token, name, newName, department) {
		try {
			console.log(department);
			const params = {
				name: name,
				newName: newName,
				department: department,
			};
			const res = await fetch("http://localhost:3000/hr/updateCourse", {
				method: "PUT",
				body: JSON.stringify(params),
				headers: {
					Authorization: "",
					"auth-token": token,
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});
			const data = await res.json();
			return data;
		} catch (error) {
			console.log(error);
		}
	}

	static async deleteCourse(token, name) {
		try {
			const params = { name: name };
			const res = await fetch("http://localhost:3000/hr/deleteCourse", {
				method: "DELETE",
				body: JSON.stringify(params),
				headers: {
					Authorization: "",
					"auth-token": token,
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});
			const data = await res.json();
			return data;
		} catch (error) {
			console.log(error);
		}
	}

	static async signInOut(id, signIn, signOut, token) {
		try {
			const params = { signIn: signIn, signOut: signOut, id: id };
			const res = await fetch("http://localhost:3000/hr/addSignInOut", {
				method: "POST",
				body: JSON.stringify(params),
				headers: {
					Authorization: "",
					"auth-token": token,
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});

			const data = await res.json();
			return data;
		} catch (error) {
			console.log(error);
		}
	}

	static async viewMissingHours(token) {
		try {
			const res = await fetch("http://localhost:3000/hr/viewMissingHoursMembers", {
				method: "GET",
				headers: {
					Authorization: "",
					"auth-token": token,
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});
			const data = await res.json();
			return data;
		} catch (error) {
			console.log(error);
		}
	}

	static async viewMissingDays(token) {
		try {
			const res = await fetch("http://localhost:3000/hr/viewMissingDaysMembers", {
				method: "GET",
				headers: {
					Authorization: "",
					"auth-token": token,
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});
			const data = await res.json();
			return data;
		} catch (error) {
			console.log(error);
		}
	}

	static async viewAttendanceRecords(id, token) {
		try {
			const params = { id: id };
			const res = await fetch("http://localhost:3000/hr/viewAttendanceRecords", {
				method: "POST",
				body: JSON.stringify(params),
				headers: {
					Authorization: "",
					"auth-token": token,
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});

			const data = await res.json();
			return data;
		} catch (error) {
			console.log(error);
		}
	}
}
