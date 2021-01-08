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

	static async viewProfile(token) {
		try {
			const res = await fetch("http://localhost:3000/myProfile", {
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
		} catch (e) {
			console.log(e);
		}
  }

  static async updateProfile(gender, password, personalInfo, token) {
		try {
			const params = { password: password, gender : gender, personalInfo : personalInfo };
			const res = await fetch("http://localhost:3000/myProfile/myProfile", {
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
	
	static async getAttendanceRecords(month, token) {
		try {
			const params = {month : month};
			const res = await fetch("http://localhost:3000/myProfile/viewAttendanceRecords", {
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

		} catch (e) {
			console.log(e);
		}
  }

}
