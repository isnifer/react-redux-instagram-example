/** @jsx React.DOM */
;(function (window, React, $, page, undefined) {

  var $main = document.querySelector('.main'),
      token = localStorage.accessToken,
      links = $('.menu__link'),
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
      return {component: React.DOM.div(null)}
    },
    componentDidMount: function () {
      var self = this;

      this.props.routes.forEach(function (route) {

        var url = route[0];
        var Component = route[1];

        page(url, function (ctx) {
          self.setState({ 
            component: Component({params: ctx.params, querystring: ctx.querystring}) 
          });
        });

      });

      page.start();

      links.on('click', function (e) {
        e.preventDefault();
        page(this.getAttribute('href'));
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
        React.DOM.div({className: "timeline"}, 
          TimelineList({data: this.state.data})
        )
      );
    }
  });

  var TimelineList = React.createClass({displayName: 'TimelineList',
    render: function () {
      var timelineitem = this.props.data.map(function (picture) {
        return(TimelineItem({element: picture, user: picture.user, id: picture.id, type: picture.type}));
      });
      return (
        React.DOM.ul({className: "feed"}, 
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
        TimelineVideo({src: this.props.element.videos.standard_resolution.url, id: this.props.id}) : 
        TimelinePhoto({src: this.props.element.images.standard_resolution.url, id: this.props.id, liked: this.props.element.user_has_liked, makeLike: this.like}); 

      return (
        React.DOM.li({className: "feed__item"}, 
          TimelineUser({
            liked: this.state.liked, 
            userId: this.props.user.id, 
            username: this.props.user.username, 
            avatar: this.props.user.profile_picture, 
            likes: this.state.likes, 
            photoId: this.props.element.id, 
            like: this.like}
          ), 
          React.DOM.div({className: "photo"}, 
            element, 
            CommentsList({comments: this.props.element.comments.data})
          )
        )
      );
    }
  });

  var TimelineUser = React.createClass({displayName: 'TimelineUser',
    render: function() {
      return (
        React.DOM.div({className: "user g-clf"}, 
          React.DOM.a({href: '#/profile/' + this.props.userId, className: "user__pic"}, 
            React.DOM.img({src: this.props.avatar})
          ), 
          React.DOM.span({className: "user__name"}, this.props.username), 
          LikeHeart({likes: this.props.likes, liked: this.props.liked, makeLike: this.props.like})
        )
      );
    }
  });

  var LikeHeart = React.createClass({displayName: 'LikeHeart',
    render: function () {
      return (
        React.DOM.span({className: "user__likes"}, 
          React.DOM.i({className: this.props.liked ? 'user__like user__like_liked' : 'user__like', onClick: this.props.makeLike}), 
          React.DOM.span({className: "user__likes-count"}, this.props.likes)
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
        React.DOM.img({className: "photo__pic", id: this.props.id, src: this.props.src, onDoubleClick: this.props.makeLike}) 
      );
    }
  });

  var TimelineVideo = React.createClass({displayName: 'TimelineVideo',
    render: function () {
      return (
        React.DOM.video({className: "photo__pic", id: this.props.id, controls: true}, 
          React.DOM.source({src: this.props.src})
        )
      );
    }
  });

  var CommentsList = React.createClass({displayName: 'CommentsList',
    render: function() {
      var comment = this.props.comments.map(function (comment) {
        return(CommentsItem({src: comment.from.profile_picture, authorId: comment.from.id, author: comment.from.username, text: comment.text}));
      }); 
      return (
        React.DOM.ul({className: "comments"}, 
          comment
        )
      );
    }
  });

  var CommentsItem = React.createClass({displayName: 'CommentsItem',
    render: function() {
      return (
        React.DOM.li({className: "comments__item"}, 
          React.DOM.img({src: this.props.src, className: "comments__pic"}), 
          React.DOM.a({className: "comments__username", href: "#/profile/"}, this.props.author), ": ", 
          React.DOM.span({className: "comments__text"}, this.props.text)
        )
      );
    }
  });

  /* === TIMELINE COMPONENTS END === */

  /* === SEARCH COMPONENTS START === */

  var Search = React.createClass({displayName: 'Search',
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
      loadOnScrollBottom(this, this.loadPopular);
    },
    render: function () {
      return (
        React.DOM.div({className: "search"}, 
          React.DOM.form({className: "search__form", onSubmit: this.search}, 
            React.DOM.input({type: "text", defaultValue: this.state.query, ref: "searchInput", className: "search__input", placeholder: "Search photo by Hashtag"})
          ), 
          ResultList({searchResult: this.state.data})
        )
      );
    }
  });

  var ResultList = React.createClass({displayName: 'ResultList',
    render: function () {
      var items = this.props.searchResult.map(function (photo) {
        return (
          React.DOM.a({className: "photo-list__item fancybox", 
             href: photo.images.standard_resolution.url, 
             title: photo.caption && photo.caption.text || ''}, 
            React.DOM.img({src: photo.images.standard_resolution.url})
          )
        )
      });
      return (
        React.DOM.div({className: "photo-list"}, 
          items
        )
      );
    }
  });

  /* === SEARCH COMPONENTS END === */
  
  /* === 404 COMPONENTS END === */

  var PageNotFound = React.createClass({displayName: 'PageNotFound',
    render: function () {
      return (
        React.DOM.div(null, "Page not found")
      );
    }
  });

  /* === 404 COMPONENTS END === */

  var routes = [
    ['/react/', Timeline],
    ['/react/search/', Search],
    ['*', PageNotFound]
  ];

  React.renderComponent(Router({routes: routes}), $main)

}(window, window.React, window.jQuery, window.page));