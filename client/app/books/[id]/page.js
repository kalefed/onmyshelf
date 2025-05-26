export default async function Page({ params }) {
  const { id } = await params;
  return <div>Book: {id}</div>;
}
