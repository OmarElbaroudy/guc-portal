export class academicFetcher {
	static async viewSchedule(token) {
		const res = await fetch("https://gucportal.herokuapp.com/ac/viewSchedule", {
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

		const res = await fetch("https://gucportal.herokuapp.com/ac/replacement", {
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
		const res = await fetch("https://gucportal.herokuapp.com/ac/replacement", {
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
			weekDay: parseInt(weekDay),
			slot: parseInt(slot),
			location: location,
		};

		const res = await fetch("https://gucportal.herokuapp.com/ac/slotLinkingRequest", {
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

		const res = await fetch("https://gucportal.herokuapp.com/ac/changeDayOff", {
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

		const res = await fetch("https://gucportal.herokuapp.com/ac/leaveRequest", {
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
		const res = await fetch("https://gucportal.herokuapp.com/ac/viewSubmittedRequests", {
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

	static async cancelRequest(type, reqId, token) {
		const params = { reqId: reqId };
		const res = await fetch("https://gucportal.herokuapp.com/ac/cancelRequest", {
			method: "POST",
			body: JSON.stringify(params),
			headers: {
				Authorization: "",
				"auth-token": token,
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		});

		const ret = await res.json();
		if (!type && ret === "done") return await this.viewReplacement(token);
		if (type && ret === "done") return await this.viewRequests(type, token);
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
