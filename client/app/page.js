import CurrentlyReading from "../components/CurrentlyReading/CurrentlyReading";
import ToBeRead from "../components/ToBeRead/ToBeRead";
import BookFormModal from "../components/AddBookForm/BookFormModal";
import UpNext from "@/components/UpNext/UpNext";
import WantToRead from "@/components/WantToRead/WantToRead";

export default async function Home({ searchParams }) {
  const { showModal } = await searchParams;

  return (
    <main className="mt-10">
      <header>
        <h1 className="text-2xl text-center font-semibold">
          Welcome back, Kaleigh
        </h1>
      </header>

      {/* Dashboard */}
      <section className="grid grid-cols-4 gap-4 grid-rows-6 mt-10 mx-4">
        {/* Metric summary cards */}
        <section className="col-start-1 col-span-4 grid grid-cols-subgrid">
          <article className="bg-white rounded-xl p-4">
            <h3 className="text-lg font-semibold">Reading Challenge</h3>
          </article>
          <div className="bg-white rounded-xl col-span-2 p-4">
            <h3 className="text-lg font-semibold">Reading Streak</h3>
          </div>
          <div className="bg-white rounded-xl p-4">
            <h3 className="text-lg font-semibold">Stats</h3>
          </div>
        </section>

        {/* Currently Reading */}
        <section className="bg-white rounded-xl row-span-3 row-start-2 col-start-1 p-4">
          <h3 className="text-lg font-semibold mb-4">Currently Reading</h3>
          <CurrentlyReading />
        </section>

        {/* Up Next */}
        <section className="bg-white rounded-xl row-span-3 row-start-2 col-start-2 p-4">
          <h3 className="text-lg font-semibold mb-4">Up Next</h3>
          <UpNext />
        </section>

        {/* Reading Stats Overview */}
        <section className="bg-white rounded-xl col-span-2 row-span-6 row-start-2 col-start-3 p-4">
          <h3 className="text-lg font-semibold mb-4">Reading Stats</h3>
        </section>

        {/* Want to Read */}
        <section className="bg-white rounded-xl col-span-2 row-span-3 col-start-1 row-start-5 p-4">
          <h3 className="text-lg font-semibold mb-4">Want to Read</h3>
          <WantToRead />
        </section>
      </section>

      {/* Modal */}
      {showModal && <BookFormModal />}
    </main>
  );
}
