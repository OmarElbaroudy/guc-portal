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

	static async sendReplacement(
		id,
		slot,
		weekDay,
		slotDate,
		course,
		location,
		token
	) {
		const params = {
			id: id,
			slot: slot,
			weekDay: weekDay,
			slotDate: slotDate,
			course: course,
			location: location,
		};

		const res = await fetch("http://localhost:3000/ac/replacement", {
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

	static async viewReplacement(token) {
		const res = await fetch("http://localhost:3000/ac/replacement", {
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

	static async slotLink(courseName, weekDay, slot, location, token) {
		const params = {
			courseName: courseName,
			weekDay: weekDay,
			slot: slot,
			location: location,
		};

		const res = await fetch("http://localhost:3000/ac/slotLinkingRequest", {
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

	static async changeDayOff(newDayOff, comment, token) {
		const params = {
			newDayOff: newDayOff,
			comment: comment,
		};

		const res = await fetch("http://localhost:3000/ac/changeDayOff", {
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

	static async leaveRequest(type, date, comment, token) {
		const params = {
			type: type,
			date: date,
			comment: comment,
		};

		const res = await fetch("http://localhost:3000/ac/leaveRequest", {
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

	static async viewRequests(status, token) {
		const params = { status: status };
		const res = await fetch("http://localhost:3000/ac/viewSubmittedRequests", {
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

	static async cancelRequest(reqId, token) {
		const params = { reqId: reqId };
		const res = await fetch("http://localhost:3000/ac/cancelRequest", {
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

	static async sendRequest(requestType, p, token) {
		if (requestType === "replacement") {
			return await this.sendReplacement(
				p.id,
				p.slot,
				p.weekDay,
				p.date,
				p.course,
				p.location,
				token
			);
		} else if (requestType === "slotLinking") {
			return await this.slotLink(p.course, p.weekDay, p.slot, p.location, token);
		} else if (requestType === "changeDayOff") {
			return await this.changeDayOff(p.newDayOff, p.comment, token);
		} else {
			return await this.leaveRequest(requestType, p.date, p.comment, token);
		}
	}
}
