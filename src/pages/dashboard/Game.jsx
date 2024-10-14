import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getPokerSession } from "../../services/auth";

import { Tab, Icon, Dropdown, Dimmer, Loader } from "semantic-ui-react";
import { gameData, gameDataMain, gameDataName, gameDataMainName } from "../../const";
import $ from "jquery";

const getFrameLink = (game) => {
    var link = game;
    if (link == "backgammon") {
        link = "backgammonslobby";
    }
    return link;
};
const Dashboard = (prop) => {
    const navigate = useNavigate();
    const loginToken = prop.loginToken;
    const siteInfo = prop.siteInfo;

    const [sessionKey, setSessionKey] = useState("");

    const handleSession = async () => {
        try {
            const resPoker = await getPokerSession();
            if (resPoker.status === 200) {
                if (resPoker.data.SessionKey) setSessionKey(resPoker.data.SessionKey);
            }
        } catch (error) {}
    };
    const [curPage, setCurPage] = useState("game");
    const [isFull, setIsFull] = useState(false);

    const [screenOrientation, setScreenOrientation] = useState(screen?.orientation?.type);
    const isLandscape = () => window.matchMedia("(orientation:landscape)").matches,
        [orientation, setOrientation] = useState(isLandscape() ? "landscape" : "portrait"),
        onWindowResize = () => {
            clearTimeout(window.resizeLag);
            window.resizeLag = setTimeout(() => {
                delete window.resizeLag;
                // setScreenOrientation(screen?.orientation?.type);
                setScreenOrientation(isLandscape() ? "landscape" : "portrait");
                setOrientation(isLandscape() ? "landscape" : "portrait");
            }, 100);
        };

    useEffect(() => (onWindowResize(), window.addEventListener("resize", onWindowResize), () => window.removeEventListener("resize", onWindowResize)), []);

    var defslide = 1;

    const [gameLoader, setGameLoader] = useState(true);
    const params = useParams();
    const [activeIndex, setActiveIndex] = useState(params.gameId == "poker" ? 0 : 1);
    const [activeIndexLoad, setActiveIndexLoad] = useState(false);
    const [activeSlide, setActiveSlide] = useState(defslide);
    const [gameOptions, setGameOptions] = useState([]);
    const [mainGame, setMainGame] = useState(params.gameId);
    const [secondaryGame, setSecondaryGame] = useState(params.gameId != "poker" ? params.gameId : localStorage.getItem("secondaryGame") ? localStorage.getItem("secondaryGame") : "wheel");

    const handleChange = (e, { value }) => {
        setGameLoader(true);
        setSecondaryGame(value);
        setActiveIndex(1);
        localStorage.setItem("secondaryGame", value);
    };

    const handleRangeChange = () => {
        if (!activeIndexLoad) {
            setGameLoader(true);
        }

        setActiveIndex(activeIndex == 0 ? 1 : 0);
    };
    const handleFullscreen = () => {
        $("body").toggleClass("fullscreen");
        setIsFull((Prev) => !Prev);
        prop.reportWindowSize();
    };

    const handleReload = () => {
        if ($("#pokerframe:visible").length > 0) {
            setSessionKey("");
            handleSession();
        } else {
            $(".framegame:visible").attr("src", $(".framegame:visible").attr("src"));
        }
        setGameLoader(true);
    };
    const removeFrameLoad = () => {
        setGameLoader(false);
        //prop.reportWindowSize();
    };
    const removeFrameLoad2 = () => {
        setGameLoader(false);

        setActiveIndexLoad(true);
    };
    const handleTabChange = (e, { activeIndex }) => setActiveIndex(activeIndex);
    useEffect(() => {
        //setMainGame(params.gameId);
        //setSessionKey("");

        if (loginToken?.accessToken && !loginToken?.logout && mainGame == "poker") {
            // handleSession();
        }
    }, []);
    useEffect(() => {
        if (sessionKey == "") {
            setMainGame("poker");

            // setSessionKey("");
            if (loginToken?.accessToken && !loginToken?.logout && mainGame == "poker") {
                handleSession();
            }
        }
    }, [activeIndex]);

    useEffect(() => {
        let viewportHeight = window.innerHeight;
        if (screenOrientation) {
            if (screenOrientation.indexOf("landscape") > -1 && screenOrientation.indexOf("landscape-") == -1 && window.innerWidth < 1101 && loginToken?.accessToken && !loginToken?.logout) {
                handleFullscreen();
            }
            if (screenOrientation.indexOf("landscape") == -1 && isFull && loginToken?.accessToken && !loginToken?.logout) {
                handleFullscreen();
            }
        }
    }, [screenOrientation]);

    function capitalizeTxt(txt) {
        return txt.charAt(0).toUpperCase() + txt.slice(1); //or if you want lowercase the rest txt.slice(1).toLowerCase();
    }
    try {
        var defGamesStatus = JSON.parse(localStorage.getItem("getGamesStatus"));
    } catch (error) {
        var defGamesStatus = {};
    }

    useEffect(() => {
        var _gameOptions = [];
        {
            gameDataMain.map((gamename, i) => {
                var game = gamename.toLowerCase();
                //console.log(game,defGamesStatus[game],mainGame)
                if ((game != mainGame && i > 0 && (defGamesStatus[game] || typeof defGamesStatus[game] === "undefined")) || game == "wheel") {
                    _gameOptions.push({
                        key: game,
                        text: gameDataMainName[i],
                        value: game,
                    });
                }
            });
        }
        {
            gameData.map((gamename, i) => {
                var game = gamename.toLowerCase();
                if (game != mainGame && i > 0 && defGamesStatus[game]) {
                    _gameOptions.push({
                        key: game,
                        text: gameDataName[i],
                        value: game,
                    });
                }
            });
        }
        setGameOptions(_gameOptions);
        prop.reportWindowSize();
    }, [mainGame]);
    useEffect(() => {
        if (!loginToken?.accessToken || loginToken?.logout) {
            // setCurPage("dashboard");
            prop.setFirstOpen(true);

            navigate("/login");
        } else {
            //snavigate("/");
        }
    }, [prop.isLogin, loginToken]);

    useEffect(() => {
        prop.reportWindowSize();
    }, [gameLoader]);
    useEffect(() => {
        params.gameId == "poker" ? setActiveIndex(0) : setActiveIndex(1);
    }, [params.gameId]);
    const panes = [
        {
            menuItem: "Tab 1",
            pane: (
                <Tab.Pane key="tab1" attached={false}>
                    <div id="gamesec1" className="gamesec panelfull" style={isFull ? { overflowX: "auto", overflowY: "hidden" } : { overflowX: "hidden", overflowY: "hidden" }}>
                        {(gameLoader || sessionKey == "" || !siteInfo?.pokerUrl) && mainGame == "poker" && (
                            <div className={isFull ? "framegame loader fullscreen" : "framegame loader panelfull"}>
                                <Dimmer active>
                                    <Loader className="farsi-inline" size="large">
                                        لطفا صبر کنید...
                                    </Loader>
                                </Dimmer>
                            </div>
                        )}
                        {mainGame == "poker" ? (
                            <>{sessionKey != "" && siteInfo?.pokerUrl && <iframe src={localStorage.getItem("tableName") ? siteInfo.pokerUrl + "?LoginName=" + loginToken?.username + "&SessionKey=" + sessionKey + "&TableType=R&TableName=" + localStorage.getItem("tableName") : siteInfo.pokerUrl + "?LoginName=" + loginToken?.username + "&SessionKey=" + sessionKey} id="pokerframe" className={"framegame"} onLoad={removeFrameLoad}></iframe>}</>
                        ) : (
                            <>
                                {activeIndex == 0 && siteInfo?.gamesUrl && (
                                    <>
                                    
                                        {secondaryGame == "wheel" || gameOptions.length == 0 ? (
                                            <iframe
                                                src={
                                                    siteInfo.gamesUrl +
                                                    //"https://mbj.wheelofpersia.com/" +
                                                    //"http://192.168.1.14:3000/" + 
                                                    loginToken.accessToken + "/" + loginToken.username
                                                }
                                                name="gameframe"
                                                className={"framegame casframe"}
                                                onLoad={removeFrameLoad2}
                                            ></iframe>
                                        ) : (
                                            <>{secondaryGame == "blackjackmulti"  ? (
                                                <iframe
                                                    src={
                                                        siteInfo.gamesUrl.replace("www","mbjui") +
                                                        //"https://mbj.wheelofpersia.com/" +
                                                    //"http://192.168.1.14:3000/" +
                                                        loginToken.accessToken +
                                                        "/" +
                                                        loginToken.username
                                                    }
                                                    name="gameframe"
                                                    className={"framegame casframe"}
                                                    onLoad={removeFrameLoad2}
                                                ></iframe>
                                            ) : (
                                                <iframe src={siteInfo.casinoGamesUrl + "/" + getFrameLink(secondaryGame) + ".html?code=" + loginToken.accessToken + ""}  className={"framegame casframe"} onLoad={removeFrameLoad2}></iframe>
                                            )}</>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </Tab.Pane>
            ),
        },
        {
            menuItem: "Tab 2",
            pane: (
                <Tab.Pane key="tab2" className="active" attached={false}>
                    <div id="gamesec2" className="gamesec" style={isFull ? { overflowX: "auto", overflowY: "hidden" } : { overflowX: "auto", overflowY: "hidden" }}>
                        {(gameLoader || !siteInfo?.gamesUrl) && mainGame == "poker" && (
                            <div className={isFull ? "framegame loader fullscreen" : "framegame loader"}>
                                <Dimmer active>
                                    <Loader className="farsi-inline" size="large">
                                        لطفا صبر کنید...
                                    </Loader>
                                </Dimmer>
                            </div>
                        )}
                        {(activeIndex > 0 || activeIndexLoad) && siteInfo?.gamesUrl && (
                            <>
                                {secondaryGame == "wheel" || gameOptions.length == -1 ? (
                                    <iframe
                                        src={
                                            siteInfo.gamesUrl +
                                            //"https://mbj.wheelofpersia.com/" +
                                            //"http://192.168.1.14:3000/" +
                                            loginToken.accessToken +
                                            "/" +
                                            loginToken.username
                                        }
                                        name="gameframe"
                                        className={"framegame casframe"}
                                        onLoad={removeFrameLoad2}
                                    ></iframe>
                                ) : (
                                    <>{secondaryGame == "blackjackmulti"  ? (
                                        <iframe
                                            src={
                                                siteInfo.gamesUrl.replace("www","mbjui") +
                                                //"https://mbj.wheelofpersia.com/" +
                                                //"http://192.168.1.14:3000/" +
                                                loginToken.accessToken +
                                                "/" +
                                                loginToken.username
                                            }
                                            name="gameframe"
                                            className={"framegame casframe"}
                                            onLoad={removeFrameLoad2}
                                        ></iframe>
                                    ) : (
                                        <iframe src={siteInfo.casinoGamesUrl + "/" + getFrameLink(secondaryGame) + ".html?code=" + loginToken.accessToken + ""}  className={"framegame casframe"} onLoad={removeFrameLoad2}></iframe>
                                    )}</>
                                )}
                            </>
                        )}
                    </div>
                </Tab.Pane>
            ),
        },
    ];

    return (
        <>
            <div className="dashboard_section main_section ">
                {(!gameLoader || 1 == 1) && (
                    <div className="gameicons step2">
                        <Icon
                            circular
                            inverted
                            color="violet"
                            link
                            onClick={() => {
                                prop.setActivePanel(!prop.activePanel);
                            }}
                            style={
                                !isFull
                                    ? {
                                          transform: "translateY(-250px)",
                                          transformOrigin: "center",
                                          opacity: 0,
                                      }
                                    : {
                                          transform: "translateY(-2px)",
                                          transformOrigin: "center",
                                      }
                            }
                        >
                            <i className="fas fa-arrow-left"></i>
                        </Icon>

                        <Icon circular inverted link color="grey" onClick={handleFullscreen}>
                            <i className={isFull ? "fas fa-compress-arrows-alt" : "fas fa-expand-arrows-alt"}></i>
                        </Icon>
                        <Icon circular inverted link color="grey" onClick={handleReload}>
                            <i className="fas fa-sync-alt"></i>
                        </Icon>

                        <Icon
                            circular
                            inverted
                            link
                            color={activeIndex == 0 ? "orange" : "grey"}
                            onClick={handleRangeChange}
                            id="changegame"
                            style={{
                                fontSize: 25,
                                zIndex: 2,
                                right: -10,
                            }}
                        >
                            <i className={activeIndex == 0 ? "fas fa-angle-right" : "fas fa-angle-left"}></i>
                        </Icon>

                        <Dropdown
                            value={secondaryGame}
                            options={gameOptions}
                            selectOnNavigation={false}
                            name="false"
                            direction="left"
                            className="selectgame"
                            style={
                                activeIndex == 0
                                    ? {
                                          transform: "translateY(-350px) translateX(-50px)",
                                          transformOrigin: "center right",
                                          opacity: 0,
                                          zIndex: -10,
                                      }
                                    : {
                                          transform: "translateY(-215px) translateX(-50px)",
                                          transformOrigin: "center right",
                                          zIndex: 10,
                                      }
                            }
                            compact
                            scrolling
                            onChange={handleChange}
                            trigger={
                                <Icon
                                    circular
                                    inverted
                                    link
                                    color="purple"
                                    style={{
                                        transform: "translateX(28px) translateY(28px) ",
                                        transformOrigin: "center right",
                                        display: gameOptions.length > 0 ? "block" : "none",
                                    }}
                                >
                                    <i className="fas fa-angle-double-down"></i>
                                </Icon>
                            }
                        />
                    </div>
                )}
                {curPage == "game" && loginToken?.accessToken && !loginToken?.logout && (
                    <div className="mainsection">
                        <Tab onTabChange={handleTabChange} panes={panes} renderActiveOnly={false} activeIndex={activeIndex} menu={{ attached: false }} />
                    </div>
                )}
            </div>
        </>
    );
};

export default Dashboard;
