import React,{useEffect,useState} from "react";

import { Link } from "react-router-dom";
import { Grid, Divider ,Image} from "semantic-ui-react";
import { gameDataMain, gameData, gameDataName } from "../../const";
import GameBox from "../../utils/GameBox";
import { getGamesStatus } from "../../services/public";
const getPropertyNoCase = (obj, prop) => {
   
    try {
       return obj[Object.keys(obj).find(key => key.toLowerCase() === prop.toLowerCase())]
    } catch (error) {
        
    }
   
  };
const GameInbox = (prop) => {
   
    try {
        var defGamesStatus = JSON.parse(localStorage.getItem(  "getGamesStatus"));
      } catch (error) {
        var defGamesStatus = []
      }
    const [sessionmyKey, setSessionmyKey] = useState(defGamesStatus);
    
   
    const handleSession = async () => {
        try {
            const resPoker = await getGamesStatus();
            if (resPoker.status === 200) {
                if (resPoker.data) {
                    setSessionmyKey(resPoker.data);
                    localStorage.setItem("getGamesStatus",JSON.stringify(resPoker.data));
                }
            }
        } catch (error) {}
    };
    useEffect(() => {
        //setMainGame(params.gameId);
        //setsessionmyKey("");

       // if (loginToken?.accessToken && !loginToken?.logout ) {
             handleSession();
        //}
    }, []);
    

    return (
        <>
            <Grid centered reversed="computer tablet mobile" className="gamesbox" columns="equal" style={{ zIndex: 10, position: "relative", paddingBottom: 200 }}>
                <Grid.Row columns={2}>
                <Grid.Column mobile={16} tablet={8} computer={8} >
                        
                        <Link  to={"/games/" + gameDataMain[0]} id={"open" + gameDataMain[0]}><Image src={"/assets/images/games/" + gameDataMain[0]+"-min.jpg"}  fluid    /></Link>
                    </Grid.Column>
                    <Grid.Column mobile={16} tablet={8} computer={8} >
                        
                        <Link  to={getPropertyNoCase(sessionmyKey,gameDataMain[1])?"/games/" + gameDataMain[1]:"#/games/" + gameDataMain[1]} id={"open" + gameDataMain[1]}><Image src={"/assets/images/games/" + gameDataMain[1]+"-min.jpg"}  fluid    /></Link>
                    </Grid.Column>
                    <Grid.Column mobile={16} tablet={8} computer={8} >
                        
                        <Link  to={getPropertyNoCase(sessionmyKey,gameDataMain[2])?"/games/" + gameDataMain[2]:"#/games/" + gameDataMain[2]} id={"open" + gameDataMain[2]}><Image src={"/assets/images/games/" + gameDataMain[2]+"-min.jpg"}  fluid    /></Link>
                    </Grid.Column>
                    <Grid.Column mobile={16} tablet={8} computer={8} >
                        
                        <Link  to={getPropertyNoCase(sessionmyKey,gameDataMain[3])?"/games/" + gameDataMain[3]:"#/games/" + gameDataMain[3]} id={"open" + gameDataMain[3]}><Image src={"/assets/images/games/" + gameDataMain[3]+"-min.jpg"}  fluid    /></Link>
                    </Grid.Column>
                    <Grid.Column mobile={16} tablet={8} computer={8} >
                        
                        <Link  to={getPropertyNoCase(sessionmyKey,gameDataMain[4])?"/games/" + gameDataMain[4]:"#/games/" + gameDataMain[4]} id={"open" + gameDataMain[4]}><Image src={"/assets/images/games/" + gameDataMain[4]+"-min.jpg"}  fluid    /></Link>
                    </Grid.Column>
                    <Grid.Column mobile={16} tablet={8} computer={8} >
                        
                        <Link  to={getPropertyNoCase(sessionmyKey,gameDataMain[5])?"/games/" + gameDataMain[5]:"#/games/" + gameDataMain[5]} id={"open" + gameDataMain[5]}><Image src={"/assets/images/games/" + gameDataMain[5]+"-min.jpg"}  fluid    /></Link>
                    </Grid.Column>
                    

                </Grid.Row>
                <Grid.Row columns={4}>
                    {gameData.map((submenu, i) => {
                        try {
                            var game = submenu.toLowerCase();
                        //console.log(game,sessionmyKey[game]);
                       
                        return (
                            <Grid.Column mobile={8} tablet={8} computer={4}  key={i}>
                                <Link  id={"open" + submenu} to={sessionmyKey[game]?"/games/" + submenu:"#/games/" + submenu} className="mini"><Image src={"/assets/images/games/" +submenu.toLowerCase()+".jpg"}  fluid /></Link>
                               
                            </Grid.Column>
                        );
                        } catch (error) {
                            var game = submenu.toLowerCase();
                        console.log(game,sessionmyKey);
                       
                        return <></>;
                        }
                        
                    
                    })}
                </Grid.Row>
            </Grid>
        </>
    );
};

export default GameInbox;
