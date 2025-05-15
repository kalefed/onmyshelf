import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class TokenBlocklist(db.Model):
    __tablename__ = "token-blacklist"

    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, index=True)
    created_at = db.Column(db.DateTime, nullable=False)


class User(db.Model):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(db.String(25), nullable=False, unique=True)
    email: Mapped[str] = mapped_column(db.String(100), nullable=False, unique=True)
    password: Mapped[str] = mapped_column(db.String(255), nullable=False)
    created_at: Mapped[datetime.datetime] = mapped_column(default=db.func.now())
    updated_at: Mapped[datetime.datetime] = mapped_column(
        default=db.func.now(), onupdate=db.func.now()
    )
    # Defining relationships
    user_books: Mapped[list["UserBook"]] = relationship(
        "UserBook", back_populates="user"
    )
    books: Mapped[list["Book"]] = relationship(
        "Book", secondary="user_books", viewonly=True, back_populates="users"
    )

    # Helper functions
    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)


class Book(db.Model):
    __tablename__ = "books"
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(db.String(255), nullable=False)
    author: Mapped[str] = mapped_column(db.String(255), nullable=False)

    # Defining relationships
    user_books: Mapped[list["UserBook"]] = relationship(
        "UserBook", back_populates="book"
    )
    users: Mapped[list["User"]] = relationship(
        "User", secondary="user_books", viewonly=True, back_populates="books"
    )

    def to_dict(self):
        return {"id": self.id, "title": self.title, "author": self.author}


class UserBook(db.Model):
    __tablename__ = "user_books"
    id: Mapped[int] = mapped_column(primary_key=True)
    shelf_type: Mapped[str] = mapped_column(db.String(50), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    book_id: Mapped[int] = mapped_column(ForeignKey("books.id"))
    started_at: Mapped[datetime.datetime] = mapped_column(db.DateTime)
    finished_at: Mapped[datetime.datetime] = mapped_column(db.DateTime)

    # Defining Relationships
    user: Mapped["User"] = relationship("User", back_populates="user_books")
    book: Mapped["Book"] = relationship("Book", back_populates="user_books")

    def to_dict(self):
        return {
            "id": self.id,
            "shelf_type": self.shelf_type,
            "user_id": self.user_id,
            "book_id": self.book_id,
            "started_at": self.started_at,
            "finished_at": self.finished_at,
        }
