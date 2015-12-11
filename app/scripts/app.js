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
    
    Fixtures.getCollection = function(numberOfAlbums)
    {   
        var albums = [];
        for (var i=0; i < numberOfAlbums; i++) 
        { albums.push(angular.copy(albumPicasso)); }
        return albums;
    };
        
    return Fixtures;
});

blocJams.service('SongPlayer', function() 
{
    /**
    * @desc song playing
    * @type {Object}
    */
    var currentSong = null;    
    /**
    * @desc Buzz object audio file
    * @type {Object}
    */
    var currentBuzzObject = null;
    
    // -------setSong
    /**
    * @function setSong
    * @desc Stops currently playing song and loads new audio file as currentBuzzObject
    * @param {Object} song
    */
    var setSong = function(song) 
    {
        if (currentBuzzObject) 
        {
            currentBuzzObject.stop();
            currentSong.playing = null;
        }
 
        currentBuzzObject = new buzz.sound(song.audioUrl, 
        { formats: ['mp3'], preload: true });
 
        currentSong = song;
    };
    
    
    /**
    * @function playSong
    * @desc Play current song 
    */
    var playSong = function() 
    {
        currentBuzzObject.play();  
        currentSong.playing = true;
    }
    
    // -------play
    /**
    * @function play
    * @desc Manage song selection click: play or pause
    * @param {Object} song
    */
    this.play = function(song) 
    {   
        if (currentSong !== song) 
        {
            setSong(song);
            playSong();
        }
        else if (currentSong === song) 
        {
            if (currentBuzzObject.isPaused()) 
            {  currentBuzzObject.play();   }
        } 
    };

    // -------pause
    /**
    * @function pause
    * @desc pause currently playing song 
    * @param {Object} song
    */
    this.pause = function(song) 
    {
        currentBuzzObject.pause();
        song.playing = false;
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

    // play song
    $scope.play = function (song) 
    {  SongPlayer.play(song); }
    
    // pause song
    $scope.pause = function (song) 
    {  SongPlayer.pause(song); }
 
}]);


blocJams.controller('CollectionController', ['$scope', 'Fixtures', function($scope, Fixtures) 
{  
    $scope.albums = [];
    $scope.albums = Fixtures.getCollection(12);
}]);


blocJams.controller('LandingController', ['$scope', function($scope) 
{
    $scope.landingText = "Turn the music up!";
  
    $scope.addExclamation = function() 
    {
        $scope.landingText += "!";
    };
}]);


