# Dockerfile
FROM node:20

# Crea el directorio de trabajo
WORKDIR /app

# Copia archivos de configuración
COPY package*.json ./

# Instala dependencias
RUN npm install

# Copia el resto del proyecto
COPY . .

# Compila TypeScript
RUN npm run build

# Expone el puerto
EXPOSE 3000

# Comando para correr la app
CMD ["npm", "run", "start"]
