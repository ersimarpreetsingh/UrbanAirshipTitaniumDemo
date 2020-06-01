// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};
var UrbanAirship = require('ti.airship');
Alloy.Globals.urbanairship = UrbanAirship;


var user_info = JSON.parse(Ti.App.Properties.getString('user_info'));
UrbanAirship.namedUser = user_info ? user_info.email : '';
UrbanAirship.tags = [ 'yofima' ];
UrbanAirship.userNotificationsEnabled = true;
UrbanAirship.setUserNotificationsEnabled(true);
Ti.API.info("Launch: " + UrbanAirship.getLaunchNotification(true).message);
Ti.API.info("Launch Deep Link: " + UrbanAirship.getDeepLink(true));

if (OS_IOS) {
    Ti.App.addEventListener('resumed', function() {
        Ti.API.info("Launch iOS resumed: " + UrbanAirship.getLaunchNotification(true).message);
    });
}

UrbanAirship.addEventListener(UrbanAirship.EVENT_DEEP_LINK_RECEIVED, function (e) {
    Alloy.Globals.alert("Received deepLink: " + e.deepLink);
});

UrbanAirship.addEventListener(UrbanAirship.EVENT_CHANNEL_UPDATED, function(e) {
    Ti.API.info('Channel Updated: ' + UrbanAirship.channelId);
    Alloy.Globals.push_token = UrbanAirship.channelId;
    if (user_info) {
    	Alloy.Globals.syncAction('setdevice', UrbanAirship.channelId);
    }
});

UrbanAirship.addEventListener(UrbanAirship.EVENT_PUSH_RECEIVED, function(e) {
    Ti.API.info('Push received: ' + e.message);
    Ti.API.info('Extras: ' + JSON.stringify(e.extras));
    if (!Alloy.Globals.messagingwindowopen) {
        Alloy.Globals.alert(e.message);
    } else {
  	    Ti.App.fireEvent('messaging_push_received');
    }
});
