import { useEffect, useState } from "react";
import Reward from "../../utils/BigWins";
import MenuLoader from "../../utils/menuLoader";
import $ from "jquery";
import axios from "axios";
const getWins = () => {
    const SERVICE_URL_SAVE = "https://server.wheelofpersia.com/server";
    //const SERVICE_URL_SAVE = "http://localhost:8100/server";
    

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
    handleGetLastReward();
    var timer = setInterval(() => {
      handleGetLastReward();
    }, 10000);
    
    return () => {
clearInterval(timer);
    }
  }, []);
  
  return (
    <>
      {lastReward.length == 0 ? (
        <MenuLoader />
      ) : (
        <div
        className="lastwinsarea"
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
                    className={bonus?.game.replace("777","") + " rewardname"}
                   
                    key={i}
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
