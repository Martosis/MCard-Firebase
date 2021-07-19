importScripts("/__/firebase/8.7.1/firebase-app.js");
importScripts("/__/firebase/8.7.1/firebase-messaging.js");
importScripts("/__/firebase/init.js");

firebase.messaging().onBackgroundMessage((payload) => {
	self.registration.showNotification(payload.notification.title, {
		body: payload.notification.body,
	});
});
