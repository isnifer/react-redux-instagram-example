/** @jsx React.DOM */
;(function (window, React, $, undefined) {

  var $main = document.querySelector('.main'),
      token = localStorage.accessToken,
      timelineUrl = 'https://api.instagram.com/v1/users/self/feed?access_token=' + token;

  var Timeline = React.createClass({
    getInitialState: function () {
      return {data: []};
    },

    loadData: function () {
      $.ajax({
        url: this.props.url,
        dataType: 'jsonp',
        success: function (data) {
          this.setState({data: data.data});
        }.bind(this),
        error: function (err) {
          console.error(err);
        }.bind(this)
      });
    },

    componentDidMount: function () {
      this.loadData();
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
            "photoId": this.props.photoId,
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
          <LikeHeart likes={this.props.likes} liked={this.props.liked} photoId={this.props.photoId} makeLike={this.props.like} />
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

  React.renderComponent(<Timeline url={timelineUrl} />, $main);

}(window, window.React, window.jQuery));