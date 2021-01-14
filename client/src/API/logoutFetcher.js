export class logoutFetcher {
  static async logout(token) {
    try {
      const res = await fetch("https://gucportal.herokuapp.com/logout", {
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
}
