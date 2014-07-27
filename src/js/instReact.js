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

  var Router = React.createClass({
    getInitialState: function () {
      return {component: <div/>}
    },
    componentDidMount: function () {
      var self = this;

      this.props.routes.forEach(function (route) {

        var url = route[0];
        var Component = route[1];

        page(url, function (ctx) {
          self.setState({ 
            component: <Component params={ctx.params} querystring={ctx.querystring} /> 
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

  var Timeline = React.createClass({
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
        <div className="timeline">
          <TimelineList data={this.state.data} />
        </div>
      );
    }
  });

  var TimelineList = React.createClass({
    render: function () {
      var timelineitem = this.props.data.map(function (picture) {
        return(<TimelineItem element={picture} user={picture.user} id={picture.id} type={picture.type} />);
      });
      return (
        <ul className="feed">
          {timelineitem}
        </ul>
      );
    }
  });

  var TimelineItem = React.createClass({
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
        <TimelineVideo src={this.props.element.videos.standard_resolution.url} id={this.props.id} /> : 
        <TimelinePhoto src={this.props.element.images.standard_resolution.url} id={this.props.id} liked={this.props.element.user_has_liked} makeLike={this.like} />; 

      return (
        <li className="feed__item">
          <TimelineUser 
            liked={this.state.liked} 
            userId={this.props.user.id} 
            username={this.props.user.username}
            avatar={this.props.user.profile_picture} 
            likes={this.state.likes}
            photoId={this.props.element.id}
            like={this.like}
          />
          <div className="photo">
            {element}
            <CommentsList comments={this.props.element.comments.data} />
          </div>
        </li>
      );
    }
  });

  var TimelineUser = React.createClass({
    render: function() {
      return (
        <div className="user g-clf">
          <a href={'#/profile/' + this.props.userId} className="user__pic">
            <img src={this.props.avatar} />
          </a>
          <span className="user__name">{this.props.username}</span>
          <LikeHeart likes={this.props.likes} liked={this.props.liked} makeLike={this.props.like} />
        </div>
      );
    }
  });

  var LikeHeart = React.createClass({
    render: function () {
      return (
        <span className="user__likes">
          <i className={this.props.liked ? 'user__like user__like_liked' : 'user__like'} onClick={this.props.makeLike}></i>
          <span className="user__likes-count">{this.props.likes}</span>
        </span>
      );
    }
  });

  var TimelinePhoto = React.createClass({
    getInitialState: function () {
      return {liked: this.props.liked};
    },

    render: function () {
      return (
        <img className="photo__pic" id={this.props.id} src={this.props.src} onDoubleClick={this.props.makeLike} /> 
      );
    }
  });

  var TimelineVideo = React.createClass({
    render: function () {
      return (
        <video className="photo__pic" id={this.props.id} controls>
          <source src={this.props.src}></source>
        </video>
      );
    }
  });

  var CommentsList = React.createClass({
    render: function() {
      var comment = this.props.comments.map(function (comment) {
        return(<CommentsItem src={comment.from.profile_picture} authorId={comment.from.id} author={comment.from.username} text={comment.text} />);
      }); 
      return (
        <ul className="comments">
          {comment}
        </ul>
      );
    }
  });

  var CommentsItem = React.createClass({
    render: function() {
      return (
        <li className="comments__item">
          <img src={this.props.src} className="comments__pic" />
          <a className="comments__username" href="#/profile/">{this.props.author}</a>:&#160;
          <span className="comments__text">{this.props.text}</span>
        </li>
      );
    }
  });

  /* === TIMELINE COMPONENTS END === */

  /* === SEARCH COMPONENTS START === */

  var Search = React.createClass({
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
        <div className="search">
          <form className="search__form" onSubmit={this.search}>
            <input type="text" defaultValue={this.state.query} ref="searchInput" className="search__input"  placeholder="Search photo by Hashtag"/>
          </form>
          <ResultList searchResult={this.state.data} />
        </div>
      );
    }
  });

  var ResultList = React.createClass({
    render: function () {
      var items = this.props.searchResult.map(function (photo) {
        return (
          <a className="photo-list__item fancybox" 
             href={photo.images.standard_resolution.url} 
             title={photo.caption && photo.caption.text || ''}>
            <img src={photo.images.standard_resolution.url} />
          </a>
        )
      });
      return (
        <div className="photo-list">
          {items}  
        </div>
      );
    }
  });

  /* === SEARCH COMPONENTS END === */
  
  /* === 404 COMPONENTS END === */

  var PageNotFound = React.createClass({
    render: function () {
      return (
        <div>Page not found</div>
      );
    }
  });

  /* === 404 COMPONENTS END === */

  var routes = [
    ['/react/', Timeline],
    ['/react/search/', Search],
    ['*', PageNotFound]
  ];

  React.renderComponent(<Router routes={routes} />, $main)

}(window, window.React, window.jQuery, window.page));