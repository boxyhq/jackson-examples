# Example App with Directory Sync powered by BoxyHQ

This is an example app to demonstrate how to use Directory Sync.

### Clone the example repo

```
git clone https://github.com/boxyhq/jackson-examples.git
```

```
cd jackson-examples
```

### Install the dependencies

```
npm install
```

```
cd apps/directory-sync
```

### Update DATABASE_URL

Update the `DATABASE_URL` in the `.env`

### Run the prisma migration

```
npx prisma migrate dev
```

### Run the prisma seed

```
npx prisma db seed
```

### Run the example app

If you run from the directory `jackson-examples/apps/directory-sync`

```
npm run dev
```

If you run from the directory `jackson-examples`

```
npm run dev:directory-sync
```
