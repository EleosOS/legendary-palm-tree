FROM node:18-alpine
COPY . .
RUN npm install
RUN npm run build

HEALTHCHECK --interval=1m --timeout=10s --start-period=30s --retries=3 CMD [ "curl", "-sf", "http://localhost:8080", "||", "exit 1"]

CMD ["npm", "start"]