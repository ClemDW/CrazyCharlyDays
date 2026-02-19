FROM node:22-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json package-lock.json* ./

# Installer les dépendances
RUN npm install
RUN npm install --save-dev typescript
# Copier le reste du code source
COPY . .

# Lancer le serveur en mode dev (avec watch pour hot-reload)
CMD ["npm", "run", "dev"]
