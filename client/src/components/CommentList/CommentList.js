import CommentItem from "../CommentItem";

export default function CommentList({ comments }) {
  return (
    <div className="d-flex flex-column align-items-center">
      {comments.length === 0 && <p>There are no comments.</p>}
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
