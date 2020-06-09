FROM node:12

# Create app directory
WORKDIR /usr/app

# Copy project files
COPY . ./

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
RUN npm install \
    && npm run build:prod
# Build state files

# Start builded application
CMD npm run preview
