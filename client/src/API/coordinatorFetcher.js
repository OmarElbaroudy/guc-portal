export class coordinatorFetcher {
  static async addSlot(location, weekDay, slot, type, token) {
    try {
      const params = {
        location: location,
        weekDay: weekDay,
        slot: slot,
        type: type,
      };
      const res = await fetch(
        "/api/coordinator/addCourseSlot",
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

  static async deleteSlot(location, weekDay, slot, type, token) {
    try {
      const params = {
        location: location,
        weekDay: weekDay,
        slot: slot,
        type: type,
      };
      const res = await fetch("/api/coordinator/deleteSlot", {
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

  static async updateSlot(
    location,
    weekDay,
    slot,
    type,
    newLocation,
    newWeekDay,
    newSlot,
    newType,
    token
  ) {
    try {
      const params = {
        location: location,
        weekDay: weekDay,
        slot: slot,
        type: type,
        newweekDay: newWeekDay,
        newslot: newSlot,
        newtype: newType,
        newLocation: newLocation,
      };
      const res = await fetch("/api/coordinator/updateSlot", {
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

  static async viewReq(token) {
    try {
      const res = await fetch(
        "/api/coordinator/viewSlotLinking",
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

  static async acceptReq(request, comment, token) {
    try {
      const params = { reqs: request, comment: comment };
      const res = await fetch(
        "/api/coordinator/acceptSlotLinking",
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
  static async rejectReq(request, comment, token) {
    try {
      const params = { reqs: request, comment: comment };
      const res = await fetch(
        "/api/coordinator/rejectSlotLinking",
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
