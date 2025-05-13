importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");
// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
  apiKey: "AIzaSyDZh-vXZhhgP8v1xw2X8jywjOS8SzGvpMQ",
    authDomain: "galaxynotify-261fb.firebaseapp.com",
    projectId: "galaxynotify-261fb",
    storageBucket: "galaxynotify-261fb.firebasestorage.app",
    messagingSenderId: "136379336253",
    appId: "1:136379336253:web:9b6e7c5f13b071cc5c4c54",
    measurementId: "G-6TLCMZDVHQ"
};

try {
  const init = firebase.initializeApp(firebaseConfig);

  // Retrieve firebase messaging
  const messaging = firebase.messaging(init);

  messaging.onBackgroundMessage(function (payload) {
    console.log("Received background message ", payload);

    const notificationTitle = payload.notification.title;
//ssconsole.log(payload.notification);

    const notificationOptions = {
      body: payload.notification.body,
      icon: payload.notification?.image?payload.notification?.image:"/favicon.png",

      dir: "rtl",
      actions: [{ action: "archive", title: "Archive" }],
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
} catch (error) {}
self.addEventListener(
  "notificationclick",
  function (event) {
    if (event.action === "archive") {
      event.notification.close();
    } else {
      clients.openWindow("/");
      event.notification.close();
    }
  },
  false
);
