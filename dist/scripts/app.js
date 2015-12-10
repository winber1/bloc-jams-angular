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


// ------ Factories, Services -----------------------------
blocJams.factory('Fixtures', function() 
{
    // song data
 
        var Fixtures = {};
        
        var albumPicasso = 
     {
     name: 'The Colors',
     artist: 'Pablo Picasso',
     label: 'Cubism',
     year: '1881',
     albumArtUrl: 'assets/images/album_covers/01.png',
     songs: [
         { name: 'Blue', length: 161.71, audioUrl: '/assets/music/blue' },
         { name: 'Green', length: 103.96, audioUrl: '/assets/music/green' },
         { name: 'Red', length: 268.45, audioUrl: '/assets/music/red' },
         { name: 'Pink', length: 153.14, audioUrl: '/assets/music/pink' },
         { name: 'Magenta', length: 374.22, audioUrl: '/assets/music/magenta' }
      ]
      };
 
     var albumMarconi = {
         name: 'The Telephone',
         artist: 'Guglielmo Marconi',
         label: 'EM',
         year: '1909',
         albumArtUrl: '/assets/images/album_covers/20.png',
         songs: [
             { name: 'Hello, Operator?', length: '1:01' },
             { name: 'Ring, ring, ring', length: '5:01' },
             { name: 'Fits in your pocket', length: '3:21' },
             { name: 'Can you hear me now?', length: '3:14' },
             { name: 'Wrong phone number', length: '2:15' }
         ]
     };
        
        Fixtures.getAlbum = function() 
        { return albumPicasso; };
        
        return Fixtures;
});

blocJams.service('SongPlayer', function() 
{
    
    //test function
    this.square = function(a) { return a*a };

    // play song -------------------------------------------
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
blocJams.controller('AlbumController', ['$scope', 'SongPlayer', 'Fixtures',
                    function($scope, SongPlayer, Fixtures) 
{
    console.log('AlbumContorller loaded');
    $scope.album = Fixtures.getAlbum();
    //$scope.album = angular.copy(albumPicasso);
    $scope.songNumber = 3;
    
    // test service
    $scope.number = 5;
    //$scope.findSquare = function () 
    //{  $scope.answer = SongPlayer.square($scope.number); }

    // set (play song)
    $scope.playSong = function () 
    {  SongPlayer.setSong($scope.album, $scope.songNumber); }
    
}]);


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


