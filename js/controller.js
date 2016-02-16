'use strict';

// the storeController contains two objects:
// - store: contains the product list
// - cart: the shopping cart object
function storeController($scope, $routeParams, DataService,$cookieStore,$location) {

var authCookie = $cookieStore.get('auth');

var reg;
var sub;
var isSubscribed = false;

 $scope.init = function(){
    $scope.status = false;
  }
  
  $scope.changeStatus = function(){
    $scope.status = !$scope.status;
    if( $scope.status){
        $scope.subscribe();
    }
    else{
        $scope.unsubscribe();
    }
    
  }


if ('serviceWorker' in navigator) {
  console.log('Service Worker is supported');
  navigator.serviceWorker.register('..//sw.js').then(function(serviceWorkerRegistration) {
    reg = serviceWorkerRegistration;
    
    console.log('Service Worker is ready :^)', reg);
  }).catch(function(error) {
    console.log('Service Worker Error :^(', error);
  });
}



$scope.subscribe = function() {
  reg.pushManager.subscribe({userVisibleOnly: true}).
  then(function(pushSubscription) {
    sub = pushSubscription;
    
    console.log('Subscribed! Endpoint:', sub.endpoint);
    alert(sub.endpoint);
    var res = sub.endpoint.split("/");
    var email = authCookie
    
    var notificationObj = {
        "email":authCookie ? authCookie.email : "",
        "token":res[5]
    }
    DataService.sendClientInfo(notificationObj);
    isSubscribed = true;
  });
}

$scope.unsubscribe = function() {
  sub.unsubscribe().then(function(event) {
    
    console.log('Unsubscribed!', event);
    isSubscribed = false;
  }).catch(function(error) {
    console.log('Error unsubscribing', error);
    
  });
}


    if(!authCookie){
    	$location.path( "/login" );
    }
    else{
        //enableNotification();
    }
    // get store and cart from service
    $scope.store = DataService.store;
    $scope.cart = DataService.cart;

    // use routing to pick the selected product
    if ($routeParams.productSku != null) {
        $scope.product = $scope.store.getProduct($routeParams.productSku);
    }

    
}



//The Login Controller
function loginController($scope, $routeParams, DataService,$cookieStore,$location){
    $scope.Authenticate = function(email, password){

        //if(email=="knighthack@yahoo.com" && password=="password"){
        if(angular.isDefined(email) && angular.isDefined(password)){
           $cookieStore.put('auth', {"email":email});
           $location.path( "/store" );
        }
    }
}
