"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useState } from "react";

export default function Home() {
  useEffect(() => {
    console.log("Server URL:", process.env.NEXT_PUBLIC_SERVER_URL); // Log to confirm
    fetch(process.env.NEXT_PUBLIC_SERVER_URL + "/api/users")
      .then((response) => response.json())
      .then((data) => console.log(data));
  }, []);
  return (
    <div className={styles.page}>
      <h1>Home Page</h1>
    </div>
  );
}
