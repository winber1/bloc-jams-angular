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
            controller: 'Album.controller',
            templateUrl: '/templates/album.html'
        })
        .state('collection', 
        {
            url: '/collection',
            controller: 'Collection.controller',
            templateUrl: '/templates/collection.html'
        })
        .state('landing', 
        {
            url: '/landing',
            controller: 'Landing.controller',
            templateUrl: '/templates/landing.html'
        });
});