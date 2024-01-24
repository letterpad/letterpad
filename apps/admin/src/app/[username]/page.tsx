export default function Page({ params }: { params: { username: string } }) {
  return <div>My Post: {decodeURIComponent(params.username)}</div>;
}
