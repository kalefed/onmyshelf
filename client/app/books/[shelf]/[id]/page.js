import Book from "./book";

export default async function Page({ params }) {
  const { shelf, id } = await params;

  return <Book shelf_type={shelf} book_id={id} />;
}
