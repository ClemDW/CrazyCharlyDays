FROM node:22-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json package-lock.json* ./

# Installer les dépendances
RUN npm install

# Copier le reste du code source
COPY . .

# Exposer le port Vite
EXPOSE 5173

# Lancer le serveur de dev Vite
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
