import React, { useEffect, useState } from "react";

import { sendPushToken } from "./services/auth.js";
import { Message, Divider, Button } from "semantic-ui-react";

import { getMessaging, getToken, onMessage } from "firebase/messaging";
import Swal from "sweetalert2";

import { initializeApp } from "firebase/app";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",

  padding: "1.2em",

  customClass: {
    htmlContainer: "farsi",
    timerProgressBar: "bg-gold",
  },
  background: "#000",
  showConfirmButton: false,
  timer: 20000,
  timerProgressBar: true,

  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});
function requestPermission() {
  if (!("Notification" in window)) {
    alert("Notification API not supported!");
    return;
  }

  Notification.requestPermission(function (result) {
    document.getElementById("status").innerText = result;
  });
}
function persistentNotification(not) {
  if (!("Notification" in window) || !("ServiceWorkerRegistration" in window)) {
    alert("Persistent Notification API not supported!");
    return;
  }
  var options = {
    body: not.body,
    icon: not.icon,
    dir: "rtl",
  };
  try {
    navigator.serviceWorker
      .getRegistration()
      .then((reg) => reg.showNotification(not.title, options))
      .catch((err) => alert("Service Worker registration error: " + err));
  } catch (err) {
    alert("Notification API error: " + err);
  }
}
function nonPersistentNotification(not) {
  var options = {
    body: not.body,
    icon: not.icon,
    dir: "rtl",
  };
  if (!("Notification" in window)) {
    alert("Notification API not supported!");
    return;
  }

  try {
    var notification = new Notification(not.title, options);
  } catch (err) {
    alert("Notification API error: " + err);
  }
}
function showNotification(not) {
  var options = {
    body: not.body,
    icon: not.icon,
    dir: "rtl",
  };

  var notification = new Notification(not.title, options);
}
function Active(prop) {
  const [token, setToken] = useState("err");

  const handleResend = () => {
    var firebaseConfig = {
      apiKey: "AIzaSyDZh-vXZhhgP8v1xw2X8jywjOS8SzGvpMQ",
    authDomain: "galaxynotify-261fb.firebaseapp.com",
    projectId: "galaxynotify-261fb",
    storageBucket: "galaxynotify-261fb.firebasestorage.app",
    messagingSenderId: "136379336253",
    appId: "1:136379336253:web:9b6e7c5f13b071cc5c4c54",
    measurementId: "G-6TLCMZDVHQ"
    };
    var token = "";
    try {
      const app = initializeApp(firebaseConfig);
      const messaging = getMessaging(app);

      getToken(messaging, {
        vapidKey:
          "BBY_kxBFhEiYaeMwHAVsfmbPlSsERs6-ngI-wTQq4_w0N5x0MnP584lCLvdMwj36MgBr38teC-MOZ6DWcMVNF-0",
      })
        .then((currentToken) => {
          if (currentToken) {
            // Send the token to your server and update the UI if necessary
            //  console.log("currentToken : " + currentToken);
            //  userService.sendPushToken(currentToken);
            token = currentToken;

            setToken(currentToken);
            localStorage.setItem("notificationAllow", true);
          } else {
            // Show permission request UI
            console.log(
              "No registration token available. Request permission to generate one."
            );
            // setToken("err");
            // ...
          }
        })
        .catch((err) => {
          console.log("An error occurred while retrieving token. ", err);
          setToken("err");
          localStorage.setItem("notificationAllow", true);
          // ...
        });
    } catch (error) {}
  };

  useEffect(() => {
    if (token && token != "err") sendPushToken(token);
  }, [token]);
  useEffect(() => {
    try {
    } catch (e) {
      setToken("err");
    }
    /*  persistentNotification({
      body: "hi",
      icon: "",
      dir: "rtl",
    }); */
  }, []);
  if (token == "err" || 1 == 1) {
    return (
      <>
        <Message
          negative
          onClick={handleResend}
          id="pushactive"
          style={{ cursor: "pointer", display: "none" }}
          as={Button}
        >
          <Message.Header>Turn On Notification and Get Reward</Message.Header>
        </Message>
      </>
    );
  } else {
    return null;
  }
}
export default Active;
