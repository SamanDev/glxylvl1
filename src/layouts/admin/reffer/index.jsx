import React, { useEffect, useState } from "react";
import { Grid,List } from "semantic-ui-react";
import Bonus from "./bonus";

import MenuLoader from "../../../utils/menuLoader";
import NoData from "../../../utils/noData";

import { getRefferService } from "../../../services/report";
const sortObject = {
  dailyPoint: -1,
  level: -1,
  lastLogin: -1,

};

// Get the keys of sortObject.
const sortKeys = Object.keys(sortObject);


const BonusArea = (prop) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const handleGetReports = async () => {
    setLoading(true);
    try {
      const res = await getRefferService();
      if (res.status === 200) {
        var _res = res.data.sort((a, b) => {
          let sorted = 0;
          let index = 0;
        
          // Loop until sorted or until the sort keys have been processed.
          while (sorted === 0 && index < sortKeys.length) {
            const key = sortKeys[index];
            const sortDirection = sortObject[key];
        
            if (a[key] === b[key]) { // If the values are the same, do not change positions.
              sorted = 0;
            } else { // Switch positions if necessary. If b[key] > a[key], multiply by -1 to reverse directions.
              sorted = a[key] > b[key] ? sortDirection : -1 * sortDirection;
            }
        
            index++;
          }
        
          return sorted;
        });
        setData(_res);
      }
      setLoading(false);
    } catch (error) {
      //console.log(error.message);
    }
  };

  useEffect(() => {
    handleGetReports();
  }, []);

  if (loading) {
    return <MenuLoader />;
  } else {
    return (
      <div style={{ margin: "5px 0 5px 0" }} className="bonuslist fadeoutend">
        {data.length > 0 ? (
          <>
            <Grid
              verticalAlign="middle"
              divided="vertically"
              inverted
              padded="vertically"
            >
              {data.map(function (user, i) {
                if (i <= 100) return <Bonus key={i} user={user} {...prop} />;
              })}
            </Grid>
          </>
        ):(
          <>
            <List.Item>
              <List.Content>
                <NoData msg="هیچ کاربری یافت نشد." />
              </List.Content>
            </List.Item>
          </>
        )}
      </div>
    );
  }
};

export default BonusArea;
