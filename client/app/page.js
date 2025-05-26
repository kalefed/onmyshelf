import CurrentlyReading from "../components/CurrentlyReading/CurrentlyReading";
import ToBeRead from "../components/ToBeRead/ToBeRead";
import BookFormModal from "../components/AddBookForm/BookFormModal";
import UpNext from "@/components/UpNext/UpNext";
import WantToRead from "@/components/WantToRead/WantToRead";

export default async function Home({ searchParams }) {
  const { showModal } = await searchParams;

  return (
    <main className="mt-20">
      <header>
        <h1 className="text-2xl text-center font-semibold">
          Welcome back, Kaleigh
        </h1>
      </header>
      <section className="grid grid-cols-4 gap-4 grid-rows-6 mt-10 mx-4">
        <section className="bg-white rounded-xl row-span-3 row-start-1 col-start-1 p-4">
          <h3 className="text-lg font-semibold">Currently Reading</h3>
          <CurrentlyReading />
        </section>
        <section className="bg-white rounded-xl row-span-3 row-start-1 col-start-2 p-4">
          <h3 className="text-lg font-semibold">Up Next</h3>
          <UpNext />
        </section>
        <section className="bg-white rounded-xl col-span-2 row-span-6 row-start-1 col-start-3 p-4">
          <h3 className="text-lg font-semibold">Reading Stats</h3>
        </section>
        <section className="bg-white rounded-xl col-span-2 row-span-3 col-start-1 row-start-4 p-4">
          <h3 className="text-lg font-semibold">Want to Read</h3>
          <WantToRead />
        </section>
      </section>
    </main>
  );
}
