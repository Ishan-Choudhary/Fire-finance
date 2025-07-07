# Fire finance development setup

1. Create a .env file containing the following keys
```
VITE_FIREBASE_API_KEY=
VITE_AUTH_DOMAIN=
VITE_PROJECT_ID=
VITE_STORAGE_BUCKET=
VITE_MESSAGING_SENDER_ID=
VITE_APP_ID=
VITE_DATABASE_URL=
```

```
```
2. And fill in their values using your project keys from firebase.
3. Run
```
docker build -t fire-fin-dev .
docker run -it --rm \
  -v ${PWD}:/app \
  -v /app/node_modules \
  -p 5173:5173 \
  fire-fin-dev
```
