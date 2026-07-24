# Blog API

A REST API for a blog built with FastAPI, PostgreSQL and SQLAlchemy.  
This project was created for learning backend development and REST API design.

---

## Technologies

- Python
- FastAPI
- PostgreSQL
- SQLAlchemy
- Pydantic
- JWT Authentication
- Passlib (Password Hashing)
- OAuth2
- Uvicorn
- Git
- GitHub

---

## Features

- User registration
- User login
- JWT Authentication
- Password hashing with bcrypt
- OAuth2 authentication
- Protected routes
- Get current authenticated user
- PostgreSQL database integration
- SQLAlchemy ORM
- Environment variables with `.env`
- Automatic database table creation
- Interactive Swagger API documentation

---

## Installation (Windows)

### 1. Clone the repository

```bash
git clone https://github.com/bobrik228123/blog-api.git
cd blog-api
```

### 2. Create a virtual environment

```bash
python -m venv .venv
```

### 3. Activate the virtual environment

```bash
.venv\Scripts\activate
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

### 5. Create a PostgreSQL database

Open **pgAdmin** and create a new database named:

```text
blog_api
```

### 6. Create a `.env` file

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost/blog_api
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Replace `YOUR_PASSWORD` with your PostgreSQL password.

### 7. Run the project

```bash
uvicorn app.main:app --reload
```

The database tables will be created automatically when the application starts for the first time.

---

## API Documentation

After starting the server, open:

```text
http://127.0.0.1:8000/docs
```

Swagger UI allows you to test every endpoint directly from the browser.

---

## Project Structure

```text
blog-api/
│
├── app/
│   ├── core/
│   │   └── security.py
│   │
│   ├── models/
│   │   ├── post.py
│   │   └── user.py
│   │
│   ├── routers/
│   │   ├── auth.py
│   │   ├── posts.py
│   │   └── users.py
│   │
│   ├── schemas/
│   │   └── user.py
│   │
│   ├── database.py
│   └── main.py
│
├── .env
├── .gitignore
├── README.md
└── requirements.txt
```

---

## Author

**Nazar Kuznetsov**

GitHub: https://github.com/bobrik228123
