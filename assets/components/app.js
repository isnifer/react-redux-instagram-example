/** @jsx React.DOM */
;(function (window, React, $, Grapnel, undefined) {

  var $main = document.querySelector('.main'),
      $header = $('.header'),
      token = localStorage.accessToken,
      userId = localStorage.userId,
      timelineUrl = 'https://api.instagram.com/v1/users/self/feed?access_token=' + token,
      popularUrl = 'https://api.instagram.com/v1/media/popular/?access_token=' + token,
      loadOnScrollBottom = function(ctx, callback) {
        $(window).off('scroll');
        $(window).on('scroll', function() {
          if($(this).scrollTop() + $(this).height() == $(document).height()) {
            callback.call(ctx, ctx.state.pagination.next_url);
          }  
        });
      };

  /* === ROUTER START === */

  var Router = React.createClass({displayName: 'Router',
    getInitialState: function () {
      return {component: React.createElement("div", null)}
    },
    componentDidMount: function () {
      var self = this;

      this.props.routes.forEach(function (route) {

        var url = route[0];
        var Component = route[1];

        var router = new Grapnel();
        router.get(url, function(req){
          self.setState({ 
            component: React.createElement(Component, {params: req.params}) 
          });    
        });

      });

    },
    render: function () {
      return this.state.component;
    }
  });

  /* === ROUTER END === */

  /* === TIMELINE COMPONENTS START === */

  var Timeline = React.createClass({displayName: 'Timeline',
    getInitialState: function () {
      return {
        data: [],
        pagination: {}
      };
    },

    loadData: function (url) {
      $.ajax({
        url: url|| timelineUrl,
        dataType: 'jsonp',
        success: function (data) {
          this.setState({
            data: this.state.data.concat(data.data),
            pagination: data.pagination
          });
        }.bind(this),
        error: function (err) {
          console.error(err);
        }.bind(this)
      });
    },

    componentDidMount: function () {
      this.loadData();
      
      loadOnScrollBottom(this, this.loadData);
    },

    render: function () {
      return (
        React.createElement("div", {className: "timeline"}, 
          React.createElement(TimelineList, {data: this.state.data})
        )
      );
    }
  });

  var TimelineList = React.createClass({displayName: 'TimelineList',
    render: function () {
      var timelineitem = this.props.data.map(function (picture) {
        return(React.createElement(TimelineItem, {element: picture, user: picture.user, id: picture.id, type: picture.type}));
      });
      return (
        React.createElement("ul", {className: "feed"}, 
          timelineitem
        )
      );
    }
  });

  var TimelineItem = React.createClass({displayName: 'TimelineItem',
    getInitialState: function () {
      return {
        liked: this.props.element.user_has_liked,
        likes: this.props.element.likes.count
      }
    },

    like: function () {
      var action = (this.state.liked) ? 'DELETE' : 'POST';

      // Make current type request
      $.ajax({
        type: 'GET',
        data: {
          "access_token": token,
          "photoId": this.props.id,
          "action": action
        },
        url: '../php/like.php',
        success: function () {
          // Change counter depending on request type
          if(this.state.liked){
            this.setState({liked: false, likes: this.state.likes - 1});
          } else {
            this.setState({liked: true, likes: this.state.likes + 1});
          }
        }.bind(this),
        error: function (err) {
          console.error(err);
        }
      });
    },

    render: function () {
      var element = (this.props.type === 'video') ? 
        React.createElement(TimelineVideo, {src: this.props.element.videos.standard_resolution.url, id: this.props.id}) : 
        React.createElement(TimelinePhoto, {src: this.props.element.images.standard_resolution.url, id: this.props.id, liked: this.props.element.user_has_liked, makeLike: this.like}); 

      return (
        React.createElement("li", {className: "feed__item"}, 
          React.createElement(TimelineUser, {
            liked: this.state.liked, 
            userId: this.props.user.id, 
            username: this.props.user.username, 
            avatar: this.props.user.profile_picture, 
            likes: this.state.likes, 
            photoId: this.props.element.id, 
            like: this.like}
          ), 
          React.createElement("div", {className: "photo"}, 
            element, 
            React.createElement(CommentsList, {comments: this.props.element.comments.data})
          )
        )
      );
    }
  });

  var TimelineUser = React.createClass({displayName: 'TimelineUser',
    render: function() {
      return (
        React.createElement("div", {className: "user g-clf"}, 
          React.createElement("a", {href: '#/profile/' + this.props.userId, className: "user__pic"}, 
            React.createElement("img", {src: this.props.avatar})
          ), 
          React.createElement("span", {className: "user__name"}, this.props.username), 
          React.createElement(LikeHeart, {likes: this.props.likes, liked: this.props.liked, makeLike: this.props.like})
        )
      );
    }
  });

  var LikeHeart = React.createClass({displayName: 'LikeHeart',
    render: function () {
      return (
        React.createElement("span", {className: "user__likes"}, 
          React.createElement("i", {className: this.props.liked ? 'user__like user__like_liked' : 'user__like', onClick: this.props.makeLike}), 
          React.createElement("span", {className: "user__likes-count"}, this.props.likes)
        )
      );
    }
  });

  var TimelinePhoto = React.createClass({displayName: 'TimelinePhoto',
    getInitialState: function () {
      return {liked: this.props.liked};
    },

    render: function () {
      return (
        React.createElement("img", {className: "photo__pic", id: this.props.id, src: this.props.src, onDoubleClick: this.props.makeLike}) 
      );
    }
  });

  var TimelineVideo = React.createClass({displayName: 'TimelineVideo',
    render: function () {
      return (
        React.createElement("video", {className: "photo__pic", id: this.props.id, controls: true}, 
          React.createElement("source", {src: this.props.src})
        )
      );
    }
  });

  var CommentsList = React.createClass({displayName: 'CommentsList',
    render: function() {
      var comment = this.props.comments.map(function (comment) {
        return(React.createElement(CommentsItem, {src: comment.from.profile_picture, authorId: comment.from.id, author: comment.from.username, text: comment.text}));
      }); 
      return (
        React.createElement("ul", {className: "comments"}, 
          comment
        )
      );
    }
  });

  var CommentsItem = React.createClass({displayName: 'CommentsItem',
    render: function() {
      return (
        React.createElement("li", {className: "comments__item"}, 
          React.createElement("img", {src: this.props.src, className: "comments__pic"}), 
          React.createElement("a", {className: "comments__username", href: "#/profile/"}, this.props.author), ": ", 
          React.createElement("span", {className: "comments__text"}, this.props.text)
        )
      );
    }
  });

  /* === TIMELINE COMPONENTS END === */

  /* === SEARCH PHOTOS COMPONENTS START === */

  var SearchPhotos = React.createClass({displayName: 'SearchPhotos',
    getInitialState: function () {
      return {
        data: [],
        pagination: {},
        query: ''
      }
    },
    search: function (e) {
      e.preventDefault();
      var _this = this;
      $.ajax({
        url: 'https://api.instagram.com/v1/tags/' + _this.refs.searchInput.state.value + '/media/recent?&access_token=' + token,
        dataType: 'jsonp',
        success: function (data) {
          if (data.meta.code === 200) {
            this.setState({
              data: data.data,
              pagination: data.pagination
            });
            loadOnScrollBottom(this, this.searchScrollBottom);
          } else {
            this.deniedTag();
          }
        }.bind(this),
        error: function (err) {
          console.error(err);
        }
      });
    },
    searchScrollBottom: function (url) {
      $.ajax({
        url: url,
        dataType: 'jsonp',
        success: function (data) {
          this.setState({
            data: this.state.data.concat(data.data),
            pagination: data.pagination
          });
        }.bind(this),
        error: function (err) {
          console.error(err);
        }
      });
    },
    loadPopular: function (url) {
      $.ajax({
        url: url || popularUrl,
        dataType: 'jsonp',
        success: function (data) {
          this.setState({
            data: this.state.data.concat(data.data),
            pagination: data.pagination
          });
        }.bind(this),
        error: function (err) {
          console.error(err);
        }
      });
    },
    deniedTag: function () {
      this.refs.searchInput.getDOMNode().style.border = '2px solid #f00';
      window.setTimeout(function () {
        this.refs.searchInput.getDOMNode().style.border = 'none';
      }.bind(this), 2000);
    },
    componentDidMount: function () {
      this.loadPopular();
      $(window).off('scroll');
    },
    render: function () {
      return (
        React.createElement("div", {className: "search"}, 
          React.createElement("form", {className: "search__form", onSubmit: this.search}, 
            React.createElement("input", {type: "text", defaultValue: this.state.query, ref: "searchInput", className: "search__input", placeholder: "Search photo by Hashtag"})
          ), 
          React.createElement(ResultList, {searchResult: this.state.data})
        )
      );
    }
  });

  var ResultList = React.createClass({displayName: 'ResultList',
    render: function () {
      var items = this.props.searchResult.map(function (photo) {
        return (
          React.createElement("a", {className: "photo-list__item fancybox", 
             href: photo.images.standard_resolution.url, 
             title: photo.caption && photo.caption.text || ''}, 
            React.createElement("img", {src: photo.images.standard_resolution.url})
          )
        )
      });
      return (
        React.createElement("div", {className: "photo-list"}, 
          items
        )
      );
    }
  });

  /* === SEARCH PHOTOS COMPONENTS END === */
  
  /* === SEARCH USERS COMPONENTS START === */

  var SearchUsers = React.createClass({displayName: 'SearchUsers',
    getInitialState: function () {
      return {
        data: [],
        query: ''
      }
    },
    search: function (e) {
      e.preventDefault();
      var _this = this;
      $.ajax({
        url: 'https://api.instagram.com/v1/users/search?q=' + _this.refs.searchInput.state.value + '&access_token=' + token,
        dataType: 'jsonp',
        success: function (data) {
          if (data.meta.code === 200) {
            this.setState({
              data: data.data
            });
          }
        }.bind(this),
        error: function (err) {
          console.error(err);
        }
      });
    },
    render: function () {
      return (
        React.createElement("div", {className: "search"}, 
          React.createElement("form", {className: "search__form", onSubmit: this.search}, 
            React.createElement("input", {type: "text", defaultValue: this.state.query, ref: "searchInput", className: "search__input", placeholder: "Search by Username"})
          ), 
          React.createElement(PeopleList, {searchResult: this.state.data})
        )
      );
    }
  });

  var PeopleList = React.createClass({displayName: 'PeopleList',
    render: function () {
      var items = this.props.searchResult.map(function (photo) {
        return (
          React.createElement("a", {className: "photo-list__item fancybox", 
             href: '#/profile/' + photo.id, 
             title: photo.username || ''}, 
            React.createElement("img", {src: photo.profile_picture})
          )
        )
      });
      return (
        React.createElement("div", {className: "photo-list"}, 
          items
        )
      );
    }
  });

  /* === SEARCH USERS COMPONENTS END === */
  
  /* === 404 COMPONENTS END === */

  var PageNotFound = React.createClass({displayName: 'PageNotFound',
    render: function () {
      return (
        React.createElement("div", null, "Page not found")
      );
    }
  });

  /* === 404 COMPONENTS END === */
  
  /* === PROFILE COMPONENTS START === */
  
  var Profile = React.createClass({displayName: 'Profile',
    getInitialState: function () {
      return {
        user: {},
        counts: {},
        photos: [],
        pagination: {}
      }
    },
    getProfileData: function () {
      $.ajax({
        url: 'https://api.instagram.com/v1/users/' + this.props.params.id + '?access_token=' + token,
        dataType: 'jsonp',
        success: function (data) {
          this.setState({
            user: data.data,
            counts: data.data.counts
          });
        }.bind(this),
        error: function (err) {
          console.error(err);
        }
      })
    },
    getProfilePhotos: function (url) {
      $.ajax({
        url: url || 'https://api.instagram.com/v1/users/' + this.props.params.id + '/media/recent?access_token=' + token,
        dataType: 'jsonp',
        success: function (data) {
          this.setState({
            photos: this.state.photos.concat(data.data),
            pagination: data.pagination
          });
          loadOnScrollBottom(this, this.getProfilePhotos)
        }.bind(this),
        error: function (err) {
          console.error(err);
        }
      });
    },
    componentDidMount: function () {
      this.getProfileData();
      this.getProfilePhotos();
      $header.find('.profile__link_followers').on('click', function (e) {
        e.preventDefault();
        page(this.getAttribute('href'));
      });
    },
    render: function () {
      var photos = this.state.photos.map(function (photo) {
        return (
          React.createElement("div", {className: "photo-list__item"}, 
            React.createElement("a", {className: "fancybox", href: photo.images.standard_resolution.url}, 
              React.createElement("img", {src: photo.images.low_resolution.url, title: photo.caption && photo.caption.text || ''})
            ), 
            React.createElement(ProfileLikeCounter, {count: photo.likes.count, state: photo.user_has_liked, id: photo.id})
          )
        );
      });
      return (
        React.createElement("div", {className: "profile"}, 
          React.createElement("div", {className: "profile__data"}, 
            React.createElement("div", {className: "profile__photo"}, 
              React.createElement("img", {src: this.state.user.profile_picture, alt: this.state.user.username, className: "profile__picture"})
            ), 
            React.createElement("div", {className: "profile__username"}, this.state.user.username), 
            React.createElement("ul", {className: "profile__stats"}, 
              React.createElement("li", {className: "profile__item"}, 
                React.createElement("span", {className: "profile__count"}, "Photos"), React.createElement("br", null), 
                React.createElement("span", {className: "profile__media-digits"}, this.state.counts.media)
              ), 
              React.createElement("li", {className: "profile__item"}, 
                React.createElement("a", {className: "profile__link_followers", href: '#/profile/' + this.state.user.id + '/followed-by/'}, 
                  React.createElement("span", {className: "profile__count"}, "Followers"), React.createElement("br", null), 
                  React.createElement("span", {className: "profile__followed_by-digits"}, this.state.counts.followed_by)
                )
              ), 
              React.createElement("li", {className: "profile__item"}, 
                React.createElement("a", {className: "profile__link_followers", href: '#/profile/' + this.state.user.id + '/follows/'}, 
                  React.createElement("span", {className: "profile__count profile__count_follow"}, "Follow"), React.createElement("br", null), 
                  React.createElement("span", {className: "profile__follows-digits"}, this.state.counts.follows)
                )
              )
            ), 
            React.createElement("ul", {className: "profile__info"}, 
              React.createElement("li", {className: "profile__item"}, this.state.user.full_name), 
              React.createElement("li", {className: "profile__item"}, this.state.user.bio), 
              React.createElement("li", {className: "profile__item"}, 
                React.createElement("a", {href: this.state.user.website, target: "_blank", className: "profile__url"}, 
                  this.state.user.website
                )
              )
            )
          ), 
          React.createElement("div", {className: "photo-list"}, 
            photos
          )
        )
      );
    }
  });

  var ProfileLikeCounter = React.createClass({displayName: 'ProfileLikeCounter',
    getInitialState: function () {
      return {
        likes: this.props.count,
        liked: this.props.state
      };
    },
    like: function () {
      TimelineItem.prototype.type.prototype.like.call(this);
    },
    render: function () {
      return (
        React.createElement("span", {className: "photo-list__likes", onClick: this.like}, "Likes: ", this.state.likes)
      );
    }
  });

  /* === PROFILE COMPONENTS END === */
  
  /* === ABOUT COMPONENTS START === */
  
  var About = React.createClass({displayName: 'About',
    render: function () {
      return (
        React.createElement("div", null, "About")
      );
    }
  });

  /* === ABOUT COMPONENTS END === */
  
  /* === FOLLOWERS COMPONENTS START === */
  
  var Followers = React.createClass({displayName: 'Followers',
    getInitialState: function () {
      return {
        followers: [],
        pagination: {}
      }
    },
    getFollowers: function (url) {
      $.ajax({
        url: url || 'https://api.instagram.com/v1/users/' + this.props.params.id + '/' + this.props.params.method + '?access_token=' + token,
        dataType: 'jsonp',
        success: function (data) {
          this.setState({
            followers: this.state.followers.concat(data.data),
            pagination: data.pagination
          });
        }.bind(this),
        error: function (err) {
          console.error(err);
        }
      })
    },
    componentDidMount: function () {
      this.getFollowers();
      loadOnScrollBottom(this, this.getFollowers);
    },
    render: function () {
      var followers = this.state.followers.map(function(follower) {
        return (
          React.createElement("div", {className: "follow__item"}, 
            React.createElement("a", {href: '#/profile/' + follower.id + '/'}, 
              React.createElement("img", {className: "follow__avatar", src: follower.profile_picture}), 
              React.createElement("span", {className: "follow__username"}, "@", follower.username)
            ), 
            React.createElement(RelationshipButton, {id: follower.id})
          )
        );
      });
      return (
        React.createElement("div", {className: "follow"}, 
          React.createElement("header", {className: "follow__header"}, this.props.params.method === 'follows' && 'Follows' || 'Followers'), 
          React.createElement("div", {className: "follow__list"}, 
            followers
          )
        )
      );
    }
  });

  var RelationshipButton = React.createClass({displayName: 'RelationshipButton',
    getInitialState: function () {
      return {status: ''}
    },
    getRelationshipStatus: function (follower, callback) {
      $.ajax({
        url: 'https://api.instagram.com/v1/users/' + this.props.id + '/relationship?access_token=' + token,
        dataType: 'jsonp',
        success: function (data) {
          this.setState({status: data.data.outgoing_status});
        }.bind(this),
        error: function (err) {
          console.error(err);
        }
      });
    },
    changeRelationship: function () {
      $.ajax({
        url: '../php/followMe.php',
        dataType: 'json',
        data: {
          action: this.state.status === 'none' ? 'follow' : 'unfollow', 
          access_token: token, 
          userId: this.props.id
        },
        success: function (data) {
          this.setState({status: data.data.outgoing_status});
        }.bind(this),
        error: function (err) {
          console.error(err);
        }
      });
    },
    componentDidMount: function () {
      this.getRelationshipStatus();
    },
    render: function () {
      return (
        React.createElement("button", {
          className: 'follow__btn ' + (this.state.status === 'none' ? 'follow__btn_read' : 'follow__btn_unread'), 
          onClick: this.changeRelationship}, 
          this.state.status === 'none' ? 'Follow' : 'Unfollow'
        )
      );
    }
  });

  /* === FOLLOWERS COMPONENTS END === */
  
  /* === MENU COMPONENTS START === */

  var Menu = React.createClass({displayName: 'Menu',
    render: function () {
      var links = this.props.links.map(function (link) {
        return (React.createElement("li", {className: "menu__item"}, React.createElement("a", {className: "menu__link", href: (link[1] === 'Profile') ? link[0] + userId + '/' : link[0]}, link[1])));
      });
      return (
        React.createElement("ul", {className: "menu g-clf"}, 
          links
        )
      ); 
    }
  });

  /* === MENU COMPONENTS END === */

  var routes = [
    ['/', Timeline],
    ['/search/photos/?', SearchPhotos],
    ['/search/users/?', SearchUsers],
    ['/profile/:id/?', Profile],
    ['/profile/:id/:method/?', Followers],
    ['/about/', About]
  ];

  var links = [
    ['#/', 'Timeline'],
    ['#/search/photos/', 'Photos'],
    ['#/search/users/', 'People'],
    ['#/profile/', 'Profile'],
    ['#/about/', 'About']
  ];

  React.render(React.createElement(Menu, {links: links}), $header[0]);
  React.render(React.createElement(Router, {routes: routes}), $main);

}(window, window.React, window.jQuery, window.Grapnel));