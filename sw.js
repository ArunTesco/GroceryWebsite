'use strict';

self.addEventListener('install', function(event) {
  self.skipWaiting();
  console.log('Installed', event);
});

self.addEventListener('activate', function(event) {
  console.log('Activated', event);
});

var YAHOO_WEATHER_API_ENDPOINT = 'https://a743383d.ngrok.io/api/v1/promotions';

function showNotification(title, body, icon, data) {
  console.log('showNotification');
  // Firefox has an issue with showing a notification with the icon from
  // the Yaho API
  // (i.e. http://l.yimg.com/a/i/brand/purplelogo//uh/us/news-wea.gif)
  // HTTP, CORs or Size issue.
  var notificationOptions = {
    body: body,
    icon: icon ? icon : '/images/touch/chrome-touch-icon-192x192.png',
    tag: 'simple-push-demo-notification',
    data: data
  };
  return self.registration.showNotification(title, notificationOptions);
}

self.addEventListener('push', function(event) {
  console.log('Received a push message', event);
  if (event.data) {
    console.log('message data', event.data);
    console.log('message data', event.data.text);
    var output = event.data.text();
    console.log(output);
  }

  // Since this is no payload data with the first version
  // of Push notifications, here we'll grab some data from
  // an API and use it to populate a notification
  event.waitUntil(
    fetch(YAHOO_WEATHER_API_ENDPOINT)
      .then(function(response) {
        if (response.status !== 200) {
          // Throw an error so the promise is rejected and catch() is executed
          throw new Error('Invalid status code from weather API: ' +
            response.status);
        }

        // Examine the text in the response
        return response.json();
      })
      .then(function(data) {
        console.log('Weather API data: ', data);
        if (data === null) {
          // Throw an error so the promise is rejected and catch() is executed
          throw new Error();
        }

        var title = data.promotion.title;
        var message = data.promotion.description;
        var icon = data.promotion.imageUrl ||
          'images/touch/chrome-touch-icon-192x192.png';

        // Add this to the data of the notification
        var urlToOpen = data.promotion.page;

        var notificationFilter = {
          tag: 'simple-push-demo-notification'
        };

        var notificationData = {
          url: urlToOpen
        };

        if (!self.registration.getNotifications) {
          return showNotification(title, message, icon, notificationData);
        }

        // Check if a notification is already displayed
        return self.registration.getNotifications(notificationFilter)
          .then(function(notifications) {
            if (notifications && notifications.length > 0) {
              // Start with one to account for the new notification
              // we are adding
              var notificationCount = 1;
              for (var i = 0; i < notifications.length; i++) {
                var existingNotification = notifications[i];
                if (existingNotification.data &&
                  existingNotification.data.notificationCount) {
                  notificationCount +=
                    existingNotification.data.notificationCount;
                } else {
                  notificationCount++;
                }
                existingNotification.close();
              }
              message = 'You have ' + notificationCount +
                ' updates.';
              notificationData.notificationCount = notificationCount;
            }

            return showNotification(title, message, icon, notificationData);
          });
      })
      .catch(function(err) {
        console.error('A Problem occured with handling the push msg', err);

        var title = 'An error occured';
        var message = 'We were unable to get the information for this ' +
          'push message';

        return showNotification(title, message);
      })
  );
});

self.addEventListener('notificationclick', function(event) {
  console.log('Notification click: tag', event.notification.tag);
  // Android doesn't close the notification when you click it
  // See http://crbug.com/463146
  event.notification.close();
  var url = event.notification.data.url;
  // Check if there's already a tab open with this URL.
  // If yes: focus on the tab.
  // If no: open a tab with the URL.
  event.waitUntil(
    clients.matchAll({
      type: 'window'
    })
    .then(function(windowClients) {
      console.log('WindowClients', windowClients);
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        console.log('WindowClient', client);
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
