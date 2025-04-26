# Projet Red/Blue Team

## En cas de rebuild
- Vérifier le .htaccess
- Il doit être comme suit :
    RewriteEngine On
    RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -f [OR]
    RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -d
    RewriteRule ^ - [L]
    RewriteRule ^ ./index.html

# DOCKERFILE

/api

- docker build -t bierge-api .
- docker run -p 3001:3001 bierge-api

/40bierges

- docker build -t bierge-front .
- docker run -p 3000:3000 bierge-front

# DOCKER-COMPOSE

A la racine : ./siteBierges

La première fois :

- docker-compose up -d --build

Ensuite :

- docker-compose up -d

# URL de connexion

- http://localhost:3000/login