# BoxyHQ SAML + Hasura GraphQL Auth Example

Express web app that shows how to use [BoxyHQ SAML](https://github.com/boxyhq/jackson) to authenticate [Hasura GraphQL](https://github.com/hasura/graphql-engine) API.

## Install

Please follow the below instructions. Make sure you have Docker installed on your system.

```
git clone https://github.com/boxyhq/boxyhq-saml-hasura-express.git
```

```
cd boxyhq-saml-hasura-express
```

Open `docker-compose.yml` and update environment variables as per you needs.

```
npm run start
```

## How to run

- Open Hasura console [http://localhost:8080/console](http://localhost:8080/console) and enter admin secret **hasura-admin-secret-key**. You can change the value of the admin secret via env variable `HASURA_GRAPHQL_ADMIN_SECRET`.

- Open the tab **Data** and create a new database. Enter the correct **Database URL**. For example `postgres://postgres:postgres@postgres:5432/postgres`

- Click the created database from the sidebar on the left and choose the template **Hello World** from the **Template Gallery** and click **Install Template**. This will create 2 tables called `authors` and `articles`. It will also insert a few rows in each tables.

- Open the express app at [http://localhost:3000](http://localhost:3000)

- Open the page **Metadata** and add your IdP Metadata. You can use [Mock SAML](https://mocksaml.com/) to test the SAML SSO integration.

- Click **Login via SSO** and complete the sign in process.

- Open the page **Articles** to the see articles fetched via GraphQL query using Hasura.

## Notes

- Express app runs on port `3000`
- Hasura runs on port `8080`

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;

SET check_function_bodies = false;

CREATE TABLE public.users (
  id uuid DEFAULT public.gen_random_uuid() NOT NULL,
  name text,
  email text,
  "providerAccountId" text NOT NULL,
  "emailVerified" timestamp with time zone,
  image text
);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
```
