const courses = require("../models/course");
const academics = require("../models/academic");
const departments = require("../models/department");
const locations = require("../models/locations");
const hr = require("../models/hr");

class getterRoutes {
  constructor() {}

  async getCourseNameById(id) {
    const ret = await courses.findById(id).select("name -_id");
    return ret ? ret.name : undefined;
  }

  async getStaffNameById(id) {
    const ret = await academics.findById(id).select("name id -_id");
    return ret ? ret : undefined;
  }

  async getCourseIdByName(name) {
    const ret = await courses.findOne({ name: name });
    return ret ? ret._id : undefined;
  }

  async getDepNameById(id) {
    const ret = await departments.findById(id).select("name -_id");
    return ret ? ret.name : undefined;
  }

  async getDepIdByName(name) {
    const ret = await departments.findOne({ name: name });
    return ret ? ret._id : undefined;
  }

  async getLocationNameById(id) {
    const ret = await locations.findById(id).select("name -_id");
    return ret ? ret.name : undefined;
  }

  async getLocationIdByName(name) {
    const ret = await locations.findOne({ name: name });
    return ret ? ret._id : undefined;
  }

  async getId(_id) {
    const fst = await academics.findById(_id).select("id");
    const snd = await hr.findById(_id).select("id");
    return fst ? fst.id : snd.id;
  }

  async getCoursesInDep(depId) {
    const arr = await courses.find({ departmentId: depId });
    const ret = [];
    for (const entry of arr) {
      ret.push(entry.name);
    }
    return ret;
  }
}

module.exports = getterRoutes;
