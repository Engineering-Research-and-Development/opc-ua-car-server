FROM node:12

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install --unsafe-perm
# If you are building your code for production
RUN npm ci --only=production

RUN npm audit fix

# Bundle app source
COPY . .

EXPOSE 5001
CMD [ "node", "index.js" ]
