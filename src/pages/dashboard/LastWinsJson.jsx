import React, { useEffect, useState } from "react";
import { List } from "semantic-ui-react";
import Reward from "../../utils/BigWins";
import MenuLoader from "../../utils/menuLoader";

import eventBus from "../../services/eventBus";
import RewardStat from "./rewardStat";
import LazyLoad from "react-lazyload";
import axios from "axios";
const getWins = () => {
    const SERVICE_URL_SAVE = "https://gwheelserver.onrender.com";
    //const SERVICE_URL_SAVE = "http://localhost:2525";
    

    return axios({
        url: SERVICE_URL_SAVE + "/lastlist",
        //url: SERVICE_URL_SAVE + "/biglist",
      method:"GET",
     
    });
  };
const ActiveTable = (prop) => {
    const [lastReward, setLastReward] = useState([])
    const handleGetLastReward = async () => {
        try {
            const res = await getWins();
            setLastReward(res.data);
            
        } catch (error) {
            ////console.log(error.message);
            // setLastReward(_bonuses);
            //localStorage.setItem("lastReward", JSON.stringify(_bonuses));
        }
    };

  useEffect(() => {
    handleGetLastReward()
    
    
  }, []);
  
  return (
    <>
      {lastReward.length == 0 ? (
        <MenuLoader />
      ) : (
        <div
          style={{
            paddingLeft: 17,
            marginBottom: 150,
            width: "100%",
            overflow: "hidden",
          }}
        >
         

          {lastReward
            .map(function (bonus, i) {
              return (
                  <div
                    className={bonus?.game + " rewardname"}
                    
                  >
                    <Reward item={bonus} color={false} {...prop} />
                  </div>
               
              );
            })}
        </div>
      )}
    </>
  );
};

export default ActiveTable;
