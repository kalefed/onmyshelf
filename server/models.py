import datetime
from enum import Enum
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey, Enum as SqlEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from werkzeug.security import generate_password_hash, check_password_hash

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


# Define ENUMS for
class FormatType(Enum):
    audiobook = "audiobook"
    physical = "physical"
    ebook = "ebook"


class Book(db.Model):
    __tablename__ = "books"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(db.String(255), nullable=False)
    author: Mapped[str] = mapped_column(db.String(255), nullable=False)
    shelf_id: Mapped[int] = mapped_column(ForeignKey("shelves.id"), nullable=False)

    format_type: Mapped[FormatType] = mapped_column(
        SqlEnum(FormatType, values_callable=get_enum_values),
        nullable=True,
        default=FormatType.physical,
    )

    # Defining relationships
    shelf: Mapped["Shelf"] = relationship("Shelf", back_populates="books")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "author": self.author,
            "format_type": self.format_type.value if self.format_type else None,
        }
