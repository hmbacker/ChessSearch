import React, { Component } from "react";
import { fetchComments, postComment } from "../../actions";
import { connect } from "react-redux";
import CommentList from "./CommentList";
import CommentEntry from "./CommentEntry";
import "./CommentBox.css";

class CommentBox extends Component {
  componentDidMount() {
    this.props.fetchComments(this.props.gameId);
  }

  render() {
    return (
      <div className="comment-box">
        <CommentEntry
          gameId={this.props.gameId}
          postComment={this.props.postComment}
        />
        <CommentList comments={this.props.comments} />
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    comments: state.comments.comments,
    gameId: ownProps.id
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchComments: gameId => dispatch(fetchComments(gameId)),
    postComment: (gameId, comment) => dispatch(postComment(gameId, comment))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommentBox);
