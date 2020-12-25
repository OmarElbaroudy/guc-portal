port 3000
node index.js
//run index.js file,listen to port 3000

the first route is used to insert HR member to begin testing with 
email:ashry@gmail.com
password:123456

1)
Functionality: add HR member -(not required) to begin testing-   
route: /createHr 
request type: get
request body:{}
expected response:hr added successfully

2)
Functionality: Log in with a unique email and a password
route: /login
request type: post
request body:{
    "email" : "ashry@gmail.com",
    "password" : "123456"
}
expected response:login successful
 you have 0 notifications
 please change your password!

3)
Functionality: View their profile
route: /myProfile
request type: get
request body:{}
expected response:{
    "password": "$2a$10$88QymkmP23Bm38aM9qBObO9ag8rAxeC2hyfCLGIvk4GgMhL6v35/m",
    "altered": false,
    "_id": "5fe4e59330cac9174f1b1d73",
    "name": "Ashry",
    "email": "ashry@gmail.com",
    "id": "hr-1",
    "gender": "male",
    "salary": 5000,
    "dayOff": 6,
    "attendanceRecords": [],
    "__v": 0,
    "accidentalLeaveBalance": {
        "balance": 6,
        "_id": "5fe4e5d630cac9174f1b1d75",
        "lastUpdated": "2020-12-24T21:02:00.000Z"
    },
    "annualLeaveBalance": {
        "balance": 2.5,
        "_id": "5fe4e5d630cac9174f1b1d74",
        "lastUpdated": "2020-12-24T21:02:00.000Z"
    },
    "missingDays": 21,
    "missingHours": 176.4
}

4)
Functionality: Update their profile
route: /myProfile
request type: put
request body:{
    "gender" : "male",
    "personalInfo" : "bla bla bla",
    "password" : "123456"
}
// you can update onlt the password it's not a must to give all the input above
expected response: profile updated successfully
 { password:
   '$2a$10$mQuLLu/pCMEvBgEvb3H4GOhgX9lcj9JKyCpa5MwaHts5r.cPG5/du',
  altered: true,
  _id: 5fe4e59330cac9174f1b1d73,
  name: 'Ashry',
  email: 'ashry@gmail.com',
  id: 'hr-1',
  gender: 'male',
  salary: 5000,
  dayOff: 6,
  attendanceRecords: [],
  __v: 0,
  accidentalLeaveBalance:
   { balance: 6,
     _id: 5fe4e5d630cac9174f1b1d75,
     lastUpdated: 2020-12-24T21:02:00.000Z },
  annualLeaveBalance:
   { balance: 2.5,
     _id: 5fe4e5d630cac9174f1b1d74,
     lastUpdated: 2020-12-24T21:02:00.000Z },
  missingDays: 21,
  missingHours: 176.4,
  personalInfo: 'bla bla bla'
 }

5)
Functionality: Reset their passwords.
route: /myProfile/resetPassword
request type: post
request body:{
    "newPassword" : "1234567"
}
//if you logged in again now the password reset prompt will not be sent
expected response:password updated successfully

6)
Functionality: Sign in
route: /myProfile/signIn
request type: get
request body:{}
expected response: signed in successfully
//when using signIn or signOut if not between 7am and 7pm missing hours will not be affected

7)
Functionality: Sign out
route: /myProfile/signOut
request type: get
request body:{}
expected response: signed out successfully
//when using signIn or signOut if not between 7am and 7pm missing hours will not be affected

8)
Functionality: View all their attendance records,
route: /myProfile/viewAttendanceRecords
request type: get
request body:{}
expected response: [
    {
        "signIn": [
            1608845700000
        ],
        "signOut": [
            1608845640000
        ],
        "compensation": false,
        "_id": "5fe4ed2e30cac9174f1b1d8b",
        "day": "2020-12-24T00:00:00.000Z",
        "weekDay": 4
    }
]
//weekDay is a number corresponding to the day of the week 0 for sunday 1 for monday ....

9)
Functionality: View if they have missing days
route: /myProfile/viewMissingDays
request type: get
request body:{}
expected response: number of missing days for this month => 21

10)
Functionality: View if they are having missing hours or extra hours
route: /myProfile/viewMissingHours
request type: get
request body:{}
expected response: missing hours for this month => 176.4
//if positive then missing hourse, if negative then extra hours

11)
Functionality: Add a location
route: /hr/location
request type: post
request body:{"name":"C7.02", "maxCapacity":20, "type":"office"}
expected response: inserted successfully

12)
Functionality: update a location
route: /hr/location
request type: put
request body:{"name":"C7.02", "newName":"C7.221", "maxCapacity":25}
expected response: location updated successfully

13)
Functionality: HR add a new staff member to the system
route: /hr/registerMember
request type: post
request body:{
    "name":"ahmed", "salary": 1000 , "officeLocation" :"C7.221", "email":"ahmed@guc.edu.eg", "type":"academic"
}
expected response: Member Registered successfully
//type can be "hr" or "academic"
//assign 5 members to the system to help testing as it will be needed later on

14)
Functionality: Add a faculty.
route: /hr/addFaculty
request type: post
request body:{"name":"Engineering"}
expected response: {
    "_id": "5fe4f4522fc14824c7e8d827",
    "name": "Engineering",
    "__v": 0
}

15)
Functionality: update a faculty.
route: /hr/updateFaculty
request type: put
request body:{"name":"Engineering", "newName":"Medicine"}
expected response: name changed successfully

16)
Functionality: Add a department under a faculty.
route: /hr/addDepartment
request type: post
request body:{"name":"MET", "faculty":"Medicine"}
expected response: inserted successfully

17)
Functionality: update a department under a faculty.
route: /hr/updateDepartment
request type: put
request body:{"name":"MET", "newName":"IET","newFaculty":"Medecine"}
expected response: department updated successfully

18)
Functionality: Add a course under a department.
route: /hr/addCourse
request type: post
request body:{"name":"CSEN702","department":"IET"}
expected response: course added

19)
Functionality: Update a course under a department
route: /hr/updateCourse
request type: put
request body:{"name":"CSEN702","newName":"CSEN703"}
expected response: updated successfully

20)
Functionality: Update a course under a department
route: /hr/updateCourse
request type: put
request body:{"name":"CSEN702","newName":"CSEN703"}
expected response: updated successfully

21)
Functionality: Update already existing staff members
route: /hr/updateStaffMember
request type: put
request body:{"id":"ac-1","name":"ahmed1", "salary" : 10000, "officeLocation" :"C7.221", "email":"ahmed1@guc.edu.eg"}
expected response: academic updated successfully

22)
Functionality: Manually add a missing sign in/sign out record of a staff member except for himself/herself.
route: /hr/addSignInOut
request type: post
request body:{
    "id" : "ac-1",
    "signIn" : {"year" : "2020", "month" : "12" , "day" : "27" , "hour" : "7", "minute" : "30" },
    "signOut" : {"year" : "2020", "month" : "12" , "day" : "27" , "hour" : "17", "minute" : "30" }
}
//can add signIn, signOut, or both ... can't sign in/out on friday... sign in/out won't be calculated in the missing hours or missing days untill the date of the sign in/out
test with any prevoius date in the same month, but avoid fridays
expected response: added signIn/Out successfully

23)
Functionality: View any staff member attendance record
route: /hr/viewAttendanceRecords
request type: post
request body:{
    "id" : "ac-1"
}
expected response: [
    {
        "signIn": [
            "2020-12-23T07:30:00.000Z",
            "2020-12-23T07:30:00.000Z",
            "2020-12-23T07:30:00.000Z",
            "2020-12-23T07:30:00.000Z"
        ],
        "signOut": [
            "2020-12-23T17:30:00.000Z",
            "2020-12-23T17:30:00.000Z",
            "2020-12-23T17:30:00.000Z",
            "2020-12-23T17:30:00.000Z"
        ],
        "totalTime": 10,
        "compensation": false,
        "_id": "5fe5061d928b493e7387606f",
        "day": "2020-12-23T00:00:00.000Z",
        "weekDay": 3
    }
]

24)
Functionality: View staff members with missing hours.
route: /hr/viewMissingHoursMembers
request type: get
request body: {}
expected response: [
    {
        "password": "123456",
        "altered": false,
        "sentRequestsId": [],
        "receivedRequestsId": [],
        "notifications": [],
        "_id": "5fe4fa8050a22b2fd4dc57e4",
        "name": "ahmed1",
        "id": "ac-1",
        "email": "ahmed1@guc.edu.eg",
        "salary": 10000,
        "dayOff": 6,
        "attendanceRecords": [
            {
                "signIn": [
                    "2020-12-27T07:30:00.000Z"
                ],
                "signOut": [
                    "2020-12-27T17:30:00.000Z",
                    "2020-12-27T17:30:00.000Z"
                ],
                "totalTime": 10,
                "compensation": false,
                "_id": "5fe503f96e55ba3d1ddcfe7d",
                "day": "2020-12-27T00:00:00.000Z",
                "weekDay": 0
            },
            {
                "signIn": [
                    "2020-12-23T07:30:00.000Z",
                    "2020-12-23T07:30:00.000Z",
                    "2020-12-23T07:30:00.000Z",
                    "2020-12-23T07:30:00.000Z"
                ],
                "signOut": [
                    "2020-12-23T17:30:00.000Z",
                    "2020-12-23T17:30:00.000Z",
                    "2020-12-23T17:30:00.000Z",
                    "2020-12-23T17:30:00.000Z"
                ],
                "totalTime": 10,
                "compensation": false,
                "_id": "5fe5061d928b493e7387606f",
                "day": "2020-12-23T00:00:00.000Z",
                "weekDay": 3
            }
        ],
        "courses": [],
        "schedule": [],
        "__v": 6,
        "officeLocationId": "5fe4f1db2fc14824c7e8d81f",
        "missingDays": 20,
        "missingHours": 166.4
    },
    {
        "password": "$2a$10$/ll15G68xcKWveYVrmWAsu2A3Y8vjbhgpBXIFNZt9W3Gocp2eMECa",
        "altered": true,
        "_id": "5fe4e59330cac9174f1b1d73",
        "name": "ashry",
        "email": "ashry@gmail.com",
        "id": "hr-1",
        "gender": "male",
        "salary": 10000,
        "dayOff": 6,
        "attendanceRecords": [
            {
                "signIn": [
                    1608845700000
                ],
                "signOut": [
                    1608845640000
                ],
                "compensation": false,
                "_id": "5fe4ed2e30cac9174f1b1d8b",
                "day": "2020-12-24T00:00:00.000Z",
                "weekDay": 4
            }
        ],
        "__v": 5,
        "accidentalLeaveBalance": {
            "balance": 6,
            "_id": "5fe4e5d630cac9174f1b1d75",
            "lastUpdated": "2020-12-24T21:02:00.000Z"
        },
        "annualLeaveBalance": {
            "balance": 2.5,
            "_id": "5fe4e5d630cac9174f1b1d74",
            "lastUpdated": "2020-12-24T21:02:00.000Z"
        },
        "missingDays": 21,
        "missingHours": 176.4,
        "personalInfo": "bla bla bla",
        "officeLocationId": "5fe4f1db2fc14824c7e8d81f"
    }
]

25)
Functionality: View staff members with missing days.
route: /hr/viewMissingDaysMembers
request type: get
request body:{}
expected response: [
    {
        "password": "123456",
        "altered": false,
        "sentRequestsId": [],
        "receivedRequestsId": [],
        "notifications": [],
        "_id": "5fe4fa8050a22b2fd4dc57e4",
        "name": "ahmed1",
        "id": "ac-1",
        "email": "ahmed1@guc.edu.eg",
        "salary": 10000,
        "dayOff": 6,
        "attendanceRecords": [
            {
                "signIn": [
                    "2020-12-27T07:30:00.000Z"
                ],
                "signOut": [
                    "2020-12-27T17:30:00.000Z",
                    "2020-12-27T17:30:00.000Z"
                ],
                "totalTime": 10,
                "compensation": false,
                "_id": "5fe503f96e55ba3d1ddcfe7d",
                "day": "2020-12-27T00:00:00.000Z",
                "weekDay": 0
            },
            {
                "signIn": [
                    "2020-12-23T07:30:00.000Z",
                    "2020-12-23T07:30:00.000Z",
                    "2020-12-23T07:30:00.000Z",
                    "2020-12-23T07:30:00.000Z"
                ],
                "signOut": [
                    "2020-12-23T17:30:00.000Z",
                    "2020-12-23T17:30:00.000Z",
                    "2020-12-23T17:30:00.000Z",
                    "2020-12-23T17:30:00.000Z"
                ],
                "totalTime": 10,
                "compensation": false,
                "_id": "5fe5061d928b493e7387606f",
                "day": "2020-12-23T00:00:00.000Z",
                "weekDay": 3
            }
        ],
        "courses": [],
        "schedule": [],
        "__v": 6,
        "officeLocationId": "5fe4f1db2fc14824c7e8d81f",
        "missingDays": 20,
        "missingHours": 166.4
    },
    {
        "password": "$2a$10$/ll15G68xcKWveYVrmWAsu2A3Y8vjbhgpBXIFNZt9W3Gocp2eMECa",
        "altered": true,
        "_id": "5fe4e59330cac9174f1b1d73",
        "name": "ashry",
        "email": "ashry@gmail.com",
        "id": "hr-1",
        "gender": "male",
        "salary": 10000,
        "dayOff": 6,
        "attendanceRecords": [
            {
                "signIn": [
                    1608845700000
                ],
                "signOut": [
                    1608845640000
                ],
                "compensation": false,
                "_id": "5fe4ed2e30cac9174f1b1d8b",
                "day": "2020-12-24T00:00:00.000Z",
                "weekDay": 4
            }
        ],
        "__v": 5,
        "accidentalLeaveBalance": {
            "balance": 6,
            "_id": "5fe4e5d630cac9174f1b1d75",
            "lastUpdated": "2020-12-24T21:02:00.000Z"
        },
        "annualLeaveBalance": {
            "balance": 2.5,
            "_id": "5fe4e5d630cac9174f1b1d74",
            "lastUpdated": "2020-12-24T21:02:00.000Z"
        },
        "missingDays": 21,
        "missingHours": 176.4,
        "personalInfo": "bla bla bla",
        "officeLocationId": "5fe4f1db2fc14824c7e8d81f"
    }
]

26)
Functionality: assign department to an academic
route: /hr/assignDepartment
request type: post
request body:{"id" : "ac-1", "department" : "IET"}
expected response: assigned department to academic successfully

27)
Functionality: assign head of department to a department 
route: /hr/assignHod
request type: post
request body:{"hodId" : "ac-1", "department" : "IET"}
expected response: assigned academic as hod successfully

28)
Functionality: Assign a course instructor for each course in his department.
route: /HOD/assign_course_instructor
request type: put
request body:{"id" : "ac-2", "courseName" : "CSEN703",  "type":"instructor"}
expected response: Instructor added to the course successfully
//assign a course to 3 members , 1 as hod, 2 as academic to be used as coordinator and instructor


29)
Functionality: View all the staff in his/her department or per course along with their proles.
route: /HOD/view_staff
request type: post
request body:{"courseName" : "CSEN703"}
expected response: [
    {
        "password": "$2a$10$Rw0DdBVUfarRH.3UDmhpseE9xPh/7vgYBQWFperjfSTAfGvRt8miG",
        "altered": false,
        "sentRequestsId": [],
        "receivedRequestsId": [],
        "notifications": [],
        "_id": "5fe519e1cd74225ac1dc0171",
        "name": "test",
        "id": "ac-2",
        "email": "test@guc.edu.eg",
        "salary": 1000,
        "dayOff": 6,
        "attendanceRecords": [],
        "courses": [
            {
                "_id": "5fe51fcc9583056710a25c78",
                "courseId": "5fe4f81b23904d2c941c65f9",
                "position": "instructor"
            }
        ],
        "schedule": [],
        "__v": 1,
        "departmentId": "5fe4f58a2fc14824c7e8d82c"
    }
]

30)
Functionality: View the day off of all the staff/ a single sta in his/her department
route: /HOD/view_day_off
request type: post
request body:{"id" : "ac-2"}
//id is optional
expected response: 6

31)
Functionality: View all the requests \change day off/leave" sent by staff members in his/her department.
route: /HOD/view_requests
request type: get
request body:
expected response: []

32)
Functionality: View the coverage of each course in his/her department.
route: /HOD/view_course_coverage
request type: get
request body:
expected response: [
    {
        "course": "CSEN703",
        "coverage": "0 %"
    }
]

//now login with a course instructor 
{"email" : "test@guc.edu.eg", "password" : "123456"}
course instructor in "CSEN703"


33)
Functionality: Assign an academic member in each of his/her course(s) to be a course coordinator.
route: /instructor/assignCourseCoordinator
request type: post
request body:{"id" : "ac-3", "course" : "CSEN703"}
expected response: Academic ac-3 assigned to be a coordinator of course CSEN703 successfully

//then log in as coordinator
{"email" : "cord@guc.edu.eg", "password" : "123456"}

34)
Functionality: Add course slot(s) in his/her course.
route: /coordinator/addCourseSlot
request type: post
request body:{"location" : "C7.221", "weekDay" : 2, "slot" : 3, "type" : "tutorial"}
expected response: Slot to course :CSEN703 is added successfully

35)
Functionality: update course slot(s) in his/her course.
route: /coordinator/updateSlot
request type: post
request body:{"location" : "C7.221" ,"weekDay" : 2, "slot" : 3, "type" : "tutorial", 
    "newLocation" : "C7.221", "newweekDay" : 3, "newslot" : 4, "newtype" : "tutorial"
}
expected response: SLot updated successfully


36)
Functionality: Assign an academic member to an unassigned slots in course(s) he/she is assigned to.
route: /instructor/assignSlotToAcademic
request type: post
request body:{"course" : "CSEN703", "academic" : "ac-2", "location"  : "C7.221", "weekDay" : 3, "slot" : 4, "type" : "tutorial"}
expected response: Assignment made successfully


37)
Functionality:View the coverage of course(s) he/she is assigned to.
route: /instructor/viewCoursesCoverage
request type: get
request body:
expected response: [
    {
        "course": "CSEN703",
        "coverage": "100 %"
    }
]

38)
Functionality:View the slots' assignment of course(s) he/she is assigned to.
route: /instructor/viewAssignedSlots
request type: get
request body:
expected response: [
    {
        "course": "CSEN703",
        "Assigned Slots": [
            {
                "_id": "5fe534482e9d24825623eae6",
                "locationId": "5fe4f1db2fc14824c7e8d81f",
                "weekDay": 3,
                "slot": 4,
                "type": "tutorial",
                "instructorId": "5fe519e1cd74225ac1dc0171"
            }
        ]
    }
]

39)
Functionality:View all the staff in his/her department or per course along with their profiles.
route: /instructor/viewCourseOrDepartmentStaff
request type: post
request body:{"input" : "department"}
expected response: [
    {
        "departmentId": "5fe4f58a2fc14824c7e8d82c",
        "Staff": [
            {
                "password": "$2a$10$/ll15G68xcKWveYVrmWAsu2A3Y8vjbhgpBXIFNZt9W3Gocp2eMECa",
                "altered": false,
                "sentRequestsId": [],
                "receivedRequestsId": [],
                "notifications": [],
                "_id": "5fe4fa8050a22b2fd4dc57e4",
                "name": "ahmed1",
                "id": "ac-1",
                "email": "ahmed1@guc.edu.eg",
                "salary": 10000,
                "dayOff": 6,
                "attendanceRecords": [],
                "courses": [
                    {
                        "_id": "5fe51f209583056710a25c6d",
                        "courseId": "5fe4f81b23904d2c941c65f9",
                        "position": "hod"
                    }
                ],
                "schedule": [],
                "__v": 8,
                "officeLocationId": "5fe4f1db2fc14824c7e8d81f",
                "missingDays": 21,
                "missingHours": 176.4,
                "departmentId": "5fe4f58a2fc14824c7e8d82c",
                "accidentalLeaveBalance": {
                    "balance": 6,
                    "_id": "5fe51a7dcd74225ac1dc0175",
                    "lastUpdated": "2020-12-25T00:47:00.000Z"
                },
                "annualLeaveBalance": {
                    "balance": 2.5,
                    "_id": "5fe51a7dcd74225ac1dc0174",
                    "lastUpdated": "2020-12-25T00:47:00.000Z"
                }
            },
            {
                "password": "$2a$10$Rw0DdBVUfarRH.3UDmhpseE9xPh/7vgYBQWFperjfSTAfGvRt8miG",
                "altered": false,
                "sentRequestsId": [],
                "receivedRequestsId": [],
                "notifications": [],
                "_id": "5fe519e1cd74225ac1dc0171",
                "name": "test",
                "id": "ac-2",
                "email": "test@guc.edu.eg",
                "salary": 1000,
                "dayOff": 6,
                "attendanceRecords": [],
                "courses": [
                    {
                        "_id": "5fe51fcc9583056710a25c78",
                        "courseId": "5fe4f81b23904d2c941c65f9",
                        "position": "instructor"
                    }
                ],
                "schedule": [
                    {
                        "_id": "5fe541ab2c401e96c551bc5d",
                        "courseId": "5fe4f81b23904d2c941c65f9",
                        "locationId": "5fe4f1db2fc14824c7e8d81f",
                        "weekDay": 3,
                        "slot": 4,
                        "type": "tutorial"
                    }
                ],
                "__v": 4,
                "departmentId": "5fe4f58a2fc14824c7e8d82c",
                "accidentalLeaveBalance": {
                    "balance": 6,
                    "_id": "5fe52d1f9be74e7825bc7580",
                    "lastUpdated": "2020-12-25T02:06:00.000Z"
                },
                "annualLeaveBalance": {
                    "balance": 2.5,
                    "_id": "5fe52d1f9be74e7825bc757f",
                    "lastUpdated": "2020-12-25T02:06:00.000Z"
                },
                "missingDays": 21,
                "missingHours": 176.4
            }
        ]
    }
]

//make 2 of the registered academics to TAs in a course to be able to continue testing
//assign course to both of them, so both are academics in the same course
//add slot to one academic 
//sign in with the academic with the slot to start testing
//assign both academics to the only department 

40)
Functionality:View their schedule. Schedule should show teaching activities and replacements if present.
route: /ac/viewSchedule
request type: get
request body:{}
expected response: [
    {
        "slot": 4,
        "weekDay": 4,
        "location": "C7.221",
        "course": "CSEN703"
    }
]

41)
Functionality:Send replacement request(s).
route: /ac/replacement
request type: post
request body:{
"id":"ac-5",
"slotDate":{"year":"2020","month":"12","day":"31"},
"location":"C7.221",
"slot":"4",
"course":"CSEN703"
}
expected response: request sent successfully


42)
Functionality:view replacement request(s).
route:/ac/replacement
request type: get
request body:{}
expected response: [
    {
        "course": "CSEN703",
        "slotDate": "2020-12-31T00:00:00.000Z",
        "slot": 4,
        "location": "C7.221",
        "status": "pending",
        "hodStatus": "pending",
        "receiver": "ac-5",
        "issueDate": "2020-12-25T00:00:00.000Z"
    }
]

//coordinator adds an empty course slot used for slot linking request test

43)
Functionality: Send a slot linking request.
route: /ac/slotLinkingRequest
request type: post
request body:{
    "courseName":"CSEN703",
    "weekDay":0,
    "slot":2,
    "location":"C7.221"

}
expected response: slotLinking request sent successfully
//create two requests to accept and reject the other one


44)
Functionality:Change their day off by sending a change day off request.
route: /ac/changeDayOff
request type: post
request body:{
        "newDayOff": 4,
        "comment": "I need to switch my day off to thursday"
}
expected response: change day off request sent successfully

45)
Functionality:Submit any type of leave request.
route: /ac/leaveRequest
request type:post 
request body:{
        "type": "annual",
        "date": {"year":"2020","month":"12","day":"15"}
}
expected response:leave request is sent successfully 
//type =maternity| accidental| sick| compensation

46)
Functionality:View the status of all submitted requests .
route: /ac/viewSubmittedRequests
request type: post
request body:{
        "status" : "pending"
}
expected response: [
    {
        "compensated": false,
        "_id": "5fe5492e09a9649f57a4ff7f",
        "status": "pending",
        "type": "replacement",
        "departmentId": "5fe4f58a2fc14824c7e8d82c",
        "senderId": "5fe545702c401e96c551bc72",
        "receiverId": "5fe5457e2c401e96c551bc75",
        "issueDate": "2020-12-25T00:00:00.000Z",
        "replacement": {
            "_id": "5fe5492e09a9649f57a4ff80",
            "courseId": "5fe4f81b23904d2c941c65f9",
            "slot": 4,
            "locationId": "5fe4f1db2fc14824c7e8d81f",
            "slotDate": "2020-12-31T00:00:00.000Z",
            "academicResponse": "pending"
        },
        "__v": 0
    },
    {
        "compensated": false,
        "_id": "5fe54cf198ab60a194f38167",
        "status": "pending",
        "type": "slotLinking",
        "senderId": "5fe545702c401e96c551bc72",
        "receiverId": "5fe52dee9be74e7825bc7583",
        "issueDate": "2020-12-25T00:00:00.000Z",
        "departmentId": "5fe4f58a2fc14824c7e8d82c",
        "slotLinking": {
            "_id": "5fe54cf198ab60a194f38168",
            "courseId": "5fe4f81b23904d2c941c65f9",
            "slot": 1,
            "weekDay": 0,
            "locationId": "5fe4f1db2fc14824c7e8d81f"
        },
        "__v": 0
    },
    {
        "compensated": false,
        "_id": "5fe54d3398ab60a194f3816f",
        "status": "pending",
        "type": "slotLinking",
        "senderId": "5fe545702c401e96c551bc72",
        "receiverId": "5fe52dee9be74e7825bc7583",
        "issueDate": "2020-12-25T00:00:00.000Z",
        "departmentId": "5fe4f58a2fc14824c7e8d82c",
        "slotLinking": {
            "_id": "5fe54d3398ab60a194f38170",
            "courseId": "5fe4f81b23904d2c941c65f9",
            "slot": 2,
            "weekDay": 0,
            "locationId": "5fe4f1db2fc14824c7e8d81f"
        },
        "__v": 0
    },
    {
        "compensated": false,
        "_id": "5fe54d4898ab60a194f38177",
        "status": "pending",
        "type": "slotLinking",
        "senderId": "5fe545702c401e96c551bc72",
        "receiverId": "5fe52dee9be74e7825bc7583",
        "issueDate": "2020-12-25T00:00:00.000Z",
        "departmentId": "5fe4f58a2fc14824c7e8d82c",
        "slotLinking": {
            "_id": "5fe54d4898ab60a194f38178",
            "courseId": "5fe4f81b23904d2c941c65f9",
            "slot": 2,
            "weekDay": 0,
            "locationId": "5fe4f1db2fc14824c7e8d81f"
        },
        "__v": 0
    },
    {
        "compensated": false,
        "_id": "5fe54e1eadc759a276525067",
        "status": "pending",
        "type": "changeDayOff",
        "senderId": "5fe545702c401e96c551bc72",
        "receiverId": "5fe4fa8050a22b2fd4dc57e4",
        "issueDate": "2020-12-25T00:00:00.000Z",
        "newDayOff": 4,
        "senderComment": "I need to switch my day off from saturday to tuesday",
        "departmentId": "5fe4f58a2fc14824c7e8d82c",
        "__v": 0
    },
    {
        "compensated": false,
        "_id": "5fe54f1badc759a27652506e",
        "status": "pending",
        "type": "annual",
        "senderComment": "",
        "departmentId": "5fe4f58a2fc14824c7e8d82c",
        "senderId": "5fe545702c401e96c551bc72",
        "receiverId": "5fe4fa8050a22b2fd4dc57e4",
        "issueDate": "2020-12-25T00:00:00.000Z",
        "targetDate": "2020-12-15T00:00:00.000Z",
        "__v": 0
    }
]
//status : all, accepted, pending, rejected,

47)
Functionality:Cancel a still pending request or a request whose day is yet to come .
route: /ac/cancelRequest
request type: post
request body:{
        "reqId":"5fe54cf198ab60a194f38167"

}
expected response: request deleted successfully

//login as hod user 

48)
Functionality:View all the requests \change day off/leave" sent by staff members in his/her department.
route: /HOD/view_requests
request type: get
request body:
expected response: [
    {
        "compensated": false,
        "_id": "5fe5492e09a9649f57a4ff7f",
        "status": "pending",
        "type": "replacement",
        "departmentId": "5fe4f58a2fc14824c7e8d82c",
        "senderId": "5fe545702c401e96c551bc72",
        "receiverId": "5fe5457e2c401e96c551bc75",
        "issueDate": "2020-12-25T00:00:00.000Z",
        "replacement": {
            "_id": "5fe5492e09a9649f57a4ff80",
            "courseId": "5fe4f81b23904d2c941c65f9",
            "slot": 4,
            "locationId": "5fe4f1db2fc14824c7e8d81f",
            "slotDate": "2020-12-31T00:00:00.000Z",
            "academicResponse": "pending"
        },
        "__v": 0
    },
    {
        "compensated": false,
        "_id": "5fe54d3398ab60a194f3816f",
        "status": "pending",
        "type": "slotLinking",
        "senderId": "5fe545702c401e96c551bc72",
        "receiverId": "5fe52dee9be74e7825bc7583",
        "issueDate": "2020-12-25T00:00:00.000Z",
        "departmentId": "5fe4f58a2fc14824c7e8d82c",
        "slotLinking": {
            "_id": "5fe54d3398ab60a194f38170",
            "courseId": "5fe4f81b23904d2c941c65f9",
            "slot": 2,
            "weekDay": 0,
            "locationId": "5fe4f1db2fc14824c7e8d81f"
        },
        "__v": 0
    },
    {
        "compensated": false,
        "_id": "5fe54d4898ab60a194f38177",
        "status": "pending",
        "type": "slotLinking",
        "senderId": "5fe545702c401e96c551bc72",
        "receiverId": "5fe52dee9be74e7825bc7583",
        "issueDate": "2020-12-25T00:00:00.000Z",
        "departmentId": "5fe4f58a2fc14824c7e8d82c",
        "slotLinking": {
            "_id": "5fe54d4898ab60a194f38178",
            "courseId": "5fe4f81b23904d2c941c65f9",
            "slot": 2,
            "weekDay": 0,
            "locationId": "5fe4f1db2fc14824c7e8d81f"
        },
        "__v": 0
    },
    {
        "compensated": false,
        "_id": "5fe54e1eadc759a276525067",
        "status": "pending",
        "type": "changeDayOff",
        "senderId": "5fe545702c401e96c551bc72",
        "receiverId": "5fe4fa8050a22b2fd4dc57e4",
        "issueDate": "2020-12-25T00:00:00.000Z",
        "newDayOff": 4,
        "senderComment": "I need to switch my day off from saturday to tuesday",
        "departmentId": "5fe4f58a2fc14824c7e8d82c",
        "__v": 0
    },
    {
        "compensated": false,
        "_id": "5fe54f1badc759a27652506e",
        "status": "pending",
        "type": "annual",
        "senderComment": "",
        "departmentId": "5fe4f58a2fc14824c7e8d82c",
        "senderId": "5fe545702c401e96c551bc72",
        "receiverId": "5fe4fa8050a22b2fd4dc57e4",
        "issueDate": "2020-12-25T00:00:00.000Z",
        "targetDate": "2020-12-15T00:00:00.000Z",
        "__v": 0
    }
]

49)
Functionality:View teaching assignments (which sta members teach which slots) of course oered by
his department.
route: /HOD/view_course_schedule
request type: post
request body:{"courseName" : "CSEN703"}
expected response: [
    {
        "_id": "5fe534482e9d24825623eae6",
        "locationId": "5fe4f1db2fc14824c7e8d81f",
        "weekDay": 3,
        "slot": 4,
        "type": "tutorial",
        "instructorId": "5fe519e1cd74225ac1dc0171"
    },
    {
        "_id": "5fe546ebd5a9129a17484a29",
        "locationId": "5fe4f1db2fc14824c7e8d81f",
        "weekDay": 4,
        "slot": 4,
        "type": "tutorial",
        "instructorId": "5fe545702c401e96c551bc72"
    },
    {
        "_id": "5fe54a9f09a9649f57a4ff89",
        "locationId": "5fe4f1db2fc14824c7e8d81f",
        "weekDay": 0,
        "slot": 2,
        "type": "tutorial"
    }
]


50)
Functionality:Accept a request. if a request is accepted, appropriate logic should be executed to handle
this request.
route: /HOD/accept_requests
request type: put
request body:{"_id" : "5fe54e1eadc759a276525067"}
expected response: changed successfully

51)
Functionality:Reject a request, and optionally leave a comment as to why this request was rejected. .
route: /HOD/reject_requests
request type: put
request body:{"_id" : "5fe54f1badc759a27652506e"}
expected response:request is rejected

//login as course coordinator

52)
Functionality:View \slot linking request(s) from academic members linked to his/her course.
route: /coordinator/viewSlotLinking
request type: get
request body:{}
expected response:{
    "Requests": [
        {
            "compensated": false,
            "_id": "5fe54d3398ab60a194f3816f",
            "status": "pending",
            "type": "slotLinking",
            "senderId": "5fe545702c401e96c551bc72",
            "receiverId": "5fe52dee9be74e7825bc7583",
            "issueDate": "2020-12-25T00:00:00.000Z",
            "departmentId": "5fe4f58a2fc14824c7e8d82c",
            "slotLinking": {
                "_id": "5fe54d3398ab60a194f38170",
                "courseId": "5fe4f81b23904d2c941c65f9",
                "slot": 2,
                "weekDay": 0,
                "locationId": "5fe4f1db2fc14824c7e8d81f"
            },
            "v": 0
        },
        {
            "compensated": false,
            "_id": "5fe54d4898ab60a194f38177",
            "status": "pending",
            "type": "slotLinking",
            "senderId": "5fe545702c401e96c551bc72",
            "receiverId": "5fe52dee9be74e7825bc7583",
            "issueDate": "2020-12-25T00:00:00.000Z",
            "departmentId": "5fe4f58a2fc14824c7e8d82c",
            "slotLinking": {
                "_id": "5fe54d4898ab60a194f38178",
                "courseId": "5fe4f81b23904d2c941c65f9",
                "slot": 2,
                "weekDay": 0,
                "locationId": "5fe4f1db2fc14824c7e8d81f"
            },
            "v": 0
        }
    ]
}

53)
Functionality:Accept \slot linking" requests from academic members linked to his/her course.
route: /coordinator/acceptSlotLinking
request type: post
request body:{
    "reqs" : "5fe54d3398ab60a194f3816f"
}
expected response:request accepted

54)
Functionality:.
route:
request type: 
request body:
expected response:

55)
Functionality:reject \slot linking" requests from academic members linked to his/her course..
route:/coordinator/rejectSlotLinking
request type:post 
request body:{
    "reqs" : "5fe54d4898ab60a194f38177"
}
expected response:request rejected

//login with hod to continue testing

56)
Functionality:delete a course instructor for each course in his department.
route:/HOD/delete_course_instructor
request type: put
request body:{"id" : "ac-5", "courseName" : "CSEN703"}
expected response:instructor removed successfully

57)
Functionality:update a course instructor for each course in his department.
route:/HOD/update_course_instructor
request type: put
request body:{"orgId" : "ac-4", "updId" : "ac-5", "courseName" : "CSEN703"}
expected response:update is successful

//login course coordinator

58)
Functionality:delete course slot(s) in his/her course.
route:/coordinator/deleteSlot
request type:post 
request body:{
    "location" : "C7.221" , "weekDay" : 4 , "slot" : 4, "type" : "tutorial"
}
expected response:SLot deleted successfully

//login course instructor

59)
Functionality:Update assignment of academic member in course(s) he/she is assigned to.
route:/instructor/updateSlotAssignment
request type: put
request body:{"course" : "CSEN703", "location" : "C7.221", "academic" : "ac-5", "academic2" : "ac-2", "slot" : 2, "weekDay" : 0, "type" : "tutorial"}
expected response:Assingnment updated successfully

60)
Functionality:delete assignment of academic member in course(s) he/she is assigned to.
route:/instructor/deleteSlotAssignment
request type: put
request body:{"course" : "CSEN703", "location" : "C7.221", "academic" : "ac-2", "slot" : 2, "weekDay" : 0, "type" : "tutorial"}
expected response:Assingnment deleted successfully
//remove academic from a slot only

61)
Functionality:Remove an assigned academic member in course(s) he/she is assigned to.
route:/instructor/deleteAcademic
request type:put 
request body:{"course" : "CSEN703" , "academic" : "ac-5"}
expected response:academic removed successfully
//remove academic from a course *make sure academic not instructor*

//login with an hr to continue testing

62)
Functionality:delete already existing staff members.
route:/hr/deleteStaffMember
request type:put
request body:{"id" : "ac-4"}
expected response:deleted successfully

63)
Functionality:delete a course under a department.
route:/hr/deleteCourse
request type:delete 
request body:{"name" : "CSEN703"}
expected response:deleted successfully

64)
Functionality:delete a department under a faculty.
route:/hr/deleteDepartment
request type: delete
request body:{"name" : "IET"}
expected response:deleted successfully

65)
Functionality:delete a faculty.
route:/hr/deleteFaculty
request type: delete
request body:{"name" : "Medicine"}
expected response:deleted successfully

//delete office locations to be able able to delete location

66)
Functionality:delete a location.
route:/hr/deleteLocation
request type:delete 
request body:{"name" : "C7.221"}
expected response:deleted successfully

66)
Functionality:Log out from the system.
route:/logout
request type: get
request body:
expected response:logged out successfully
//output when using the same token after being destroyed due to loging out
"this token is blackListed please login again"












