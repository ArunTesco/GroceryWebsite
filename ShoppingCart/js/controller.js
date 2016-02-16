'use strict';

// the storeController contains two objects:
// - store: contains the product list
// - cart: the shopping cart object
function storeController($scope, $routeParams, DataService,$cookieStore,$location) {

    var authCookie = $cookieStore.get('auth');
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

        if(email=="knighthack@yahoo.com" && password=="password"){
           $cookieStore.put('auth', {"email":email});
           $location.path( "/store" );
        }
    }
}
