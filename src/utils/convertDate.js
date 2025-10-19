import jMoment from "jalali-moment";
const moment = require("moment");
export const convertDateToJalali = (d, f) => {
  try {
    var date = d.replace("+03:30", "");
  } catch (error) {
    var date = d;
  }
  var _f = "HH:mm";
  if (f) {
    _f = f;
  }
  return (
    <div className="date" title={jMoment(date).format("jYYYY/jMM/jDD")}>
      {moment(date).format("YYYY/MM/DD")}{" "}
      <span className="time">{moment(date).format(_f)}</span>
    </div>
  );
};
