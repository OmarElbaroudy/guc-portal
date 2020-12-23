# guc-portal
functionality: assign instructor to a course 
Route: /HOD/assign_course_instructor
request type: put
Response: update the instructor and the course record in the collections 
request body:{ 
"id":"ac-1",
	"course_name":"math"
}
// id is the id of the instructor who we want to add course_name to

functionality: delete instructor to a course 
Route: /HOD/delete_course_instructor
request type: put
Response: delete the instructor and the course record in the collections 
request body:{ 
"id":"ac-1",
	"course_name":"math"
}
// id is the id of the instructor who we want to delete the course_name from

functionality: view staff members in his department or by course
Route: /HOD/view_staff
request type: post
Response: the profile of instructors in his department or in course if a course is chosen
request body:{ 
	"course_name":"math"
}
// if the request body contain course_name then send the staff in this course, else send all staff in his department

functionality:update course instructor for courses in his/her department
route:/HOD/update_course_instructor
request type:put
response:replace the old instructor with the new one 
request body:{
    "org_id":id //the id of the old instructor
    "upd_id":id //the id of the new instructor
    "course_name": course name //the course to replace instructors in
}

functionality:view course coverage of any course
route:/HOD/view_course_coverage
request type: post
response:return the course coverage of the course in String
request body:{
    "course_name":"course name"// the name of the course to view its coverage
}

functionality:view all the requests sent in his/her department
route:/HOD/view_requests
request type: post 
response:return all requests sent in his/her department in an array
request body:{
    
}








#course instructor

Functionality: View the coverage of course(s) he/she is assigned to.
Route: /instructor/viewCoursesCoverage
Request type: get
Response: Array of Course coverage objects example :
[
    {
        "course": "CSEN101",
        "coverage": "0 %"
    },
    {
        "course": "CSEN202",
        "coverage": "0 %"
    }
]





Functionality: View the slots' assignment of course(s) he/she is assigned to.
Route: /instructor/viewAssignedSlots
Request type: get
Response: Array of Slots object example :
[
    {
        "course": "CSEN101",
        "Assigned Slots": [
            {
                "_id": "5fdf6b7d5da86b5764c7d8fa",
                "locationId": "5fddfd9218f5841dc7f1cc46",
                "weekDay": 2
            }
        ]
    },
    {
        "course": "CSEN202",
        "Assigned Slots": [
            {
                "_id": "5fdf68b6bee2b7547c97cb38",
                "locationId": "5fdf64b4ecdfe08bd3320343",
                "weekDay": 4,
                "slot": 4,
                "type": "tutorial"
            }
        ]
    }
]




Functionality: View all the staff in his/her department or per course along with their profiles.
Route: /instructor/viewCourseOrDepartmentStaff
Request type: Post
Request body: {"input" : "department"}  // u can use also {"input":"course"} 
Response : Array of academics example :
[
    {
        "departmentId": "5fdd26ff36302745f657e458",
        "Staff": [
            {
                "password": "$2a$10$H8dlHuEbQd2cMLwcYVCpWOc/UcxwKa8s5tFtCTaEGQsy7PlBgePeS",
                "altered": false,
                "sentRequestsId": [],
                "receivedRequestsId": [],
                "notifications": [],
                "_id": "5fdd0427ff0b3e13c00d85b1",
                "email": "omar@google.com",
                "id": "ac-4",
                "name": "Omar Hany",
                "missingHours": -176.4,
                "missingDays": 21,
                "attendanceRecords": [],
                "salary": 10000,
                "dayOff": 0,
                "courses": [
                    {
                        "courseId": "5fdce1e668b7bc7b14e4c861",
                        "position": "instructor"
                    },
                    {
                        "courseId": "5fddffd718f5841dc7f1cc48",
                        "position": "instructor"
                    }
                ],
                "schedule": [],
                "__v": 0,
                "departmentId": "5fdd26ff36302745f657e458",
                "accidentalLeaveBalance": {
                    "balance": 6,
                    "_id": "5fdfa6e134fd3d74bf9e47ec",
                    "lastUpdated": "2020-12-20T21:32:00.000Z"
                },
                "annualLeaveBalance": {
                    "balance": 2.5,
                    "_id": "5fdfa6e134fd3d74bf9e47eb",
                    "lastUpdated": "2020-12-20T21:32:00.000Z"
                }
            }
        ]
    }
]



Functionality: Assign an academic member to an unassigned slots in course(s) he/she is assigned to.
Route: /instructor/assignSlotToAcademic
Request type: Post
Request body: {
  "course":"CSEN202",
  "location":"c7-220",
  "weekDay":2,
  "slot":2,
  "type":"tutorial",
  "academic":"ac-6"
}


Functionality: Update assignment of academic member in course(s) he/she is assigned to.
Route: /instructor/updateSlotAssignment
Request type: Put
Request body: 
{
  "course":"CSEN202",
  "location":"c7-220",
  "weekDay":2,
  "slot":2,
  "type":"tutorial",
  "academic":"ac-7",
  "academic2":"ac-6" // id of the new academic
}
Response : Wheather the operation succeeded or no


Functionality: Delete assignment of academic member in course(s) he/she is assigned to.
Route: /instructor/deleteSlotAssignment
Request type: Put
Request body: 
{
  "course":"CSEN202",
  "location":"c7-220",
  "weekDay":2,
  "slot":2,
  "type":"tutorial",
  "academic":"ac-7"
}
Response : Wheather the operation succeeded or no



Functionality: Remove an assigned academic member in course(s) he/she is assigned to.
Route: /instructor/deleteAcademic
Request type: Put
Request body: 
{
  "course":"CSEN202",
  "academic":"ac-6"
}
Response : Wheather the operation succeeded or no


Functionality: Assign an academic member in each of his/her course(s) to be a course coordinator.
Route: /instructor/assignCourseCoordinator
Request type: Post
Request body: 
{
  "course":"CSEN202",
  "academic":"ac-6"
}
Response : Wheather the operation succeeded or no

#course coordinator
Functionality: View "slot linking" request(s) from academic members linked to his/her course.
Route: /coordinator/viewSlotLinking
Request type: get
Response: Array of Course coverage objects example :
{
    "Requests": [
        {
            "compensated": false,
            "_id": "5fde555e8d8d994214a1a763",
            "status": "rejected",
            "type": "slotLinking",
            "senderId": "5fdcf7fc1277bae5c0d18aa9",
            "receiverId": "5fde34ae47cab3a4343f1ef1",
            "issueDate": "2020-12-19T00:00:00.000Z",
            "departmentId": "5fdd1451365a1c6ddcb28863",
            "slotLinking": {
                "_id": "5fde555e8d8d994214a1a764",
                "courseId": "5fdce1e668b7bc7b14e4c861",
                "slot": 1,
                "weekDay": 3,
                "locationId: "5fddfd9218f5841dc7f1cc46"
            },
            "__v": 0
        }
    ]
}

Functionality: Accept "slot linking" requests from academic members linked to his/her course.
Route: /coordinator/acceptSlotLinking
Request type: Post
Request body: 
{
    	"reqs":"5fde555e8d8d994214a1a763"   // where reqs is the request objectId
}
Response : Wheather the operation succeeded or no

Functionality: Reject "slot linking" requests from academic members linked to his/her course.
Route: /coordinator/rejectSlotLinking
Request type: Post
Request body: 
{
    	"reqs":"5fde555e8d8d994214a1a763"   // where reqs is the request objectId
}
Response : Wheather the operation succeeded or no

Functionality: Add slot(s) in his/her course.
Route: /coordinator/addCourseSlot
Request type: Post
Request body: 
{
  "location":"c7-218",
  "weekDay":1,
  "slot":4,
  "type":"tutorial"
}
Response : Wheather the operation succeeded or no

Functionality: update course slot(s) in his/her course.
Route: /coordinator/updateSlot
Request type: Post
Request body: 
{
  "location":"c7-218",
  "weekDay":1,
  "slot":4,
  "type":"tutorial",
  "newLocation":"c7-220",
  "newweekDay":0,
  "newslot":2,
  "newtype":"tutorial"
}
Response : Wheather the operation succeeded or no

Functionality: delete course slot(s) in his/her course.
Route: /coordinator/deleteSlot
Request type: Post
Request body: 
{
  "location":"c7-218",
  "weekDay":1,
  "slot":4,
  "type":"tutorial"
}
Response : Wheather the operation succeeded or no

