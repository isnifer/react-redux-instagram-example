var myApp = angular.module('instApp', ['ngRoute', 'ngResource']);
  
myApp.config(function ($routeProvider) {
    // Make routes
    $routeProvider
      // Search
      .when('/search/', {
        templateUrl: '../templates/search.html',
        controller: 'Search'
      })
      // Profile
      .when('/profile/:id', {
        templateUrl: '../templates/profile.html',
        controller: 'Profile'
      })
      // Get Followers
      .when('/profile/:id/followers/', {
        templateUrl: '../templates/followers.html',
        controller: 'Followers'
      })
      // Get Follows
      .when('/profile/:id/follows/', {
        templateUrl: '../templates/follows.html',
        controller: 'Follows'
      })
      // Timeline
      .when('/', {
        templateUrl: '../templates/timeline.html',
        controller: 'Timeline'
      })
      // About
      .when('/about/', {
        templateUrl: '../templates/about.html'
      });
});

// Load Profile
myApp.controller('Profile', function($scope, $http, $routeParams){

    $scope.token = localStorage.getItem('accessToken');
    $scope.userId = localStorage.getItem('userId');

    if (!$routeParams.id){
      $routeParams.id = $scope.userId;
    }

    $http
      .jsonp('https://api.instagram.com/v1/users/' + $routeParams.id + '?access_token=' + $scope.token + '&callback=JSON_CALLBACK')
      .success(function(data){
        $scope.user = data.data;
      });

    // Change Relationship status
    $scope.relationship = function(user){

      if (user.status.outgoing_status === 'none'){
        var action = 'follow';
      } else {
        action = 'unfollow';
      }

        $http({
          method: "GET",
          params: {
            "action": action,
            "access_token": $scope.token,
            "userId": user.id
          },
          url: '../php/followMe.php'
        })
        .success(function(data){
          user.status = data.data;
        });
    };

    $scope.followMe = function(){
      $http({
        method: "GET",
        params: {
          "action": 'follow',
          "access_token": $scope.token,
          "userId": 1980608
        },
        url: '../php/followMe.php'
      })
        .success(function(){});
    };

    // Make Like everywhere it's possible
    $scope.like = function(picture){
      var action;

      // Check if user liked current photo
      if (picture.user_has_liked){
        action = 'DELETE';
      } else {
        action = 'POST'
      }

      // Make current type request
      $http({
          method: 'GET',
          params: {
            "access_token": $scope.token,
            "photoId": picture.id,
            "action": action
          },
          url: '../php/like.php'
        })
        .success(function(){
          // Change counter depending on request type
          if(action === 'POST'){
            picture.user_has_liked = true;
            picture.likes.count = picture.likes.count + 1;
          } else {
            picture.user_has_liked = false;
            picture.likes.count = picture.likes.count - 1;
          }
        });
    };

});

// Search
myApp.controller('Search', function($scope, $resource){

    // Get Popular
    var popular = $resource('https://api.instagram.com/v1/media/popular/?access_token=:token&callback=JSON_CALLBACK', {token: '@token'}, {getPopular: {method: 'jsonp'}});
    
    var popularResponse = popular.getPopular({token: $scope.token}, function () {
        $scope.searchTimeline = popularResponse.data;
    }); 

    // Get Search results
    var search = $resource('https://api.instagram.com/v1/tags/:hashtag/media/recent?&access_token=:token&callback=JSON_CALLBACK', 
      {hashtag: '@hashtag', token: '@token'}, 
      {find: {method: 'jsonp'}});

    $scope.search = function () {
        var searchResponse = search.find({hashtag: $scope.hashtag, token: $scope.token}, function () {
          $scope.searchTimeline = searchResponse.data;  
      });
    };

    // Remove all spaces in hashtag
    $scope.$watch('hashtag', function() {
      if ($scope.hashtag) {
        $scope.hashtag = $scope.hashtag.replace(/\s+/g,'');
      }
    });

});
  
// Timeline Load
myApp.controller('Timeline', function($scope, $http, $resource){

    var timeline = $resource('https://api.instagram.com/v1/users/self/feed?access_token=:token&callback=JSON_CALLBACK', {token: '@token'}, {getTimeline: {method: 'jsonp'}});

    var timelineData = timeline.getTimeline({token: $scope.token}, function () {
        $scope.timeline = timelineData.data;
    });

    loadOnScroll($scope, $http, 'pictures', 'timeline');

});

// Load List of Followers (Читатели)
myApp.controller('Followers', function($scope, $http, $routeParams){

    $http
      .jsonp('https://api.instagram.com/v1/users/' + $routeParams.id + '/' + 'followed-by' + '?access_token=' + $scope.token + '&callback=JSON_CALLBACK')
      .success(function(data){
        $scope.followersData = data;
        $scope.followers = data.data;
        myApp.addStatus($scope, $http);
      });

    myApp.loadOnScroll($scope, $http, 'followersData', 'followers', myApp.addStatus);

});

// Load List of Followees (Я читаю)
myApp.controller('Follows', function($scope, $http, $routeParams){

    $http
      .jsonp('https://api.instagram.com/v1/users/' + $routeParams.id + '/' + 'follows' + '?access_token=' + $scope.token + '&callback=JSON_CALLBACK')
      .success(function(data){
        $scope.followersData = data;
        $scope.followers = data.data;
        myApp.addStatus($scope, $http);
      });

    loadOnScroll($scope, $http, 'followersData', 'followers', myApp.addStatus);

});

// Load Photos on Profile Page
myApp.controller('GetProfilePhotos', function($scope, $http, $routeParams){

    if (!$routeParams.id){
      $routeParams.id = $scope.userId;
    }

    $http
      .jsonp('https://api.instagram.com/v1/users/' + $routeParams.id + '/media/recent?access_token=' + $scope.token + '&callback=JSON_CALLBACK')
      .success(function(data){
        $scope.userPhotoData = data;
        $scope.userPhotos = $scope.userPhotoData.data;
      });

    myApp.loadOnScroll($scope, $http, 'userPhotoData', 'userPhotos');

});

function loadOnScroll ($scope, $http, photoData, photos, addStatus){
  var lastScrollTop = 0;
  window.addEventListener('scroll', function(e){
    var body = document.body,
        scrollTop = body.scrollTop;

    if (scrollTop > lastScrollTop) {
      if (scrollTop >= (body.scrollHeight - window.innerHeight - 50)) {
        $http
          .jsonp($scope[photoData].pagination.next_url + '&callback=JSON_CALLBACK')
          .success(function(data){
            $scope[photoData] = data;
            $scope[photos] = $scope[photos].concat($scope[photoData].data);
            if (addStatus){
              addStatus($scope, $http);
            }
          });
      }
    }
    lastScrollTop = scrollTop;
  });
}

// Add status to global followers array
myApp.addStatus = function($scope, $http){
  angular.forEach($scope.followers, function(value, key){
    $http
      .jsonp('https://api.instagram.com/v1/users/' + $scope.followers[key]["id"] + '/relationship?access_token=' + $scope.token + '&callback=JSON_CALLBACK')
      .success(function(data){
        $scope.followers[key].status = data.data;
      })
  })
};

myApp.config(function($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist(['self','http://*.s3.amazonaws.com/**']);
});
