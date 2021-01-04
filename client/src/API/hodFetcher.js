export class hodFetcher {
  static async view(course, token) {
    try {
      const res = await fetch("http://localhost:3000/HOD/view_staff", {
        method: "POST",
        body: JSON.stringify({}),
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
}
