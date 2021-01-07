import NavBar from "./NavBar";
import React, { component, useEffect, useState } from "react";
import { hrFetcher } from "../API/hrFetcher";
import { GetUser } from "./GlobalState";
import "bootstrap/dist/css/bootstrap.css";
import HrStaffMemberTemp from "./HrStaffMemberTemp";

const HrStaffMember = () => {
    const { user } = GetUser();
    const [ staff,setStaff ]=useState([])

    useEffect(()=>{
        const data = async () => {
            try {
              const res = await hrFetcher.viewAllStaffMembers( user.token);
              console.log("result "+res)
              setStaff(res);
            } catch (err) {
              console.log(err);
            }
          };
          data();
        }, []);

        const deleteStaff=async (id) => {
            try{
                const res=await hrFetcher.deleteStaffMember(user.token,id)
                setStaff(res)
            } catch(err){
                console.log(err)
            }
        }
    return(
    <div>
      <NavBar />
      <div class="col-9">
      {
          staff.map((obj)=>{
              return <HrStaffMemberTemp  key={obj.id}
              name={obj.name}
              id={obj.id}
              email={obj.email}
              salary={obj.salary}
              office={obj.officeLocationId}
              handleDelete={deleteStaff}
              />

          })
      }
      </div>
      
    </div>
   
  )
}

export default HrStaffMember;
