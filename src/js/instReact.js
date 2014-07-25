/** @jsx React.DOM */
;(function (window, React, $, undefined) {

  var $main = document.querySelector('.main'),
      timelineUrl = 'https://api.instagram.com/v1/users/self/feed?access_token=' + localStorage.accessToken;

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
        return(<TimelineItem element={picture} id={picture.id} type={picture.type} />);
      });
      return (
        <ul className="feed">
          {timelineitem}
        </ul>
      );
    }
  });

  var TimelineItem = React.createClass({
    render: function () {
      var element = (this.props.type === 'video') ? 
        <TimelineVideo src={this.props.element.videos.standard_resolution.url} id={this.props.id} /> : 
        <TimelinePhoto src={this.props.element.images.standard_resolution.url} id={this.props.id} />; 

      return (
        <li className="feed__item">
          <div className="photo">
            {element}
            <CommentsList comments={this.props.element.comments.data} />
          </div>
        </li>
      );
    }
  });

  var TimelinePhoto = React.createClass({
    render: function () {
      return (
        <img className="photo__pic" id={this.props.id} src={this.props.src} /> 
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