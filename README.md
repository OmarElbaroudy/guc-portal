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