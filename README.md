# ITSeed API

## Set up
```
$ cp cp .env.example .env
$ cp docker/.env.example docker/.env
$ cd docker/
$ docker compose up -d
$ docker compose exec app sh
$ yarn start:dev
```

## Set up `Sign in with Google`
Follow the document and get the client ID and secret key, then fill into `.env`
```
GOOGLE_CLIENT_ID={Your client ID}
GOOGLE_SECRET={You secret key}
```

# test