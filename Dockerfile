# 1. Use a lightweight Node image
FROM node:18-slim

# 2. Set the working directory
WORKDIR /app

# 3. Copy package files first to cache dependencies (makes future builds instant!)
COPY package*.json ./

# 4. Install your Vite/React dependencies
RUN npm install

# 5. Copy your components and the rest of the code
COPY . .

# 6. Expose Vite's default port
EXPOSE 5173

# 7. Start Vite and force it to broadcast to the Docker network
CMD ["npm", "run", "dev", "--", "--host"]