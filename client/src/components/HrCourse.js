import NavBar from "./NavBar";
import React, { component, useEffect, useState } from "react";
import { hrFetcher } from "../API/hrFetcher";
import { GetUser } from "./GlobalState";
import "bootstrap/dist/css/bootstrap.css";
import HrCourseTemp from "./HrCourseTemp";

const HrCourse = () => {
    const { user } = GetUser();
    const [ course,setCourse ]=useState([])

    useEffect(()=>{
        const data = async () => {
            try {
              const res = await hrFetcher.viewAllCourses( user.token);
              console.log("result "+res)
              setCourse(res);
            } catch (err) {
              console.log(err);
            }
          };
          data();
        }, []);

        const deleteCourse=async (name) => {
            try{
                const res=await hrFetcher.deleteCourse(user.token,name)
                setCourse(res)
            } catch(err){
                console.log(err)
            }
        }
    return(
    <div>
      <NavBar />
      <div class="col-9">
      {
          course.map((obj)=>{
              return <HrCourseTemp  key={obj.id}
              name={obj.name}
              handleDelete={deleteCourse}
              />

          })
      }
      </div>
      
    </div>
   
  )
}

export default HrCourse;