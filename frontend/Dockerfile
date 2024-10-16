# Usa una imagen base de Node.js para construir el frontend
FROM node:18 AS build

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia el package.json y package-lock.json al contenedor
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de la aplicación
COPY . .

# Construye la aplicación de React
RUN npm run build

# Usa una imagen base de nginx para servir el frontend
FROM nginx:alpine

# Copia los archivos construidos desde la etapa anterior al directorio de nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expone el puerto en el que corre nginx (por defecto, 80)
EXPOSE 80

# No es necesario CMD ya que nginx se ejecuta automáticamente
