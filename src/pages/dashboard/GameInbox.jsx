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
    var defGamesStatus
    try {
         defGamesStatus = JSON.parse(localStorage.getItem("getGamesStatus"));
      } catch (error) {
         defGamesStatus = {"id":1,"backgammon":false,"blackjack":true,"blackjack3":false,"blackjackMulti":true,"baccarat":true,"deuceswild":false,"highlow":false,"slotlucky":false,"slotfruits":false,"slotramses":false,"slotarabian":false,"slotsoccer":false,"slotspace":false,"roulette":true,"roulette3d":false,"wheel":true,"wheelMulti":true,"vpjacks":false,"studpoker":false,"boom":false,"bet":true,"asianHandicap":true,"asianHandicapHalf":true,"corners":true,"cornersHalf":true,"overUnder":true,"overUnderHalf":true,"resultHalf":true}
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

        if (!sessionmyKey ) {
             handleSession();
        }
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
                    <Grid.Column mobile={16} tablet={8} computer={8} >
                        
                        <Link  to={getPropertyNoCase(sessionmyKey,gameDataMain[6])?"/games/" + gameDataMain[4]:"/games/" + gameDataMain[6]} id={"open" + gameDataMain[6]}><Image src={"/assets/images/games/" + gameDataMain[6]+"-min.jpg"}  fluid    /></Link>
                    </Grid.Column>
                    <Grid.Column mobile={16} tablet={8} computer={8} >
                        
                        <Link  to={getPropertyNoCase(sessionmyKey,gameDataMain[5])?"/games/" + gameDataMain[7]:"#/games/" + gameDataMain[7]} id={"open" + gameDataMain[7]}><Image src={"/assets/images/games/" + gameDataMain[7]+"-min.jpg"}  fluid    /></Link>
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
                           // var game = submenu.toLowerCase();
                       // console.log(game,sessionmyKey);
                       
                       // return <></>;
                        }
                        
                    
                    })}
                </Grid.Row>
            </Grid>
        </>
    );
};

export default GameInbox;
