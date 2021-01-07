export class staffFetcher {
  static async resetPassword(password, token) {
    try {
      const params = { newPassword: password };
      const res = await fetch("http://localhost:3000/myProfile/resetPassword", {
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
