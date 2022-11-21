# Next.js + Enterprise SSO + Hasura GraphQL Integration Example

This demo app shows how to use BoxyHQ SAML Jackson with Hasura GraphQL for authentication.

## Overview

The example Next.js app runs on port 3366.

Postgres and Hasura are running on port 5432 and 8081 respectively within Docker containers.

This demo is configured to work with 2 `x-hasura-role` (admin, developer).

`admin` can see all the rows in the users table. `developer` can see their own row. If no role is provided the `developer` role is assumed.

## Setup Environment

Update `.env` with your own credentials.

Run `npm run dev-docker` from `/apps/hasura-nextjs` to start the Postgres, Hasura and BoxyHQ (Jackson) Docker containers.

### Setup SAML Jackson

`.env` is pre-configured to work with a local version of SAML Jackson (and included in the Docker Compose setup). Feel free to change the `BOXYHQ_SAML_JACKSON_URL` to point to your own hosted version of SAML Jackson.

### Setup Hasura GraphQL

Open Hasura Console at [http://localhost:8081/console](http://localhost:8081/console). Use the `HASURA_GRAPHQL_ADMIN_SECRET` value from `docker-compose.yml`

#### Add Required Tables

In the Hasura Console, we use the **Raw SQL** feature to add the tables [NextAuth.js needs](https://github.com/skillrecordings/products/tree/main/packages/next-auth-hasura-adapter#overview).

Navigate to `DATA` tab -> Enter the database connection parameters -> Connect to the database -> Click on `SQL` tab -> Paste the below sql snippet in the editor -> Click Run.

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

#### Track the Tables and Relationships

Make sure you [track the tables](https://hasura.io/docs/latest/graphql/core/databases/postgres/schema/using-existing-database/#to-track-all-tables-and-views-present-in-the-database). Tracking a table means telling Hasura GraphQL engine that you want to expose that table over GraphQL.

- Click on the `public` schema
- Click `Track All` against `Untracked tables or views`
- Click `Track All` against `Untracked foreign-key relationships`

#### Configure Hasura Permissions

Add an additional role `developer` to the `users` table. The Row select permissions are outlined below in the image, also please don't forget to select all for Column select permissions.

![img alt](assets/hasura-set-role.png)

### Configure SAML application in an Identity Provider

You can use our Mock SAML IdP if you do not have access to a real Identity Provider like Azure AD or Okta.

### Start the app

Run `npm run dev:hasura-nextjs` to start the app.

Now you can open the example app at [http://localhost:3366/](http://localhost:3366/) and start playing with the app.

### Configure Azure AD (Optional)

You can optionally configure Azure AD to send a `role` along with the user profile and use it as the value for `x-hasura-role` in the claims.

Navigate to `Users and groups` under the SAML application you created earlier, then select the `application registration` link that's in the text just above the users table. The link is highlighted in red in the screenshot below.

![Application Registration](assets/azure-application-registration.png)

Next click on `Create app role` and create two new roles `admin` and `developer`.

![Create App Role](assets/azure-app-roles.png)

Next head back to the `Users and groups` page, select your user from the table and click on `Edit assignment` at the top.

![Edit App Role](assets/azure-edit-assignment.png)

Now click on `Select a role` and then assign the `admin` role.

![Assign App Role](assets/azure-assign-app-role.png)

If you now give it a minute or two to let Azure AD propagate the change, `Sign out` of `http://localhost:3366/` and `Sign in` again you should see the new role reflected now for your user.

![Admin Role](assets/admin-role.png)

If you switch to the `Hasura` tab then you should now see your own record and any other that might exist. A good way to create more records would be to login via Mock SAML by using `demo@examle.com` email in the `Sign In` page.

![Admin Role Records](assets/admin-role-records.png)

### Configure Okta (Optional)

You can optionally configure Okta to demonstrate how to pass `groups` along with user profile and use it as the value for `x-hasura-role` in the claims.

Read more about [How to define and configure a custom SAML attribute statement](https://support.okta.com/help/s/article/How-to-define-and-configure-a-custom-SAML-attribute-statement?language=en_US)

![img alt](assets/okta-set-role.png)
