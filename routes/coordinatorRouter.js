const express = require("express");
const academic = require("../models/academic");
const courses = require("../models/course");
const request = require("../models/requests");
const locations = require("../models/locations");
const jwt_decode = require("jwt-decode");

const fs = require("fs");
const jwt = require("jsonwebtoken");
const key = process.env.SECRET;

const router = express.Router();
let ac = "";

const loadTokens = async function () {
	try {
		let data = fs.readFileSync("blackList.json");
		let dataString = data.toString();
		return await JSON.parse(dataString);
	} catch (error) {
		return [];
	}
};

const validToken = function (arr, token) {
	return !arr.includes(token);
};

const auth = async (req, res, next) => {
  if (!req.header("auth-token")) {
    return res.status(403).send("unauthenticated access");
  }

  jwt.verify(req.header("auth-token"), key);
  if (!validToken(await loadTokens(), req.header("auth-token"))) {
    return res
      .status(450)
      .send("this token is blackListed please login again");
  }
  
  const token = req.header("auth-token");
  const decoded = jwt_decode(token);

  ac = await academic.findOne({
    _id: decoded.id,
    "courses.position": "coordinator",
  });

  if (!ac) return res.status(403).send("unauthorized access");

  next();
};



const getLocationIdByName = async (name) => {
  const ret = await locations.findOne({ name: name });
  return ret ? ret._id : undefined;
};

router.route("/api/coordinator/viewSlotLinking").get(auth, async (req, res) => {
  try {
    let requests = await request.find({
      receiverId: ac._id,
      type: "slotLinking",
    });
    if (requests.length === 0) {
      res.json("No requests found");
      return;
    }

    res.json(requests);
  } catch (err) {
    console.log(err);
  }
});

router.route("/api/coordinator/acceptSlotLinking").post(auth, async (req, res) => {
  try {
    let requests = await request.findOne({
      _id: req.body.reqs,
      status: "pending",
    });
    if (!requests) {
      res.json("This request doesn't exist or is not pending");
      return;
    }
    let sender = await academic.findOne({
      _id: requests.senderId,
    });

    let crs = await courses.findOne({
      coordinatorId: ac._id,
    });
    let location = await locations.findOne({
      _id: requests.slotLinking.locationId,
    });

    for (const entry of location.schedule) {
      if (
        entry.courseId.equals(crs._id) &&
        entry.weekDay === requests.slotLinking.weekDay &&
        entry.slot === requests.slotLinking.slot
      ) {
        entry.instructorId = sender._id;
        await location.save();
        break;
      }
    }

    for (const entry of crs.schedule) {
      if (
        entry.locationId.equals(requests.slotLinking.locationId) &&
        entry.weekDay === requests.slotLinking.weekDay &&
        entry.slot === requests.slotLinking.slot
      ) {
        entry.instructorId = sender._id;
        await crs.save();
        break;
      }
    }

    sender.schedule.push({
      courseId: requests.slotLinking.courseId,
      locationId: requests.slotLinking.locationId,
      weekDay: requests.slotLinking.weekDay,
      slot: requests.slotLinking.slot,
    });
    requests.receiverComment = req.body.comment;
    requests.status = "accepted";
    await requests.save();

    sender.notifications.push(requests._id);
    await sender.save();

    res.json(requests);
  } catch (err) {
    console.log(err);
  }
});

router.route("/api/coordinator/rejectSlotLinking").post(auth, async (req, res) => {
  try {
    let requests = await request.findOne({
      _id: req.body.reqs,
      status: "pending",
    });
    if (!requests) {
      res.json("This request doesn't exist or is not pending");
      return;
    }
    let sender = await academic.findOne({
      _id: requests.senderId,
    });
    requests.receiverComment = req.body.comment;
    requests.status = "rejected";
    await requests.save();
    sender.notifications.push(requests._id);
    await sender.save();

    res.json(requests);
  } catch (err) {
    console.log(err);
  }
});

router.route("/api/coordinator/addCourseSlot").post(auth, async (req, res) => {
  let course = await courses.findOne({
    coordinatorId: ac._id,
  });

  let location = await locations.findOne({
    name: req.body.location,
  });
  
  if (!location) {
    res.json("this location is incorrect");
    return;
  }
  if (
    req.body.weekDay > 6 ||
    req.body.weekDay < 0 ||
    req.body.slot > 5 ||
    req.body.slot < 1
  ) {
    res.json("check your slot or weekDay input");
    return;
  }

  if (
    req.body.type != "tutorial" &&
    req.body.type != "lecture" &&
    req.body.type != "practical"
  ) {
    res.json("slot type is incorrect");
    return;
  }

  let slot = await courses.findOne({
    _id: course._id,
    "schedule.locationId": location._id,
    "schedule.weekDay": req.body.weekDay,
    "schedule.slot": req.body.slot,
    "schedule.type": req.body.type,
  });
  if (slot) {
    res.json("This slot is already added");
    return;
  }
  let slotLocationBusy = await courses.findOne({
    "schedule.locationId": await getLocationIdByName(req.body.location),
    "schedule.weekDay": req.body.weekDay,
    "schedule.slot": req.body.slot,
  });

  if (slotLocationBusy) {
    res.json("This location is busy at this time");
    return;
  }

  let addedToLocation = {
    courseId: course._id,
    weekDay: req.body.weekDay,
    slot: req.body.slot,
    type: req.body.type,
  };

  let addedToCourse = {
    locationId: location._id,
    weekDay: req.body.weekDay,
    slot: req.body.slot,
    type: req.body.type,
  };

  location.schedule.push(addedToLocation);
  await location.save();

  course.schedule.push(addedToCourse);
  await course.save();

  res.json("Slot is added successfully");
});

router.route("/api/coordinator/updateSlot").post(auth, async (req, res) => {
  let course = await courses.findOne({
    coordinatorId: ac._id,
  });

  let location = await locations.findOne({
    name: req.body.location,
  });
  if (!location) {
    res.json("this location is incorrect");
    return;
  }
  let newLocation = await locations.findOne({
    name: req.body.newLocation,
  });
  if (!newLocation) {
    res.json("this location is incorrect");
    return;
  }
  if (
    req.body.weekDay > 6 ||
    req.body.weekDay < 0 ||
    req.body.slot > 5 ||
    req.body.slot < 1
  ) {
    return res.json("check your slot or weekDay input");
  }

  if (
    req.body.type != "tutorial" &&
    req.body.type != "lecture" &&
    req.body.type != "practical"
  ) {
    return res.json("slot type is incorrect");
  }

  if (
    req.body.newweekDay > 6 ||
    req.body.newweekDay < 0 ||
    req.body.newslot > 5 ||
    req.body.newslot < 1
  ) {
    res.json("check your slot or weekDay input");
    return;
  }

  if (
    req.body.newtype != "tutorial" &&
    req.body.newtype != "lecture" &&
    req.body.newtype != "practical"
  ) {
    res.json("slot type is incorrect");
    return;
  }
  let slot = await courses.findOne({
    _id: course._id,
    "schedule.locationId": location._id,
    "schedule.weekDay": req.body.weekDay,
    "schedule.slot": req.body.slot,
    "schedule.type": req.body.type,
  });

  if (!slot) {
    res.json("This slot doesn't exist");
    return;
  }

  let slotAssigned = await courses.findOne({
    _id: course._id,
    "schedule.instructorId": { $ne: null },
    "schedule.locationId": await getLocationIdByName(req.body.location),
    "schedule.weekDay": req.body.weekDay,
    "schedule.slot": req.body.slot,
    "schedule.type": req.body.type,
  });

  if (slotAssigned) {
    res.json("This slot is already assgined to an academic");
    return;
  }

  location.schedule = await location.schedule.filter(function (value) {
    return (
      !value.courseId.equals(course._id) ||
      value.weekDay !== req.body.weekDay ||
      value.slot !== req.body.slot ||
      value.type !== req.body.type
    );
  });

  await location.save();
  newLocation.schedule.push({
    weekDay: req.body.newweekDay,
    slot: req.body.newslot,
    type: req.body.newtype,
    courseId: course._id,
  });

  await newLocation.save();

  for (const entry of course.schedule) {
    if (
      entry.locationId.equals(location._id) &&
      entry.weekDay === req.body.weekDay &&
      entry.slot === req.body.slot &&
      entry.type === req.body.type
    ) {
      entry.locationId = newLocation._id;
      entry.weekDay = req.body.newweekDay;
      entry.slot = req.body.newslot;
      entry.type = req.body.newtype;

      await course.save();
      break;
    }
  }

  res.json("slot updated successfully");
});

router.route("/api/coordinator/deleteSlot").post(auth, async (req, res) => {
  let course = await courses.findOne({
    coordinatorId: ac._id,
  });
  let location = await locations.findOne({
    name: req.body.location,
  });
  if (!location) {
    res.json("this location is incorrect");
    return;
  }
  if (
    req.body.weekDay > 6 ||
    req.body.weekDay < 0 ||
    req.body.slot > 5 ||
    req.body.slot < 1
  ) {
    res.json("check your slot or weekDay input");
    return;
  }
  if (
    req.body.type != "tutorial" &&
    req.body.type != "lecture" &&
    req.body.type != "practical"
  ) {
    res.json("slot type is incorrect");
    return;
  }
  let slot = await courses.findOne({
    _id: course._id,
    "schedule.locationId": location._id,
    "schedule.weekDay": req.body.weekDay,
    "schedule.slot": req.body.slot,
    "schedule.type": req.body.type,
  });
  if (!slot) {
    res.json("This slot doesn't exist");
    return;
  }

  let slotAssigned = await courses.findOne({
    _id: course._id,
    "schedule.instructorId": { $ne: null },
    "schedule.locationId": await getLocationIdByName(req.body.location),
    "schedule.weekDay": req.body.weekDay,
    "schedule.slot": req.body.slot,
    "schedule.type": req.body.type,
  });

  if (slotAssigned) {
    res.json("This slot is already assigned to an academic");
    return;
  }

  location.schedule = await location.schedule.filter(function (value) {
    return (
      !value.courseId.equals(course._id) ||
      value.weekDay !== req.body.weekDay ||
      value.slot !== req.body.slot ||
      value.type !== req.body.type
    );
  });

  await location.save();

  course.schedule = await course.schedule.filter(function (value) {
    return (
      !value.locationId.equals(location._id) ||
      value.weekDay !== req.body.weekDay ||
      value.slot !== req.body.slot ||
      value.type !== req.body.type
    );
  });

  await course.save();

  res.json("Slot deleted successfully");
});

module.exports = router;
