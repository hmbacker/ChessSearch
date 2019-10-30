import React from "react";

function CommentList({ comments }) {
  return (
    <div className="comment-list">
      {// Render every comment in comments
      comments.map((comment, index) => {
        return (
          <div key={comment.CommentID}>
            <h3 key={comment.CommentID + "date"}>
              {new Date(comment.DateTime).toLocaleString("en-GB", { hour12: false })}
            </h3>
            <p key={comment.CommentID + "comment"}>{comment.Comment}</p>
          </div>
        );
      })}
    </div>
  );
}

export default CommentList;
