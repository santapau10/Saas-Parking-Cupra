# Usa una imagen base de Node.js
FROM node:18-alpine AS build

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos de la aplicación
COPY . .

# Construye la aplicación de Vite
RUN npm run build

# Usa una imagen base de Node.js para servir la aplicación
FROM node:18-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos construidos desde la fase anterior
COPY --from=build /app/dist .

# Copia package.json para poder instalar dependencias de producción
COPY package*.json ./

# Instala solo las dependencias de producción
RUN npm install --only=production

# Expone el puerto 8080 para Google Cloud Run
EXPOSE 8080

# Comando para iniciar la aplicación
CMD ["npm", "start"]  # Asegúrate de que este script esté definido en package.json
