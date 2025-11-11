import React, { useEffect, useState } from "react";
import { Divider, List } from "semantic-ui-react";
import Reward from "../../utils/Reward";
import MenuLoader from "../../utils/menuLoader";
import { getRewardsService, getRewardsServicePass } from "../../services/reward";
import RewardStat from "./rewardStat";
import LazyLoad from "react-lazyload";
import NoData from "../../utils/noData";
import LevelIcon from "../../utils/svg";
import LevelBar from "../../utils/GLevelBar";
import { doCurrency } from "../../const";
import $ from "jquery";
var push_apply = Function.apply.bind([].push);
var slice_call = Function.call.bind([].slice);

Object.defineProperty(Array.prototype, "pushArrayMembers", {
    value: function () {
        for (var i = 0; i < arguments.length; i++) {
            var to_add = arguments[i];
            for (var n = 0; n < to_add.length; n += 300) {
                push_apply(this, slice_call(to_add, n, n + 300));
            }
        }
    },
});
const groupBy = (array, key) => {
    // Return the end result
    return array.reduce((result, currentValue) => {
        // If an array already present for key, push it to the array. Else create an array and push the object
        (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
        // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
        return result;
    }, {}); // empty object is the initial value for result object
};
const sumOf = (array) => {
    return array.reduce((sum, currentValue) => {
        var _am = currentValue.amount;
        return sum + _am;
    }, 0);
};
const LevelList = (prop) => {
    const [data, setData] = useState([]);
    const [glis, setGlist] = useState([]);

    const [loading, setLoading] = useState(true);
    const [statData, setstatData] = useState([]);

    const handleGetRewards = async () => {
        setLoading(true);
        try {
            const res = await getRewardsService("", prop.mode, "", prop.mode == "levels" ? 500 : 500, 1);
            if (res.status === 200) {
                const start = new Date();
                start.setDate(1);
                start.setHours(0, 0, 0, 0);

                const end = new Date();
                end.setDate(31);
                end.setHours(23, 59, 59, 999);
                end.getTime();
                start.getTime();

                if (prop.mode == "gpass" || prop.mode == "vip" || prop.mode == "league") {
                    var _data = res.data
                        .filter((item) => {
                            let date = new Date(item.date).getTime();
                            return date >= start && date <= end;
                        })
                        .sort((a, b) => (a.date < b.date ? 1 : -1));
                } else {
                    var _data = res.data.sort((a, b) => (a.date < b.date ? 1 : -1));
                }

                if (_data.length == 0) {
                    start.setMonth(end.getMonth() - 2);
                    end.getTime();
                    start.getTime();

                    _data = res.data
                        .filter((item) => {
                            let date = new Date(item.date).getTime();
                            return date >= start && date <= end;
                        })
                        .sort((a, b) => (a.date < b.date ? 1 : -1));
                }
               
                if (_data.length == 500) {
                    handleGetRewards2(_data,2);
                }else{
                    setData(_data);
                    setLoading(false);
                }
            }
        } catch (error) {
            ////console.log(error.message);
        }
    };
    const handleGetRewards2 = async (data,page) => {
        //setLoading(true);
        try {
            const res = await getRewardsService("", prop.mode, "", prop.mode == "levels" ? 500 : 500, page);
            if (res.status === 200) {
                const start = new Date();
                start.setDate(1);
                start.setHours(0, 0, 0, 0);

                const end = new Date();
                end.setDate(31);
                end.setHours(23, 59, 59, 999);
                end.getTime();
                start.getTime();

                if (prop.mode == "gpass" || prop.mode == "vip" || prop.mode == "league") {
                    var _data = res.data
                        .filter((item) => {
                            let date = new Date(item.date).getTime();
                            return date >= start && date <= end;
                        })
                        .sort((a, b) => (a.date < b.date ? 1 : -1));
                } else {
                    var _data = res.data.sort((a, b) => (a.date < b.date ? 1 : -1));
                }

                if (_data.length == 0) {
                    start.setMonth(end.getMonth() - 2);
                    end.getTime();
                    start.getTime();

                    _data = res.data
                        .filter((item) => {
                            let date = new Date(item.date).getTime();
                            return date >= start && date <= end;
                        })
                        .sort((a, b) => (a.date < b.date ? 1 : -1));
                }
                _data = data.concat(_data);
                
                if (_data.length == page*500 && _data.length < 4000) {
                    handleGetRewards2(_data,(page+1));
                }else{
                    setData(_data);
                setLoading(false);
                }
            }
        } catch (error) {
            ////console.log(error.message);
        }
    };


    const handleGetRewardspass = async () => {
        setLoading(true);
        try {
            const res = await getRewardsServicePass("", prop.mode, "", prop.mode == "levels" ? 500 : 500);
            if (res.status === 200) {
                setData(res.data);
                setLoading(false);
            }
        } catch (error) {
            ////console.log(error.message);
        }
    };
    const siteInfo = prop.siteInfo;
    siteInfo?.galaxyPassSet?.sort((a, b) => (a.id > b.id ? 1 : -1));
    const getpassreward = (lvl) => {
        var totalReward = 0;
        {
            siteInfo.galaxyPassSet.map((x, i) => {
                if (x.level < lvl) {
                    totalReward += x.reward;
                }
            });
        }
        return totalReward;
    };
    useEffect(() => {
        if (prop.mode != "gpass") {
            handleGetRewards();
        } else {
            handleGetRewards(); 
        }
    }, []);

    useEffect(() => {
        var glist = [];
        if (prop.mode != "gpass2") {
            var stat = [];
            if (data.length > 0) {
                var _gmode = groupBy(data, "username");

                for (const property in _gmode) {
                    var psum = sumOf(_gmode[property]);

                    stat.push({
                        sum: psum,
                        username: property,
                        level: _gmode[property][0].userLevel,
                        count: _gmode[property].length,
                        records: _gmode[property],
                    });
                }
            }

            setGlist(data);
            stat.sort((a, b) => (a.sum < b.sum ? 1 : -1));
            setstatData(stat);
        } else {
            var stat = [];
            //console.log(data);

            if (data.length > 0) {
                {
                    data.map((x, i) => {
                        

                        const start = new Date();
                        start.setDate(1);
                        start.setHours(0, 0, 0, 0);
                        //start.setMonth(start.getMonth() - 1);
                        const end = new Date();
                        end.setDate(31);
                        end.setHours(23, 59, 59, 999);
                        end.getTime();
                        start.getTime();

                        var _data = x.userGifts
                            .filter((item) => {
                                let date = new Date(item.date).getTime();
                                return date >= start && date <= end && item.mode == "GPass";
                            })
                            .sort((a, b) => (a.date < b.date ? 1 : -1));
                        if (_data.length == 0) {
                            start.setMonth(end.getMonth() - 2);
                            end.getTime();
                            start.getTime();

                            _data = x.userGifts
                                .filter((item) => {
                                    let date = new Date(item.date).getTime();
                                    return date >= start && date <= end && item.mode == "GPass";
                                })
                                .sort((a, b) => (a.date < b.date ? 1 : -1));
                        }
                        //console.log(_data);
                        var psum = getpassreward(_data.length+1);
                        stat.push({
                            sum: psum,
                            username: x.username,
                            level: x.level,
                            count: _data.length,
                            records: _data,
                        });
                        glist.pushArrayMembers(_data);
                    });
                }
                //console.log(glist);
                setGlist(glist);
                stat.sort((a, b) => (a.sum < b.sum ? 1 : -1));
                setstatData(stat);
            }
        }
    }, [data]);
    var totalReward = 0;

    if (loading && data.length == 0) {
        return (
            <>
                <ul className="mm-listview">
                    <li className="menutitle mm-listitem"></li>
                    <li className="menutitle mm-listitem">
                        <span className="mm-listitem__text">آخرین جوایز</span>
                    </li>
                </ul>
                <MenuLoader />
            </>
        );
    } else {
        if (prop.mode != "gpass2") {
            if (statData.length > 0) {
                return (
                    <>
                        <ul className="mm-listview ">
                            <li className="menutitle mm-listitem"></li>

                            <li className="menutitle mm-listitem">
                                <span className="mm-listitem__text">آخرین جوایز</span>
                            </li>
                        </ul>
                        <ul className={"animated fadeIn mm-listview"}>
                            <RewardStat lastReward={glis} />
                        </ul>
                        <List divided inverted verticalAlign="middle" className="myaccount" style={{ padding: "0 20px" }}>
                            {statData.map((x, i) => {
                                var _lvl = x?.level;
                                var _text = x.username;
                                totalReward += x.sum;
                                return (
                                    <LazyLoad key={i} height={91} className="item">
                                        <List.Item
                                            className={x?.glevel == i + 1 ? " animated fadeIn" : " animated fadeIn"}
                                            key={i}
                                            id={"lvl" + _lvl}
                                            onClick={() => {
                                                $(".user" + x.username).toggleClass("hiddenmenu");
                                                setTimeout(() => {
                                                    $("#bindlastreward").trigger("click");
                                                }, 100);
                                            }}
                                        >
                                            <List.Content floated="right" style={{ width: 110 }}>
                                                <div className="rtl float-end">
                                                    <span className="text-gold">{doCurrency(x?.sum)}</span>{" "}
                                                    <span className="mysmall">
                                                        <small className="farsi">تومان پاداش</small>
                                                    </span>
                                                    <div className="mysmall">
                                                        {doCurrency(totalReward)} <small className="farsi mysmall">مجموع پاداش</small>
                                                    </div>
                                                </div>
                                            </List.Content>
                                            <LevelIcon mode={prop.mode=="gift"?prop.mode+"3":prop.mode} level={x.count} text={x.count + " Record"} classinside="iconinside0" number="" width="38px" />

                                            <span className={"rewardname animated fadeInLeft"} style={{ marginLeft: 10 }}>
                                                <LevelIcon mode="levels" level={x.level} text={x.username} classinside="iconinside0" number="" width="36px" iconamin="swing" />
                                            </span>
                                            <List divided inverted verticalAlign="middle" className="myaccount">
                                                <div style={{ padding: "0 5px 0 20px" }} className={"hiddenmenu ui segment inverted small user" + x.username}>
                                                    {x.records.map((x, i) => {
                                                        var _lvl = 20 - i;
                                                        var _text = x.username;

                                                        return (
                                                            <LazyLoad height={98} throttle={30} overflow key={i}>
                                                                <div className={"rewardname animated fadeIn"} mode={x.mode}>
                                                                    <Reward item={x} {...prop} color={true} />
                                                                </div>
                                                            </LazyLoad>
                                                        );
                                                    })}
                                                </div>
                                            </List>
                                        </List.Item>
                                    </LazyLoad>
                                );
                            })}
                        </List>
                    </>
                );
            }
            return (
                <>
                    <ul className="mm-listview ">
                        <li className="menutitle mm-listitem"></li>

                        <li className="menutitle mm-listitem">
                            <span className="mm-listitem__text">آخرین جوایز</span>
                        </li>

                        <div className={"animated fadeIn"}>
                            <RewardStat lastReward={data} />
                        </div>
                    </ul>
                    <List divided inverted verticalAlign="middle" className="myaccount">
                        {data.length == 0 && (
                            <>
                                <List.Item>
                                    <List.Content>
                                        <NoData msg="هیچ رکوردی یافت نشد." />
                                    </List.Content>
                                </List.Item>
                            </>
                        )}

                        <div style={{ padding: "0 5px 0 20px" }}>
                            {data.map((x, i) => {
                                var _lvl = 20 - i;
                                var _text = x.username;

                                return (
                                    <LazyLoad height={98} throttle={30} overflow key={i}>
                                        <div className={"rewardname animated fadeIn"} mode={x.mode}>
                                            <Reward item={x} {...prop} color={true} />
                                        </div>
                                    </LazyLoad>
                                );
                            })}
                        </div>
                    </List>
                </>
            );
        } else {
            if (statData.length > 0) {
                return (
                    <>
                        <ul className="mm-listview ">
                            <li className="menutitle mm-listitem"></li>

                            <li className="menutitle mm-listitem">
                                <span className="mm-listitem__text">آخرین جوایز</span>
                            </li>
                        </ul>
                        <div className={"animated fadeIn"}>
                            <RewardStat lastReward={glis} />
                        </div>
                        <List divided inverted verticalAlign="middle" className="myaccount" style={{ padding: "0 20px" }}>
                            {statData.map((x, i) => {
                                var _lvl = x?.level;
                                var _text = x.username;
                                totalReward += x.sum;
                                return (
                                    <LazyLoad key={i} height={91} className="item">
                                        <List.Item
                                            className={x?.glevel == i + 1 ? " animated fadeIn" : " animated fadeIn"}
                                            key={i}
                                            id={"lvl" + _lvl}
                                            onClick={() => {
                                                $(".user" + x.username).toggleClass("hiddenmenu");
                                                setTimeout(() => {
                                                    $("#bindlastreward").trigger("click");
                                                }, 100);
                                            }}
                                        >
                                            <List.Content floated="right" style={{ width: 110 }}>
                                                <div className="rtl float-end">
                                                    <span className="text-gold">{doCurrency(x?.sum)}</span>{" "}
                                                    <span className="mysmall">
                                                        <small className="farsi">تومان پاداش</small>
                                                    </span>
                                                    <div className="mysmall">
                                                        {doCurrency(totalReward)} <small className="farsi mysmall">مجموع پاداش</small>
                                                    </div>
                                                </div>
                                            </List.Content>
                                            <LevelIcon mode={prop.mode} level={x.count} text={x.count + " Record"} classinside="iconinside0" number="" width="38px" />

                                            <span className={"rewardname animated fadeInLeft"} style={{ marginLeft: 10 }}>
                                                <LevelIcon mode="levels" level={x.level} text={x.username} classinside="iconinside0" number="" width="36px" iconamin="swing" />
                                            </span>
                                            <List divided inverted verticalAlign="middle" className="myaccount">
                                                <div style={{ padding: "0 5px 0 20px" }} className={"hiddenmenu ui segment inverted small user" + x.username}>
                                                    {x.records.map((x, i) => {
                                                        var _lvl = 20 - i;
                                                        var _text = x.username;

                                                        return (
                                                            <LazyLoad height={98} throttle={30} overflow key={i}>
                                                                <div className={"rewardname animated fadeIn"} mode={x.mode}>
                                                                    <Reward item={x} {...prop} color={true} />
                                                                </div>
                                                            </LazyLoad>
                                                        );
                                                    })}
                                                </div>
                                            </List>
                                        </List.Item>
                                    </LazyLoad>
                                );
                            })}
                        </List>
                    </>
                );
            }
            return (
                <>
                    <ul className="mm-listview ">
                        <li className="menutitle mm-listitem"></li>

                        <li className="menutitle mm-listitem">
                            <span className="mm-listitem__text">آخرین جوایز</span>
                        </li>
                    </ul>
                    <List divided inverted verticalAlign="middle" className="myaccount" style={{ padding: "0 20px" }}>
                        {data.map((x, i) => {
                            var _lvl = x?.glevel;
                            var _text = x.username;
                            if (_lvl > 15) {
                                _lvl = 15;
                            }

                            return (
                                <LazyLoad key={i} height={91} className="item">
                                    <List.Item className={x?.glevel == i + 1 ? " animated fadeIn" : " animated fadeIn"} key={i} id={"lvl" + _lvl}>
                                        <List.Content floated="right" style={{ width: 110 }}>
                                            <div className="rtl float-end">
                                                <span className="text-gold">{getpassreward(x?.glevel)}</span>{" "}
                                                <span className="mysmall">
                                                    <small className="farsi">تومان پاداش</small>
                                                </span>
                                            </div>
                                            <Divider hidden />
                                            <div className="levelbar">
                                                <LevelBar progress {...prop} loginToken={x} />
                                            </div>
                                        </List.Content>
                                        <LevelIcon mode="gpass" level={_lvl} text={"Level " + _lvl} classinside="iconinside0" number="" width="38px" />

                                        <span className={"rewardname animated fadeInLeft"} style={{ marginLeft: 10 }}>
                                            <LevelIcon mode="levels" level={x.level} text={x.username} classinside="iconinside0" number="" width="36px" iconamin="swing" />
                                        </span>
                                    </List.Item>
                                </LazyLoad>
                            );
                        })}
                    </List>
                </>
            );
        }
    }
};

export default LevelList;
