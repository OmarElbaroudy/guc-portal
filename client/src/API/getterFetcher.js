export class getterFetcher {
	static async getCourseNameById(id, token) {
		const params = { id: id };
		const res = await fetch("http://localhost:3000/getCourseNameById", {
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
	}

	static async getStaffById(id, token) {
		const params = { id: id };
		const res = await fetch("http://localhost:3000/getStaffNameById", {
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
	}

	static async getCourseIdByName(name, token) {
		const params = { name: name };
		const res = await fetch("http://localhost:3000/getCourseIdByName", {
			method: "POST",
			body: JSON.stringify(params),
			headers: {
				"auth-token": token,
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		});

		const data = await res.json();
		return data;
	}

	static async getDepNameById(id, token) {
		const params = { id: id };
		const res = await fetch("http://localhost:3000/getDepNameById", {
			method: "POST",
			body: JSON.stringify(params),
			headers: {
				"auth-token": token,
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		});

		const data = await res.json();
		return data;
	}

	static async getDepIdByName(name, token) {
		const params = { name: name };
		const res = await fetch("http://localhost:3000/getDepIdByName", {
			method: "POST",
			body: JSON.stringify(params),
			headers: {
				"auth-token": token,
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		});

		const data = await res.json();
		return data;
	}

	static async getLocationNameById(id, token) {
		console.log("getterfetcher");
		const params = { id: id };
		const res = await fetch("http://localhost:3000/getLocationNameById", {
			method: "POST",
			body: JSON.stringify(params),
			headers: {
				"auth-token": token,
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		});
		const data = await res.json();
		return data;
	}

	static async getLocationIdByName(name, token) {
		const params = { name: name };
		const res = await fetch("http://localhost:3000/getLocationIdByName", {
			method: "POST",
			body: JSON.stringify(params),
			headers: {
				"auth-token": token,
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		});

		const data = await res.json();
		return data;
	}

	static async getId(id, token) {
		const params = { id: id };
		const res = await fetch("http://localhost:3000/getId", {
			method: "POST",
			body: JSON.stringify(params),
			headers: {
				"auth-token": token,
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		});

		const data = await res.json();
		return data;
	}

	static async getCoursesInDep(id, token) {
		const params = { id: id };
		const res = await fetch("http://localhost:3000/getCoursesInDep", {
			method: "POST",
			body: JSON.stringify(params),
			headers: {
				"auth-token": token,
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		});

		const data = await res.json();
		return data;
	}

	static async isHod(departmentId, userId, token) {
		try {
			const params = { depId: departmentId, userId: userId };
			const res = await fetch("http://localhost:3000/isHod", {
				method: "POST",
				body: JSON.stringify(params),
				headers: {
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
