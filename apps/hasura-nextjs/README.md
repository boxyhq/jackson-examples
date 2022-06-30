# Next.js + SAML Jackson SSO + Hasura GraphQL Integration Example

This demo app shows how to use SAML Jackson with Hasura GraphQL for authentication.

## Overview

The example Next.js app runs on port 3000.

Postgres and Hasura are running on port 5432 and 8081 respectively within Docker containers.

This demo is configured to work with 2 `x-hasura-role` (admin, developer).

`admin` can see all the rows in the users table. `developer` can see their own row. If no role is provided the `developer` role is assumed.

## Setup Environment

Update `.env` with your own credentials.

Run `npm run dev-docker` to start the Postgres and Hasura containers.

### Setup SAML Jackson

`.env` is pre-configured to work with a hosted demo version of SAML Jackson. Feel free to change the `BOXYHQ_SAML_JACKSON_URL` to point to your own hosted version of SAML Jackson.

### Setup Hasura GraphQL

Open Hasura Console at [http://localhost:8081/console](http://localhost:8081/console)

In the Hasura Console we use the **Raw SQL** feature create and track the tables [NextAuth.js needs](https://github.com/skillrecordings/products/tree/main/packages/next-auth-hasura-adapter#overview).

Make sure you [track the tables](https://hasura.io/docs/latest/graphql/core/databases/postgres/schema/using-existing-database/#to-track-all-tables-and-views-present-in-the-database). Tracking a table means telling Hasura GraphQL engine that you want to expose that table over GraphQL.

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
SET check_function_bodies = false;
CREATE TABLE public.accounts (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    "providerAccountId" text NOT NULL,
    refresh_token text,
    access_token text,
    expires_at bigint,
    token_type text,
    scope text,
    id_token text,
    session_state text,
    oauth_token_secret text,
    oauth_token text,
    "userId" uuid NOT NULL,
    refresh_token_expires_in integer
);
CREATE TABLE public.sessions (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    "sessionToken" text NOT NULL,
    "userId" uuid NOT NULL,
    expires timestamp with time zone
);
CREATE TABLE public.users (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text,
    email text,
    "emailVerified" timestamp with time zone,
    image text
);
CREATE TABLE public.verification_tokens (
    token text NOT NULL,
    identifier text NOT NULL,
    expires timestamp with time zone
);
ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.verification_tokens
    ADD CONSTRAINT verification_tokens_pkey PRIMARY KEY (token);
ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE CASCADE;
ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE CASCADE;
```

### Configure Hasura Permissions

Add an additional role `developer` to the `users` table.

![img alt](assets/hasura-set-role.png)

### Start the app

Run `npm run dev` to start the app.

Now you can open the demo app at [http://localhost:3000/](http://localhost:3000/) and start playing with the app.

### Configure Okta (Optional)

You can optionally configure Okta to demonstrates how to pass `group` along with user profile and use it as value for `x-hasura-role` in the claims.

Read more about [How to define and configure a custom SAML attribute statement](https://support.okta.com/help/s/article/How-to-define-and-configure-a-custom-SAML-attribute-statement?language=en_US)

![img alt](assets/okta-set-role.png)
