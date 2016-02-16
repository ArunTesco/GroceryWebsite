'use strict';

// App Module: the name AngularStore matches the ng-app attribute in the main <html> tag
// the route provides parses the URL and injects the appropriate partial page
var storeApp = angular.module('AngularStore', ['ngCookies']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/login', {
        templateUrl: 'partials/login.htm',
        controller: loginController 
      }).
      when('/store', {
        templateUrl: 'partials/store.htm',
        controller: storeController 
      }).
      when('/products/:productSku', {
        templateUrl: 'partials/product.htm',
        controller: storeController
      }).
      when('/cart', {
        templateUrl: 'partials/shoppingCart.htm',
        controller: storeController
      }).
      otherwise({
        redirectTo: '/login'
      });
}]);

// create a data service that provides a store and a shopping cart that
// will be shared by all views (instead of creating fresh ones for each view).
storeApp.factory("DataService", function ($http) {

   //
   var sendClientInfo= function(userObj){
      //$http.post();

     /* $http.put("https://a743383d.ngrok.io/api/v1/device?us="+Math.random(),userObj)
      .success(function (data,status)
      {
        alert(status);
      })
      .error(function (data, status)
      {
        alert(status);
      });*/

      //jQuery.support.cors=true;

      $.ajax({
        url: 'https://a743383d.ngrok.io/api/v1/device',
        type: 'POST',
        async:false,
        cache:false,
        data: userObj,
        //contentType: "application/json",
        success: function(data) {
          alert("I am subscribed");
        },
        error: function(data){
          alert(JSON.stringify(data));
        }
    });     
      
   };
    // create store
    var myStore = new store();

    // create shopping cart
    var myCart = new shoppingCart("AngularStore");

    // enable PayPal checkout
    // note: the second parameter identifies the merchant; in order to use the 
    // shopping cart with PayPal, you have to create a merchant account with 
    // PayPal. You can do that here:
    // https://www.paypal.com/webapps/mpp/merchant
    myCart.addCheckoutParameters("PayPal", "bernardo.castilho-facilitator@gmail.com");

    // enable Google Wallet checkout
    // note: the second parameter identifies the merchant; in order to use the 
    // shopping cart with Google Wallet, you have to create a merchant account with 
    // Google. You can do that here:
    // https://developers.google.com/commerce/wallet/digital/training/getting-started/merchant-setup
    myCart.addCheckoutParameters("Google", "500640663394527",
        {
            ship_method_name_1: "UPS Next Day Air",
            ship_method_price_1: "20.00",
            ship_method_currency_1: "USD",
            ship_method_name_2: "UPS Ground",
            ship_method_price_2: "15.00",
            ship_method_currency_2: "USD"
        }
    );

    // return data object with store and cart
    return {
        store: myStore,
        cart: myCart,
        sendClientInfo: sendClientInfo
    };
});