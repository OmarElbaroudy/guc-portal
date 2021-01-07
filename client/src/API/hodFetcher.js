export class hodFetcher {
  static async view(course, token) {
    try {
      const params = { courseName: course };
      const res = await fetch("http://localhost:3000/HOD/view_staff", {
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

  static async addCourse(course, staff, token, type) {
    try {
      console.log("staff " + staff);
      const params = { courseName: course, id: staff, type: type };
      const res = await fetch(
        "http://localhost:3000/HOD/assign_course_instructor",
        {
          method: "put",
          body: JSON.stringify(params),
          headers: {
            Authorization: "",
            "auth-token": token,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  static async deleteCourse(course, staff, token) {
    try {
      console.log("staff " + staff);
      const params = { courseName: course, id: staff };
      const res = await fetch(
        "http://localhost:3000/HOD/delete_course_instructor",
        {
          method: "put",
          body: JSON.stringify(params),
          headers: {
            Authorization: "",
            "auth-token": token,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  static async updateCourse(course, oldStaff, newStaff, token) {
    try {
      const params = { courseName: course, orgId: oldStaff, updId: newStaff };
      const res = await fetch(
        "http://localhost:3000/HOD/update_course_instructor",
        {
          method: "put",
          body: JSON.stringify(params),
          headers: {
            Authorization: "",
            "auth-token": token,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  static async viewRequests(token) {
    try {
      const res = await fetch("http://localhost:3000/HOD/view_requests", {
        method: "get",
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

  static async acceptRequests(id, token, message) {
    try {
      const params = { _id: id, comment: message };
      const res = await fetch("http://localhost:3000/HOD/accept_requests", {
        method: "put",
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

  static async rejectRequests(id, token, message) {
    try {
      const params = { _id: id, comment: message };
      const res = await fetch("http://localhost:3000/HOD/reject_requests", {
        method: "put",
        body: JSON.stringify(params),
        headers: {
          Authorization: "",
          "auth-token": token,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const data = await res.json();
      console.log("data " + data);
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  static async viewDayOff(id, token) {
    try {
      const params = { id: id };
      const res = await fetch("http://localhost:3000/HOD/view_day_off", {
        method: "post",
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

  static async viewCourseCoverage(token) {
    try {
      const res = await fetch(
        "http://localhost:3000/HOD/view_course_coverage",
        {
          method: "get",
          headers: {
            Authorization: "",
            "auth-token": token,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }
}
