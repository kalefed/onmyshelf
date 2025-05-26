import Book from "./book";
export default async function Page({ params }) {
  const { id } = await params;

  return <Book shelf_type="currently-reading" book_id={id} />;
}
