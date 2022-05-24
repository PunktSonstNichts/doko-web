#Base image
FROM node:lts

#Install serve package
RUN npm i -g serve

# Set the working directory
WORKDIR /app

# install python because why the f*ck not?
RUN apk add --update python3 make g++\
   && rm -rf /var/cache/apk/*

# Copy the package.json and package-lock.json
COPY package*.json ./

# install project dependencies
RUN npm install

# Copy the project files
COPY . .

# Build the project
RUN npm run build

# Expose a port
EXPOSE 5000

# Executables
CMD [ "serve", "-s", "dist" ]