# Twitter Clone

A full-stack Twitter clone built with Django REST Framework and React.

---

## Stack

**Backend**
- Python / Django / Django REST Framework
- JWT Authentication (djangorestframework-simplejwt)
- SQLite
- Docker
- pytest + pytest-cov

**Frontend**
- React + TypeScript
- Vite
- Tailwind CSS
- Zustand
- Axios
- React Router DOM

---

## Features

- JWT authentication (register, login, token refresh)
- User profiles with follow/unfollows
- Post creation and deletion
- Like/unlike posts
- Retweet/unretweet
- Comments on posts
- Feed (For You and Following)
- Permission-based access control

---

## Project Structure

```
Twitter-Project/
├── backend/          # Django REST Framework API
│   ├── users/        # User model, serializers, views, tests
│   ├── posts/        # Post model, serializers, views, tests
│   └── twitterbackend/  # Django settings and URLs
├── frontend/         # React + TypeScript app
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── store/
│       └── types/
├── docker-compose.yml
└── pytest.ini
```

---

## Getting Started

### Backend

```bash
docker-compose up --build
```

The API will be available at `http://localhost:8000/api/`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173/`

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/token/` | Obtain JWT token |
| POST | `/api/token/refresh/` | Refresh JWT token |
| GET/POST | `/api/users/` | List / create users |
| GET/DELETE | `/api/users/{id}/` | Get / delete user |
| GET | `/api/users/me/` | Get authenticated user |
| POST | `/api/users/{id}/follow/` | Follow user |
| POST | `/api/users/{id}/unfollow/` | Unfollow user |
| GET/POST | `/api/posts/` | List / create posts |
| DELETE | `/api/posts/{id}/` | Delete post |
| POST | `/api/posts/{id}/like_unlike_post/` | Like or unlike post |
| POST | `/api/posts/{id}/retweet/` | Retweet or unretweet |
| POST | `/api/posts/{id}/comment/` | Comment on post |
| DELETE | `/api/posts/{id}/delete_comment/{comment_id}/` | Delete comment |
| GET | `/api/feed/?feed=for_you` | For You feed |
| GET | `/api/feed/?feed=following` | Following feed |

---

## CI

GitHub Actions runs on every push and pull request:
- Lint with ruff
- Run pytest with coverage (minimum 80%)
- Upload coverage report as artifact