const port = process.env.PORT || 8000;
export class logoutFetcher {
  static async logout(token) {
    try {
      const res = await fetch("http://localhost:"+ port +"/logout", {
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
