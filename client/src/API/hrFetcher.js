export class hrFetcher {
    static async viewAllStaffMembers(token) {
        try {
            console.log(token)
          const res = await fetch(
            "http://localhost:3000/hr/viewAllStaffMembers",
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
        }
         catch (error) {
          console.log(error);
        }
      }

      static async deleteStaffMember(token,id) {
        try {
            console.log(token)
            const params={id: id}
          const res = await fetch(
            "http://localhost:3000/hr/deleteStaffMember",
            {
              method: "PUT",
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
        }
         catch (error) {
          console.log(error);
        }
      }
  }