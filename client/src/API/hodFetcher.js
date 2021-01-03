export class hodFetcher {
	static async view(course, token) {
		try {
			const res = await fetch("http://localhost:3000/HOD/view_staff", {
				method: "POST",
				body: JSON.stringify({}),
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
