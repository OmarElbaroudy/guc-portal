const port = process.env.PORT || 8000;
export class instructorFetcher {
  static async viewCourseCoverage(token) {
    try {
      const res = await fetch(
        "http://localhost:"+ port +"/instructor/viewCoursesCoverage",
        {
          method: "GET",
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

  static async viewCourseAss(token) {
    try {
      const res = await fetch(
        "http://localhost:"+ port +"/instructor/viewAssignedSlots",
        {
          method: "GET",
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

  static async viewStaff(type, token) {
    try {
      const params = { input: type };
      const res = await fetch(
        "http://localhost:"+ port +"/instructor/viewCourseOrDepartmentStaff",
        {
          method: "post",
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

  static async assignSlot(
    course,
    academic,
    location,
    weekDay,
    slot,
    type,
    token
  ) {
    try {
      const params = {
        course: course,
        academic: academic,
        location: location,
        weekDay: weekDay,
        slot: slot,
        type: type,
      };
      const res = await fetch(
        "http://localhost:"+ port +"/instructor/assignSlotToAcademic",
        {
          method: "post",
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

  static async deleteSlot(
    course,
    academic,
    location,
    weekDay,
    slot,
    type,
    token
  ) {
    try {
      const params = {
        course: course,
        academic: academic,
        location: location,
        weekDay: weekDay,
        slot: slot,
        type: type,
      };
      const res = await fetch(
        "http://localhost:"+ port +"/instructor/deleteSlotAssignment",
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

  static async updateSlot(
    academicNew,
    course,
    academicOld,
    location,
    weekDay,
    slot,
    type,
    token
  ) {
    try {
      const params = {
        course: course,
        academic: academicOld,
        academic2: academicNew,
        location: location,
        weekDay: weekDay,
        slot: slot,
        type: type,
      };
      const res = await fetch(
        "http://localhost:"+ port +"/instructor/updateSlotAssignment",
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

  static async deleteAcademic(academic, course, token) {
    try {
      const params = {
        course: course,
        academic: academic,
      };
      const res = await fetch(
        "http://localhost:"+ port +"/instructor/deleteAcademic",
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

  static async setCoordinator(academic, course, token) {
    try {
      const params = {
        course: course,
        id: academic,
      };
      const res = await fetch(
        "http://localhost:"+ port +"/instructor/assignCourseCoordinator",
        {
          method: "post",
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
