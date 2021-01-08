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
      console.log("omar")
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
      console.log("sameh")
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
      const params = {
        id:id,
        name: name,
        officeLocation: officeLocation,
        email: email,
        salary: salary
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

  static async deleteCourse(token, name) {
    try {
      console.log(token);
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
}
