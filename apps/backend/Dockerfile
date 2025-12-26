FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install --production
RUN npm run build
EXPOSE 4000
CMD ["node", "dist/main.js"]
