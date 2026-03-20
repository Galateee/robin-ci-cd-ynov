import mysql.connector
import os
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

# Create a connection to the database
conn = mysql.connector.connect(
    database=os.getenv("MYSQL_DATABASE"),
    user=os.getenv("MYSQL_USER"),
    password=os.getenv("MYSQL_ROOT_PASSWORD"),
    port=3306,
    host=os.getenv("MYSQL_HOST")
)

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