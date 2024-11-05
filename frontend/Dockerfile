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

# Instala un servidor estático ligero (serve)
RUN npm install -g serve

# Copia los archivos construidos desde la fase anterior
COPY --from=build /app/dist .

# Expone el puerto 8080 para Google Cloud Run
EXPOSE 8080

# Inicia el servidor con "serve"
CMD ["serve", "-s", ".", "-l", "8080"]
