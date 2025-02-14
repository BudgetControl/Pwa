FROM mlabfactory/php8-apache:v1.3

WORKDIR /var/www/workdir

## NODE INSTALLATION
RUN apt install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && apt-get install -y nodejs

COPY . /var/www/workdir/
RUN export NODE_OPTIONS=--openssl-legacy-provider

ARG APP_ENV
RUN if [ "$APP_ENV" = "dev" ]; then npm run build-dev; else npm install && npm run build; fi

###########################################
# apache conf
###########################################
RUN touch .env

COPY bin/apache/default.conf /etc/apache2/sites-available/budgetcontrol.cloud.conf
RUN chown -R www-data:www-data /var/www/workdir/dist
RUN chmod -R 775 /var/www/workdir/dist
COPY bin/apache/htaccess.conf /var/www/workdir/dist/.htaccess

COPY bin/entrypoint.sh /var/www/script/entrypoint.sh
RUN chmod +x /var/www/script/entrypoint.sh

# Expose the port
EXPOSE 80

# Start the server
CMD ["apache2-foreground"]