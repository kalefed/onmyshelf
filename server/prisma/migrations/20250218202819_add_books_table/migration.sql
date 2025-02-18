-- CreateTable
CREATE TABLE "Book" (
    "book_id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "read_status" TEXT NOT NULL,
    "rating" INTEGER,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("book_id")
);
