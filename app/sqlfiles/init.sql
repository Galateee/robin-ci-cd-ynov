CREATE DATABASE IF NOT EXISTS ynov_ci;
USE ynov_ci;

CREATE TABLE IF NOT EXISTS utilisateur (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    nom VARCHAR(100),
    prenom VARCHAR(100),
    email VARCHAR(255),
    date_naissance DATE,
    pays VARCHAR(255),
    ville VARCHAR(255),
    code_postal VARCHAR(5)
);

INSERT INTO utilisateur (nom, prenom, email) VALUES 
    ('Nom1', 'Prenom1', 'Nom1.Prenom1@example.com'),
    ('Nom2', 'Prenom2', 'Nom2.Prenom2@example.com'),
    ('Nom3', 'Prenom3', 'Nom3.Prenom3@example.com');
