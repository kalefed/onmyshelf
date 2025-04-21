FROM node:lts-alpine AS build

WORKDIR /app

# Copy in the package.json so that we can install the dependencies we need
COPY package.json package-lock.json ./

# Install the dependencies
RUN npm install

FROM node:lts-alpine

WORKDIR /app

# Copy the installed dependencies from the build stage
COPY --from=build /app/node_modules ./node_modules

# Copy in the code
COPY . .

# Run the development server
CMD ["npm", "run", "dev"]
