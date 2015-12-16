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

blocJams.service('SongPlayer', function(Fixtures) 
{   
    var SongPlayer = this;
    
    this.test = 5;
    this.songName = "";
    this.songLength = "";
    this.songPlaying = false;
    this.cSong = {};
    
    var currentAlbum = Fixtures.getAlbum();
    
     var getSongIndex = function(song) 
     {
        return currentAlbum.songs.indexOf(song);
     };
      
    /**
    * @desc Buzz object audio file
    * @type {Object}
    */
    var currentBuzzObject = null;
    
    /**
    * @desc song playing
    * @type {Object}
    */
    this.currentSong = null;  

    // -------setSong
    /**
    * @function setSong in SongPlayer
    * @desc Stops currently playing song and loads new audio file as currentBuzzObject
    * @param {Object} song
    */
    var setSong = function(song) //SongPlayer service
    {
        if (currentBuzzObject) 
        { stopSong(); }
 
        currentBuzzObject = new buzz.sound(song.audioUrl, 
        { formats: ['mp3'], preload: true });
 
        SongPlayer.currentSong = song;
    };
    
    var stopSong = function()
    {
        currentBuzzObject.stop();
        SongPlayer.currentSong.playing = null;
    }
    
    
    /**
    * @function playSong
    * @desc Play current song 
    */
    var playSong = function() //SongPlayer service
    {
        currentBuzzObject.play();  
        SongPlayer.currentSong.playing = true;
    }
    
    // -------play  //SongPlayer service
    /**
    * @function play
    * @desc Manage song selection click: play or pause
    * @param {Object} song
    */
    this.play = function(song) 
    {   
        song = song || SongPlayer.currentSong;
        if (SongPlayer.currentSong !== song) 
        { setSong(song); }
        playSong();
        
        //this.test++;
        this.songName = song.name;
        this.songPlaying = true;
        //console.log("test:"+this.test+":", this.songName);
    };

    // -------pause   //SongPlayer service
    /**
    * @function pause
    * @desc pause currently playing song 
    * @param {Object} song
    */
    this.pause = function(song) 
    {
        song = song || SongPlayer.currentSong;
        currentBuzzObject.pause();
        SongPlayer.currentSong.playing = false;
        this.songPlaying = false;
        
        this.songName = song.name;
    };
    
    this.previous = function()   //SongPlayer service
    {
        var currentSongIndex = getSongIndex(SongPlayer.currentSong);
        currentSongIndex--;
        
        if (currentSongIndex < 0) 
        {
            currentBuzzObject.stop();
            currentSongIndex = currentAlbum.songs.length-1;
         } 
            
        var song = currentAlbum.songs[currentSongIndex];
        setSong(song);
        playSong(song);
        
        this.songName = song.name;
        this.songPlaying = true;
    };
    
    this.next = function()   //SongPlayer service
    {
        var currentSongIndex = getSongIndex(SongPlayer.currentSong);
        currentSongIndex++;
        
        if (currentSongIndex > currentAlbum.songs.length-1) 
        {
            currentBuzzObject.stop();
            currentSongIndex = 0;
         } 
            
        var song = currentAlbum.songs[currentSongIndex];
        setSong(song);
        playSong(song);
        
        this.songName = song.name;
        this.songPlaying = true;
    };

    this.getTest = function()
    { return test; }
});

// ------ Controllers --------------------------------------
blocJams.controller('AlbumController', ['$scope', 'SongPlayer', 'Fixtures',
                    function($scope, SongPlayer, Fixtures) 
{
    console.log('AlbumContorller loaded: ',  SongPlayer.test);
    $scope.album = Fixtures.getAlbum();   
    $scope.song = SongPlayer.currentSong;
    
    // test service
    //$scope.number = 5;
    //$scope.findSquare = function () 
    //{  $scope.answer = SongPlayer.square($scope.number); }

    // play song
    $scope.play = function (song)  //AlbumController
    {  
        SongPlayer.play(song); 
        //$scope.song = SongPlayer.currentSong;
        //$scope.test1 = SongPlayer.test;
        $scope.songName = SongPlayer.songName;
        $scope.songLength = SongPlayer.currentSong.length;
        $scope.songPlaying = SongPlayer.currentSong.playing;
        $scope.songPlaying = SongPlayer.songPlaying;
        $scope.$apply();
    }
    
    // pause song
    $scope.pause = function (song)   //AlbumController
    {  
        SongPlayer.pause(song);
        $scope.song = song;
        $scope.songName = SongPlayer.songName;
        $scope.songLength = SongPlayer.currentSong.length;
        $scope.songPlaying = SongPlayer.songPlaying;
    }
    
    $scope.previous = function()  //AlbumController
    { 
        $scope.songName = "";
        $scope.songLength = "";
        $scope.songPlaying = "";
        
        SongPlayer.previous();
        $scope.songName = SongPlayer.songName;
        $scope.songLength = SongPlayer.currentSong.length;
        $scope.songPlaying = SongPlayer.songPlaying;
        $scope.$apply();
    }
    
    $scope.next = function()  //AlbumController
    { 
        $scope.songName = "";
        $scope.songLength = "";
        $scope.songPlaying = "";
        
        SongPlayer.next();
        $scope.songName = SongPlayer.songName;
        $scope.songLength = SongPlayer.currentSong.length;
        $scope.songPlaying = SongPlayer.songPlaying;
        //$scope.$apply();
    }
 
}]);

blocJams.controller('PlayerBarCtrl', ['$scope', 'SongPlayer', 'Fixtures',
                    function($scope, SongPlayer, Fixtures) 
{
    console.log('PlayerBarCtrl loaded');
    $scope.previous = function()  //AlbumController
    { SongPlayer.play(song); }
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


