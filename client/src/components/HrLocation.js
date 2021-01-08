import NavBar from "./NavBar";
import React, { component, useEffect, useState } from "react";
import { hrFetcher } from "../API/hrFetcher";
import { GetUser } from "./GlobalState";
import "bootstrap/dist/css/bootstrap.css";
import HrLocationTemp from "./HrLocationTemp";

const HrLocation = () => {
    const { user } = GetUser();
    const [ location,setLocation ]=useState([])

    useEffect(()=>{
        const data = async () => {
            try {
              const res = await hrFetcher.viewAllLocations( user.token);
              console.log("result "+res)
              setLocation(res);
            } catch (err) {
              console.log(err);
            }
          };
          data();
        }, []);

        const deleteLocation=async (name) => {
            try{
                const res=await hrFetcher.deleteLocation(user.token,name)
                setLocation(res)
            } catch(err){
                console.log(err)
            }
        }
    return(
    <div>
      <NavBar />
      <div class="col-9">
      {
          location.map((obj)=>{
              return <HrLocationTemp  key={obj.id}
              name={obj.name}
              maxCapacity={obj.maxCapacity}
              handleDelete={deleteLocation}
              />

          })
      }
      </div>
      
    </div>
   
  )
}

export default HrLocation;