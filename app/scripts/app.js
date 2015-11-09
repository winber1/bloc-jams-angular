var blocJams = angular.module('blocJams', [ui.router]);

// $stateProvider - config app's paths
blocJams.config(function($stateProvider, $locationProvider) 
{
    $locationProvider.html5Mode
    ({
        enabled: true,
        requireBase: false
    });
    
    $stateProvider
        .state('album', 
        {
            url: '/album',
            controller: 'Album.controller',
            templateUrl: '/templates/album.html'
        })
        .state('test', 
        {
            url: '/album',
            controller: 'Album.controller',
            templateUrl: '/templates/album.html'
        });
});