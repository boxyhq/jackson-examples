# Example App with Directory Sync powered by BoxyHQ

This is an example app to demonstrate how to use Directory Sync.

### Clone the example repo

```
git clone https://github.com/boxyhq/jackson-examples.git
```

```
cd jackson-examples
```

### Configure database in .env

```
DATABASE_URL=""
```

### Migrate the database

```
npx prisma db push
```

### Install the dependencies

```
npm install
```

### Run the example app

```
npm run dev:directory-sync
```
