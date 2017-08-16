var app = angular.module('myApp', ['uiRouterTitle', 'ui.router']);

app.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider.state('home', {
        url: '',
        data:{
            pageTitle: 'Home'
        },
        template: '<h3>Home Page!</h3>'
    })

});
