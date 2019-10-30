import React from "react";

function CommentEntry({ gameId, isPosting, postComment }) {
  function handleSubmit(event) {
    // Post a comment
    event.preventDefault();
    const formData = new FormData(event.target);
    const comment = formData.get("comment");
    if (comment !== "") { // Only post a comment if the textarea is not empty
      postComment(gameId, formData.get("comment"));
      event.target.reset();
    }
  }

  return (
    <form className="comment-entry" id="comment-entry" onSubmit={handleSubmit}>
      <legend>Comment Entry</legend>
      <fieldset className="comment-textarea-fieldset">
        <textarea
          className="comment-textarea"
          name="comment"
          form="comment-entry"
          rows="4"
          cols="50"
        ></textarea>
      </fieldset>
      <fieldset className="comment-submit-fieldset">
        <button className="comment-submit" type="submit">
          Post comment
        </button>
      </fieldset>
    </form>
  );
}

export default CommentEntry;
