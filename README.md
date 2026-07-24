# \# Blog API

# 

# Backend learning project built with FastAPI.

# 

# \## Technologies

# 

# \- Python

# \- FastAPI

# \- PostgreSQL

# \- SQLAlchemy

# \- JWT Authentication

# \- Git

# \- GitHub

# 

# \## Features

# 

# \- User registration

# \- Login with JWT

# \- Password hashing

# \- Protected routes

# 

# \## Installation (Windows)

# 

# \### 1. Clone repository

# 

# ```bash

# git clone https://github.com/bobrik228123/blog-api.git

# cd blog-api

# ```

# 

# \### 2. Create virtual environment

# 

# ```bash

# python -m venv .venv

# ```

# 

# \### 3. Activate virtual environment

# 

# ```bash

# .venv\\Scripts\\activate

# ```

# 

# \### 4. Install dependencies

# 

# ```bash

# pip install -r requirements.txt

# ```

# 

# \### 5. Create PostgreSQL database

# 

# Create a new database in pgAdmin named:

# 

# ```text

# blog\_api

# ```

# 

# \### 6. Create `.env` file

# 

# ```env

# DATABASE\_URL=postgresql://postgres:YOUR\_PASSWORD@localhost/blog\_api

# SECRET\_KEY=your\_secret\_key

# ALGORITHM=HS256

# ACCESS\_TOKEN\_EXPIRE\_MINUTES=30

# ```

# 

# Replace `YOUR\_PASSWORD` with your PostgreSQL password.

# 

# \### 7. Start the server

# 

# ```bash

# uvicorn app.main:app --reload

# ```

# 

# The tables will be created automatically when the application starts.

# 

# \## API Documentation

# 

# Swagger UI:

# 

# ```text

# http://127.0.0.1:8000/docs

# ```

# 

# \## Author

# 

# Nazar Kuznetsov

