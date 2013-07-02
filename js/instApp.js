var myApp = angular
  .module('instApp', [])
  .config(function ($routeProvider){
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
        controller: 'follows'
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
  })
  // Load Profile
  .controller('Profile', function($scope, $http, $routeParams){

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

    // Make Like everywhere it's possible
    $scope.like = function(picture){

      // Check if user liked current photo
      if (picture.user_has_liked){
        var action = 'DELETE';
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

  })
  // Get Popular
  .controller('Search', function($scope, $http, $window){

    $http
      .jsonp('https://api.instagram.com/v1/media/popular/?access_token=' + $scope.token + '&callback=JSON_CALLBACK')
      .success(function(data){
        $scope.searchPhotos = data;
        $scope.searchTimeline = $scope.searchPhotos.data;
      });

    // Search Photo by Hashtag
    $scope.search = function(){
      $http
        .jsonp('https://api.instagram.com/v1/tags/' + $scope.hashtag + '/media/recent?&access_token=' + $scope.token + '&callback=JSON_CALLBACK')
        .success(function(data){
          $scope.searchPhotos = data;
          $scope.searchTimeline = $scope.searchPhotos.data;
        });
    };

    // Remove all spaces in hashtag
    $scope.$watch('hashtag', function() {
      $scope.hashtag = $scope.hashtag.replace(/\s+/g,'');
    });

  })
  // Timeline Load
  .controller('Timeline', function($scope, $http){

    $http
      .jsonp('https://api.instagram.com/v1/users/self/feed?access_token=' + $scope.token + '&callback=JSON_CALLBACK')
      .success(function(data){
        $scope.pictures = data;
        $scope.timeline = $scope.pictures.data;
      });

    // This feature depends on Instagram Developers
    $scope.comment = function(photoId, commentText){
      $http({
        method: "GET",
        params: {
          "access_token": $scope.token,
          "photoId": photoId,
          "text": commentText
        },
        url: '../php/comment.php'
      })
        .success(function(data){
          console.log(data);
        });
    };

    myApp.loadOnScroll($scope, $http, 'pictures', 'timeline');

  })
  // Load List of Followers (Читатели)
  .controller('Followers', function($scope, $http, $routeParams){

    $http
      .jsonp('https://api.instagram.com/v1/users/' + $routeParams.id + '/' + 'followed-by' + '?access_token=' + $scope.token + '&callback=JSON_CALLBACK')
      .success(function(data){
        $scope.followersData = data;
        $scope.followers = data.data;
        myApp.addStatus($scope, $http);
      });

    myApp.loadOnScroll($scope, $http, 'followersData', 'followers', myApp.addStatus);

  })
  // Load List of Followees (Я читаю)
  .controller('follows', function($scope, $http, $routeParams){

    $http
      .jsonp('https://api.instagram.com/v1/users/' + $routeParams.id + '/' + 'follows' + '?access_token=' + $scope.token + '&callback=JSON_CALLBACK')
      .success(function(data){
        $scope.followersData = data;
        $scope.followers = data.data;
        myApp.addStatus($scope, $http);
      });

    myApp.loadOnScroll($scope, $http, 'followersData', 'followers', myApp.addStatus);

  })
  // Load Photos on Profile Page
  .controller('GetProfilePhotos', function($scope, $http, $routeParams){

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

myApp.loadOnScroll = function($scope, $http, photoData, photos, addStatus){
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
            addStatus($scope, $http);
            console.log($scope[photos]);
          });
      }
    }
    lastScrollTop = scrollTop;
  });
};

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