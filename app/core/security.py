import bcrypt


def hash_password(password: str) -> str:
    password = password.encode("utf-8")
    hashed = bcrypt.hashpw(password, bcrypt.gensalt(12))
    return hashed.decode("utf-8")

def verify_password(password: str, hashed_password: str) -> bool:
    password = password.encode("utf-8")
    hashed_password = hashed_password.encode("utf-8")
    return bcrypt.checkpw(password, hashed_password)



