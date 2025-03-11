# Use a base Python image
FROM nginx:alpine

# Set the working directory in the container
WORKDIR /usr/share/nginx/html

# Copy all the directory into the container (except of the .dockerignor files)


COPY . .

# Expose the port on which the Flask app will run
EXPOSE 80



# Run the Flask app
CMD ["nginx", "-g", "daemon off;"]
