CREATE DATABASE IF NOT EXISTS zayegworkout_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE zayegworkout_db;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  id_plan TINYINT UNSIGNED NOT NULL,
  fecha_vencimiento DATETIME NOT NULL,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_plan CHECK (id_plan IN (1, 2, 3))
);

CREATE TABLE IF NOT EXISTS ejercicios (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  grupo_muscular VARCHAR(80) NOT NULL,
  nivel ENUM('principiante', 'intermedio', 'avanzado') NOT NULL,
  descripcion TEXT NOT NULL
);
