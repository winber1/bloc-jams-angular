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
    var currentAlbum = Fixtures.getAlbum();
    
    var getSongIndex = function(song) 
    { return currentAlbum.songs.indexOf(song); };
      
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
    };
});

// ------ Controllers --------------------------------------
blocJams.controller('AlbumController', ['$scope', 'SongPlayer', 'Fixtures',
                    function($scope, SongPlayer, Fixtures) 
{
    // clean up log ---------------------------
    // 1- remove apply() - (was throwing an error anyhow)
    // 2 - write setVars fcn to set $scope variables for display
    // 3 - change setVars fnc to set $scope vars using SongPlayer.currentSong
    // 4 - remove init of $scope display vars in next and previous fnc's
    // 5- tried to use SongPlayer.currentSong in player_bar.html template - stil doesn't display
    // 6- removed extra public vars from SongPlayer service (songName, songLength, songPlaying)
    
    console.log('AlbumContorller loaded: ',  SongPlayer.test);
    $scope.album = Fixtures.getAlbum();   
    $scope.song = SongPlayer.currentSong;

    // play song
    $scope.play = function (song)  //AlbumController
    {  
        SongPlayer.play(song); 
        setVars();
    }
    
    // pause song
    $scope.pause = function (song)   //AlbumController
    {  
        SongPlayer.pause(song);
        setVars();
    }
    
    $scope.previous = function()  //AlbumController
    { 
        SongPlayer.previous();
        setVars();
    }
    
    $scope.next = function()  //AlbumController
    { 
        SongPlayer.next();
        setVars();
    }
    
    setVars = function()
    {
        $scope.songName = SongPlayer.currentSong.name;
        $scope.songLength = SongPlayer.currentSong.length;
        $scope.songPlaying = SongPlayer.currentSong.playing;
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


// ------ Directives --------------------------------------

blocJams.directive('seekBar', ['$document', function($document) {
     var calculatePercent = function(seekBar, event) {
     var offsetX = event.pageX - seekBar.offset().left;
     var seekBarWidth = seekBar.width();
     var offsetXPercent = offsetX / seekBarWidth;
     offsetXPercent = Math.max(0, offsetXPercent);
     offsetXPercent = Math.min(1, offsetXPercent);
     return offsetXPercent;
    }; 
    
    return {
        templateUrl: '../templates/directives/seek_bar.html',
        replace: true,
        restrict: 'E',
        scope: { },
        link: function(scope, element, attributes) {
             scope.value = 0;
             scope.max = 100;
            
             var seekBar = $(element);
 
             var percentString = function () {
                 var value = scope.value;
                 var max = scope.max;
                 var percent = value / max * 100;
                 return percent + "%";
             };
 
             scope.fillStyle = function() {
                 return {width: percentString()};
             };
            
             scope.thumbStyle = function() {
                 return {left: percentString()};
             };
            
            scope.onClickSeekBar = function(event) {
             var percent = calculatePercent(seekBar, event);
             scope.value = percent * scope.max;
                
console.log("scope.value:" + scope.value);
            };
            
            scope.trackThumb = function() {
     $document.bind('mousemove.thumb', function(event) {
         var percent = calculatePercent(seekBar, event);
         scope.$apply(function() {
             scope.value = percent * scope.max;
                });
            });
 
     $document.bind('mouseup.thumb', function() {
         $document.unbind('mousemove.thumb');
         $document.unbind('mouseup.thumb');
                });
            };
         }  
    };
}]);
