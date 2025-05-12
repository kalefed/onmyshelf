import Image from "next/image";
import CurrentlyReading from "./components/CurrentlyReading";

export default function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      <CurrentlyReading />
    </div>
  );
}
