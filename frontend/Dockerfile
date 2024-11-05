# Declarar el argumento de construcción
ARG VITE_REACT_APP_API_URL

# Usar una imagen base de Node.js
FROM node:18-alpine

# Establecer un directorio de trabajo
WORKDIR /app

# Copiar el package.json
COPY package.json .

# Instalar las dependencias
RUN npm install

# Establecer la variable de entorno a partir del argumento
ENV VITE_REACT_APP_API_URL=$VITE_REACT_APP_API_URL

# Asegúrate de instalar serve
RUN npm install -g serve

# Copiar el resto de los archivos
COPY . .

# Construir la aplicación
RUN npm run build

# Exponer el puerto 8080
EXPOSE 8080

# Comando para ejecutar la aplicación
CMD ["serve", "-s", "dist"]
