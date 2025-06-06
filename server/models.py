import datetime
from enum import Enum
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey, Enum as SqlEnum, Table
from sqlalchemy.orm import Mapped, mapped_column, relationship
from werkzeug.security import generate_password_hash, check_password_hash
from typing import List

db = SQLAlchemy()


def get_enum_values(enum_class):
    return [member.value for member in enum_class]


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
    shelves: Mapped[list["Shelf"]] = relationship("Shelf", back_populates="user")

    # Helper functions
    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)


class Shelf(db.Model):
    __tablename__ = "shelves"

    id: Mapped[int] = mapped_column(primary_key=True)
    shelf_type: Mapped[str] = mapped_column(db.String(50), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    # Defining Relationships
    user: Mapped["User"] = relationship("User", back_populates="shelves")
    books: Mapped[list["Book"]] = relationship("Book", back_populates="shelf")

    def to_dict(self):
        return {"id": self.id, "shelf_type": self.shelf_type, "user_id": self.user_id}


# Define enums for book model
class FormatType(Enum):
    audiobook = "audiobook"
    physical = "physical"
    ebook = "ebook"


class PurchaseMethod(Enum):
    library = "library"
    gifted = "gifted"
    bought = "bought"


book_genres = Table(
    "book_genres",
    db.metadata,
    db.Column("book_id", db.Integer, db.ForeignKey("books.id"), primary_key=True),
    db.Column("genre_id", db.Integer, db.ForeignKey("genres.id"), primary_key=True),
)


class Genre(db.Model):
    __tablename__ = "genres"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(db.String(50), nullable=False, unique=True)

    books: Mapped[List["Book"]] = relationship(
        "Book", secondary=book_genres, back_populates="genres"
    )


class Book(db.Model):
    __tablename__ = "books"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(db.String(255), nullable=False)
    author: Mapped[str] = mapped_column(db.String(255), nullable=False)
    description: Mapped[str] = mapped_column(db.String(), nullable=True)
    cover_image: Mapped[str] = mapped_column(db.String(255), nullable=True)
    page_count: Mapped[int] = mapped_column(db.Integer, nullable=True)
    shelf_id: Mapped[int] = mapped_column(ForeignKey("shelves.id"), nullable=False)

    format_type: Mapped[FormatType] = mapped_column(
        SqlEnum(FormatType, values_callable=get_enum_values),
        nullable=True,
        default=FormatType.physical,
    )
    purchase_method: Mapped[PurchaseMethod] = mapped_column(
        SqlEnum(PurchaseMethod, values_callable=get_enum_values),
        nullable=True,
        default=PurchaseMethod.bought,
    )

    # Defining relationships
    shelf: Mapped["Shelf"] = relationship("Shelf", back_populates="books")
    genres: Mapped[List[Genre]] = relationship(
        "Genre", secondary=book_genres, back_populates="books"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "author": self.author,
            "description": self.description,
            "cover_image": self.cover_image,
            "page_count": self.page_count,
            "format_type": self.format_type.value if self.format_type else None,
            "genres": [genre.name for genre in self.genres],
        }
