var module = angular.module('services', ['timeline']);

module.factory('Timeline', ['Resource', function ($resource) {
    return $resouce('users/:id', {id: '@id'}); 
}]);