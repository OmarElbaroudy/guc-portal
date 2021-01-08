import NavBar from "./NavBar";
import React, { component, useEffect, useState } from "react";
import { hrFetcher } from "../API/hrFetcher";
import { GetUser } from "./GlobalState";
import "bootstrap/dist/css/bootstrap.css";
import HrFacultyTemp from "./HrLocationTemp";

const HrFaculty = () => {
    const { user } = GetUser();
    const [ faculty,setFaculty ]=useState([])

    useEffect(()=>{
        const data = async () => {
            try {
              const res = await hrFetcher.viewAllFaculties( user.token);
              console.log("result "+res)
              setFaculty(res);
            } catch (err) {
              console.log(err);
            }
          };
          data();
        }, []);

        const deleteFaculty=async (name) => {
            try{
                const res=await hrFetcher.deleteFaculty(user.token,name)
                setFaculty(res)
            } catch(err){
                console.log(err)
            }
        }
    return(
    <div>
      <NavBar />
      <div class="col-9">
      {
          faculty.map((obj)=>{
              return <HrFacultyTemp  key={obj.id}
              name={obj.name}
              handleDelete={deleteFaculty}
              />

          })
      }
      </div>
      
    </div>
   
  )
}

export default HrFaculty;