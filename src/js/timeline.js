var module = angular.module('timeline', ['ngResource']);

module.factory('Resource', ['$resource', function ($resource) {

    return function (url, params, methods) {

        var defaults = {
            read: {method: 'GET', isArray: false},
            update: {method: 'PUT', isArray: false},
            create: {method: 'POST'}
        };

        methods = angular.extend(defaults, methods);

        var resource = $resource(url, params, methods);

        resource.prototype.$save = function () {
            if (!this.id) {
                return this.$create();
            } else {
                return this.$update();
            }
        };

        return resource;

    }

}]);