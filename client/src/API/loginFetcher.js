export class loginFetcher {
	
	static async login(email, password) {
		try {
			const params = { email: email, password: password };
			const res = await fetch("http://localhost:3000/login", {
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
}