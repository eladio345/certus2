require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const alumno = require("./models/Alumnos");
const Alumnos = require('./models/Alumnos');
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();

const swaggerOption = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de alumnos",
      version: "1.0.0",
      description: "API para gestionar los alumnos"
    },
    servers: [
      {
        url: "https://certus2-production-7e4a.up.railway.app"
      },
      {
        url: "http://localhost:5000"
      }
    ]
  },
  apis: ["./app.js"]
};

const swaggerDocs = swaggerJsdoc(swaggerOption);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(express.json());
app.use(cors());


const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI).then(() => {
  console.log("Se conectó exitosamente ");
}).catch((err) => {
  console.log("Error al conectar :", err);
});

/**
 * @swagger
 * /alumnos:
 *   post:
 *     summary: Crear un nuevo alumno
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               edad:
 *                 type: integer
 *               genero:
 *                 type: string
 *               carrera:
 *                 type: string
 *               comentarios:
 *                 type: string
 *             required:
 *               - nombre
 *               - apellido
 *               - edad
 *               - genero
 *               - carrera
 *     responses:
 *       201:
 *         description: Alumno registrado correctamente
 *       400:
 *         description: Error al registrar
 */
app.post('/alumnos', async (req, res) => {
  try {
    const nuevoAlumno = new alumno(req.body);
    await nuevoAlumno.save();
    res.status(201).json({ message: "Alumno registrado correctamente." });
  } catch (err) {
    res.status(400).json({ message: "Error al registrar" });
  }
});

/**
 * @swagger
 * /alumnos:
 *   get:
 *     summary: Obtiene todos los alumnos
 *     responses:
 *       200:
 *         description: Lista completa de alumnos
 *       400:
 *         description: Error al listar
 */
app.get('/alumnos', async (req, res) => {
  try {
    const listadoAlumnos = await Alumnos.find();
    res.status(200).json(listadoAlumnos);
  } catch (err) {
    res.status(400).json({ message: "Error al listar" });
  }
});

// Iniciar servidor
app.listen(5000, () => {
  console.log("Servidor ejecutándose en el puerto 5000");
});
