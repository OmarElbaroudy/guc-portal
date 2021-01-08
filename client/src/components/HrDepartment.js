import NavBar from "./NavBar";
import React, { component, useEffect, useState } from "react";
import { hrFetcher } from "../API/hrFetcher";
import { GetUser } from "./GlobalState";
import "bootstrap/dist/css/bootstrap.css";
import HrDepartmentTemp from "./HrDepartmentTemp";

const HrDepartment = () => {
    const { user } = GetUser();
    const [ department,setDepartment ]=useState([])

    useEffect(()=>{
        const data = async () => {
            try {
              const res = await hrFetcher.viewAllDepartments( user.token);
              console.log("result "+res)
              setDepartment(res);
            } catch (err) {
              console.log(err);
            }
          };
          data();
        }, []);

        const deleteDepartment=async (name) => {
            try{
                const res=await hrFetcher.deleteDepartment(user.token,name)
                setDepartment(res)
            } catch(err){
                console.log(err)
            }
        }
    return(
    <div>
      <NavBar />
      <div class="col-9">
      {
          department.map((obj)=>{
              return <HrDepartmentTemp  key={obj.id}
              name={obj.name}
              handleDelete={deleteDepartment}
              />

          })
      }
      </div>
      
    </div>
   
  )
}

export default HrDepartment;