from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import (
    hash_password,
    verify_password,
    create_access_token,
    generate_reset_token,
    hash_reset_token,
    get_reset_token_expiry,
)
from app.dependencies import get_db, get_current_user
from app.models import User
from app.schemas import (
    UserCreate,
    UserOut,
    UserLogin,
    Token,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    ResetPasswordRequest,
)

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)


@router.post(
    "/register",
    response_model=UserOut,
    status_code=status.HTTP_201_CREATED,
)
async def register(
    user_data: UserCreate,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(User).where(User.email == user_data.email)
    )

    existing_user = result.scalar_one_or_none()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with this email already exists",
        )

    user = User(
        email=user_data.email,
        password_hash=hash_password(user_data.password),
    )

    db.add(user)
    await db.commit()
    await db.refresh(user)

    return user


@router.post("/login", response_model=Token)
async def login(
    credentials: UserLogin,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(User).where(User.email == credentials.email)
    )
    user = result.scalar_one_or_none()

    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token(user.id)

    return Token(access_token=token, token_type="bearer")


@router.get("/me", response_model=UserOut)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user


# --- Забыли пароль ---

GENERIC_FORGOT_MESSAGE = (
    "Если аккаунт с таким email существует, на него отправлена ссылка для сброса пароля."
)


@router.post("/forgot-password", response_model=ForgotPasswordResponse)
async def forgot_password(
    payload: ForgotPasswordRequest,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User).where(User.email == payload.email))
    user = result.scalar_one_or_none()

    # Отвечаем ОДИНАКОВО независимо от того, нашёлся юзер или нет —
    # иначе по ответу сервера можно перебором узнавать, какие email
    # зарегистрированы (user enumeration).
    if user is not None:
        raw_token = generate_reset_token()
        user.reset_token_hash = hash_reset_token(raw_token)
        user.reset_token_expires = get_reset_token_expiry()
        await db.commit()

        # TODO: здесь должна быть реальная отправка email (SMTP / Resend /
        # SendGrid и т.п.). SMTP пока не подключён, поэтому на время
        # разработки просто печатаем ссылку в консоль бэкенда, чтобы
        # можно было руками пройти сценарий сброса пароля.
        reset_link = f"http://localhost:5173/reset-password?token={raw_token}"
        print(f"[DEV] Ссылка для сброса пароля для {user.email}: {reset_link}")

    return ForgotPasswordResponse(message=GENERIC_FORGOT_MESSAGE)


@router.post("/reset-password", response_model=ForgotPasswordResponse)
async def reset_password(
    payload: ResetPasswordRequest,
    db: AsyncSession = Depends(get_db),
):
    token_hash = hash_reset_token(payload.token)

    result = await db.execute(
        select(User).where(User.reset_token_hash == token_hash)
    )
    user = result.scalar_one_or_none()

    if user is None or user.reset_token_expires is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token",
        )

    expires_at = user.reset_token_expires
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token",
        )

    user.password_hash = hash_password(payload.new_password)
    user.reset_token_hash = None
    user.reset_token_expires = None
    await db.commit()

    return ForgotPasswordResponse(message="Пароль успешно изменён.")
