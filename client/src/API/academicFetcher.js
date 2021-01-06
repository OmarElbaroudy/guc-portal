export class academicFetcher {
	static async viewSchedule(token) {
		const res = await fetch("http://localhost:3000/ac/viewSchedule", {
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
	}
}
