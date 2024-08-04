import React, { useEffect, useState, useContext } from "react";
import { Button, Form } from "semantic-ui-react";

import Swal from "sweetalert2";
import $ from "jquery";
import { notification } from "../../services/admin";
import { doCurrency } from "../../const";
import { adminPostService } from "../../services/admin";
function Admin(prop) {
  const [cashUser, setCashUser] = React.useState("hangover2");
  const [cashLoad, setCashLoad] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = React.useState("CRoyale7");
  const [title, setTitle] = React.useState("");
  const [image, setImage] = React.useState("");
  const [notMessage, setNotMessage] = React.useState("");
  const siteInfo = prop.siteInfo;
  const loginToken = prop.loginToken;
  siteInfo?.galaxyPassSet?.sort((a, b) => (a.id > b.id ? 1 : -1));

  const setNotTitleVal = (e) => {
    setTitle(e.target.value);
  };

  const sendNot = (e, data) => {
    var notification2 = {
      username: title,
    };
    addGift(notification2);
  };
  const addGift = async (data) => {
    setLoading(true);
    try {
      const res = await adminPostService(data, "makeUserAddRunnerList");
      if (res.status == 200) {
        setLoading(false);
      } else {
        Alert("متاسفم...!", res.data.message, "error");
      }
    } catch (error) {}
  };

  return (
    <>
      <Form>
        <Form.Field>
          <label>UserNames</label>
          <textarea value={title} onChange={setNotTitleVal} />
        </Form.Field>
        <Button onClick={sendNot} loading={loading}>
          Add
        </Button>
      </Form>
      <div id="invres"></div>
    </>
  );
}

export default Admin;
