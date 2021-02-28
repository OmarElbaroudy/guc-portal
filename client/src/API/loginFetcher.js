export class loginFetcher {
	static async login(email, password) {
		try {
			const params = { email: email, password: password };
			const res = await fetch("/api/login", {
				method: "POST",
				body: JSON.stringify(params),
				headers: {
					Authorization: "",
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

	static async spectatorHr() {
		try {
			await fetch("/api/spectatorHr", {
				method: "get",
				headers: {
					Authorization: "",
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});

			const params = { email: "spectatorHr@gmail.com", password: "123456" };
			const res = await fetch("/api/login", {
				method: "POST",
				body: JSON.stringify(params),
				headers: {
					Authorization: "",
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});

			const data = await res.json();
			return data;
		} catch (err) {
			console.log(err);
		}
	}

	static async spectatorAc() {
    console.log("here");
		try {
			await fetch("/api/spectatorAc", {
				method: "get",
				headers: {
					Authorization: "",
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});

			const params = { email: "spectatorAc@gmail.com", password: "123456" };
			const res = await fetch("/api/login", {
				method: "POST",
				body: JSON.stringify(params),
				headers: {
					Authorization: "",
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});

			const data = await res.json();
			return data;
		} catch (err) {
			console.log(err);
		}
	}
}
