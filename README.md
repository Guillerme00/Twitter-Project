# Twitter Clone

A modern full-stack Twitter/X clone built with Django REST Framework and React.

---

# Preview

Features a real-time inspired social feed experience with authentication, profiles, follows, likes, retweets, comments, image uploads, and personalized feeds.

---

# Stacks

## Backend
- Python
- Django
- Django REST Framework
- JWT Authentication (`djangorestframework-simplejwt`)
- SQLite
- Docker
- pytest
- pytest-cov
- Ruff

## Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- Axios
- React Router DOM

---

# Features

## Authentication
- User registration
- Login / logout
- JWT authentication
- Automatic token refresh
- Protected routes

## User System
- Editable profiles
- Profile pictures and banners
- User bios
- Follow / unfollow users
- Followers and following count

## Posts
- Create posts
- Delete posts
- Image uploads
- Like / unlike posts
- Retweet / unretweet
- Comments system

## Feed
- "For You" feed
- "Following" feed
- Dynamic feed filtering

## Frontend Features
- Optimistic UI updates
- Responsive layout
- Dynamic textarea resizing
- Image preview before upload
- Modal comment system
- Real-time UI interactions

---

# Project Structure

```bash
Twitter-Project/
├── backend/
│   ├── posts/
│   ├── users/
│   ├── twitterbackend/
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   ├── types/
│   │   └── main.tsx
│   │
│   ├── package.json
│   └── vite.config.ts
│
├── docker-compose.yml
├── pytest.ini
└── README.md
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/twitter-clone.git
cd twitter-clone
```

---

# Backend Setup

## Using Docker

```bash
docker-compose up --build
```

Backend available at:

```bash
http://localhost:8000/api/
```

---

## Manual Setup

```bash
cd backend

python -m venv venv

# Linux / Mac
source venv/bin/activate

# Windows
venv\Scripts\activate

pip install -r requirements.txt

python manage.py migrate

python manage.py runserver
```

---

# Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend available at:

```bash
http://localhost:5173/
```

---

# Environment Variables

## Backend

Create a `.env` file inside the backend folder:

```env
SECRET_KEY=your_secret_key
DEBUG=True
```

---

# API Endpoints

## Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/token/` | Obtain JWT token |
| POST | `/api/token/refresh/` | Refresh JWT token |

---

## Users

| Method | Endpoint | Description |
|---|---|---|
| GET/POST | `/api/users/` | List / create users |
| GET/DELETE | `/api/users/{id}/` | Get / delete user |
| GET | `/api/users/me/` | Get authenticated user |
| POST | `/api/users/{id}/follow/` | Follow user |
| POST | `/api/users/{id}/unfollow/` | Unfollow user |

---

## Posts

| Method | Endpoint | Description |
|---|---|---|
| GET/POST | `/api/posts/` | List / create posts |
| DELETE | `/api/posts/{id}/` | Delete post |
| POST | `/api/posts/{id}/like_unlike_post/` | Like or unlike post |
| POST | `/api/posts/{id}/retweet/` | Retweet or unretweet |
| POST | `/api/posts/{id}/comment/` | Comment on post |
| DELETE | `/api/posts/{id}/delete_comment/{comment_id}/` | Delete comment |

---

## Feed

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/feed/?feed=for_you` | For You feed |
| GET | `/api/feed/?feed=following` | Following feed |

---

# Running Tests

## Backend Tests

```bash
pytest
```

With coverage:

```bash
pytest --cov
```

---

# CI/CD

GitHub Actions runs automatically on:
- Pushes
- Pull requests

Pipeline includes:
- Ruff linting
- Pytest execution
- Coverage validation
- Coverage artifact upload

---

# Future Improvements

- Search system
- Infinite scrolling
- Notifications
- Real-time updates
- Direct messages
- Better mobile responsiveness
- User recommendations
- Bookmark system

---

# License

This project is for educational purposes.

---

# Author

Built by Guilherme.
