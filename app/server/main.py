import mysql.connector
import os
import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


class UserCreate(BaseModel):
    nom: str
    prenom: str
    email: str
    date_naissance: str | None = None
    pays: str | None = None
    ville: str | None = None
    code_postal: str | None = None

app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

def connect_with_retry(max_retries=30, delay_seconds=2):
    last_error = None
    for _ in range(max_retries):
        try:
            return mysql.connector.connect(
                database=os.getenv("MYSQL_DATABASE"),
                user=os.getenv("MYSQL_USER"),
                password=os.getenv("MYSQL_PASSWORD", os.getenv("MYSQL_ROOT_PASSWORD")),
                port=3306,
                host=os.getenv("MYSQL_HOST")
            )
        except mysql.connector.Error as error:
            last_error = error
            time.sleep(delay_seconds)

    raise last_error


# Create a resilient connection to the database at startup.
conn = connect_with_retry()

@app.get("/users")
async def get_users():
    cursor = conn.cursor()
    sql_select_Query = "SELECT * FROM utilisateur"
    cursor.execute(sql_select_Query)
    #get all records
    records = cursor.fetchall()
    print("Total number of rows in table: ", cursor.rowcount)
    # renvoyer nos données et 200 code OK
    return {"utilisateurs": records}


@app.post("/users")
async def create_user(user: UserCreate):
    cursor = conn.cursor()
    sql_insert_query = (
        "INSERT INTO utilisateur "
        "(nom, prenom, email, date_naissance, pays, ville, code_postal) "
        "VALUES (%s, %s, %s, %s, %s, %s, %s)"
    )
    values = (
        user.nom,
        user.prenom,
        user.email,
        user.date_naissance,
        user.pays,
        user.ville,
        user.code_postal,
    )
    cursor.execute(sql_insert_query, values)
    conn.commit()

    return {"id": cursor.lastrowid}