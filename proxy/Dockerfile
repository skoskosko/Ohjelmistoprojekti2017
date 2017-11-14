# Set nginx base image
FROM nginx

# Copy custom configuration file from the current directory
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf
