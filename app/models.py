from datetime import datetime

from sqlalchemy import String, DateTime
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )
    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    # --- Забыли пароль ---
    # Хранится ХЭШ токена, не сам токен (та же логика, что и с паролем:
    # если утечёт БД, токены нельзя будет использовать напрямую).
    reset_token_hash: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )
    reset_token_expires: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
