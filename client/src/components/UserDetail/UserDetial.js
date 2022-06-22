export default function UserDetail({ user }) {
  return (
    <div className="m-3">
      <h3>Name: {user.name}</h3>
      <h5>Email: {user.email}</h5>
    </div>
  );
}
