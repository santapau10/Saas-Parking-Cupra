# Usa una imagen base de Node.js
FROM node:18 AS build

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia el package.json y package-lock.json al contenedor
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de la aplicación
COPY . .

# Compila el código TypeScript
RUN npm run build

# Crea una imagen de producción
FROM node:18

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia solo los archivos necesarios
COPY --from=build /app/dist ./dist
COPY package*.json ./

# Instala solo las dependencias de producción
RUN npm install

# Expone el puerto en el que corre tu aplicación (por defecto, 3000)
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["node", "dist/index.js"]
