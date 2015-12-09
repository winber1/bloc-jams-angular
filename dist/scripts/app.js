var blocJams = angular.module('blocJams', ['ui.router']);

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
            url: '/',
            controller: 'LandingController',
            templateUrl: '/templates/landing.html'
        });
});


// ------ Services --------------------------------------
blocJams.service('SongPlayer', function() {
    
    //test function
    this.square = function(a) { return a*a };
 
    // play song --------------------------------------------
    this.setSong = function(album, songNumber) 
    {
 
        console.log('in songPlayer - service: in setSong ');
        // stop any existing song; get ready for new song set
        //if (currentSoundFile) { currentSoundFile.stop(); }
    
        //this.currentlyPlayingSongNumber = songNumber;     
        currentSongFromAlbum = album.songs[songNumber - 1];
    
        // buzz api constructor
        currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, 
        {
            formats: [ 'mp3' ],
            preload: true                
        });
        currentSoundFile.play();
        console.log('ispaused:'+ currentSoundFile.isPaused());
        currentSoundFile.setVolume(80);
        console.log('in songPlayer - end - service: in setSong ');
    };

    
});

// ------ Controllers --------------------------------------
blocJams.controller('AlbumController', 
                    function($scope, SongPlayer) 
{
    console.log('AlbumContorller loaded');
    $scope.album = angular.copy(albumPicasso);
    $scope.songNumber = 3;
    
    // test service
    $scope.number = 5;
    //$scope.findSquare = function () 
    //{  $scope.answer = SongPlayer.square($scope.number); }

    // set (play song)
    $scope.playSong = function () 
    {  SongPlayer.setSong($scope.album, $scope.songNumber); }
    
});


blocJams.controller('CollectionController', ['$scope', function($scope) 
{  
    $scope.albums = [];
     for (var i=0; i < 12; i++) 
     {
         $scope.albums.push(angular.copy(albumPicasso));
     }
}]);


blocJams.controller('LandingController', ['$scope', function($scope) 
{
    $scope.landingText = "Turn the music up!";
  
    $scope.addExclamation = function() 
    {
        $scope.landingText += "!";
    };
}]);


