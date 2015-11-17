var blocJams = angular.module('blocJams', ['ui.router']);

    // albums
    var albumPicasso = 
    {
        name: 'The Colors',
        artist: 'Pablo Picasso',
        albumArtUrl: 'assets/images/album_covers/01.png',
        songCount: 5
    };
 
    // Another Example Album
    var albumMarconi = 
    {
        name: 'The Telephone',
        artist: 'Guglielmo Marconi',
        albumArtUrl: 'assets/images/album_covers/20.png',
        songCount: 5
    };

// $stateProvider 
// $locationProvider- config app's paths
blocJams.config(function($stateProvider, $locationProvider) 
{
    $locationProvider.html5Mode
    ({
        enabled: true,
        requireBase: false
    });
    
    // $stateProvider.state(stateName, stateConfig)
    // stateName -  a unique string that identifies a state 
    // stateConfig - object that defines specific properties of the state
    $stateProvider
        .state('album', 
        {
            url: '/album',
            controller: 'AlbumController',
            templateUrl: '/templates/album.html'
        })
        .state('collection', 
        {
            url: '/collection',
            controller: 'CollectionController',
            templateUrl: '/templates/collection.html'
        })
        .state('landing', 
        {
            url: '/landing',
            controller: 'LandingController',
            templateUrl: '/templates/landing.html'
        });
});


blocJams.controller('AlbumController', ['$scope', function($scope) 
{
    //console.log('AlbumController loaded');
    $scope.landingText = "Turn the music up!";
  
    $scope.addExclamation = function() 
    {
        $scope.landingText += "!";
    };
}]);


blocJams.controller('CollectionController', ['$scope', function($scope) 
{

    
    $scope.albumCollection = angular.copy([albumPicasso, albumMarconi, albumPicasso, albumMarconi, 
            albumPicasso, albumMarconi, albumPicasso, albumMarconi, 
            albumPicasso, albumMarconi, albumPicasso, albumMarconi]);
        
        /*
        [albumPicasso, albumMarconi, albumPicasso, albumMarconi, 
            albumPicasso, albumMarconi, albumPicasso, albumMarconi, 
            albumPicasso, albumMarconi, albumPicasso, albumMarconi];
    */
}]);


blocJams.controller('LandingController', ['$scope', function($scope) 
{
    $scope.landingText = "Turn the music up!";
  
    $scope.addExclamation = function() 
    {
        $scope.landingText += "!";
    };
}]);