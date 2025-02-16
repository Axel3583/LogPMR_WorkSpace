import express from 'express';
import helmet from 'helmet'; // Middleware de sécurité pour Express
import cors from 'cors'; // Middleware de gestion des CORS (Cross-Origin Resource Sharing)
import dotenv from 'dotenv'; // Chargement des variables d'environnement
import mongoose from 'mongoose'; // ODM (Object Data Modeling) pour MongoDB
import UserRoute from './routes/userRoute'; // Importation des routes de l'API // Importation des routes de l'API
import swaggerDocs from './utils/swagger';

dotenv.config();

const hostname = '0.0.0.0';
const port = 3000;

const server = express();

// Connexion à la base de données MongoDB en utilisant l'URI provenant des variables d'environnement
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB.'); // Connexion réussie à MongoDB
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err); // Erreur de connexion à MongoDB
    process.exit(1); // Quitter le processus en cas d'erreur de connexion
  });

server.use(express.urlencoded({ extended: true })); // Middleware pour gérer les données encodées dans les requêtes
server.use(express.json()); // Middleware pour gérer les données JSON dans les requêtes
server.use(helmet()); // Middleware Helmet pour renforcer la sécurité du serveur
server.use(cors()); // Middleware CORS pour gérer les autorisations d'accès depuis différents domaines

UserRoute(server);

// Middleware pour la gestion des erreurs (doit être le dernier middleware)
server.use((err, req, res, next) => {
  next(() => {
    res
      .status(500)
      .send({ message: 'Internal Server Error', error: err.message });
  });
});

server.listen(port, hostname, () => {
  console.log(`Server is running on http://${hostname}:${port}`); // Démarrage du serveur Express de DEV sur l'adresse et le port
  swaggerDocs(server, port);
});
