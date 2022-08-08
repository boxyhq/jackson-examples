# Supabase BoxyHQSAML provider demo

This app demonstrates login via [BoxyHQSAML Provider](https://github.com/supabase/gotrue/pull/478).

# Setup

Run self hosted supabase using https://github.com/supabase/supabase/blob/master/docker/docker-compose.yml.

### Update `docker-compose.yml`

- Point the gotrue instance to a docker image built using https://github.com/boxyhq/gotrue/tree/boxyhqsaml-provider

- Also add the following env for gotrue in docker-compose.yml

  ```yml
  GOTRUE_EXTERNAL_BOXYHQSAML_ENABLED: 'true'
  GOTRUE_EXTERNAL_BOXYHQSAML_CLIENT_ID: 'dummy'
  GOTRUE_EXTERNAL_BOXYHQSAML_SECRET: # Set this to https://boxyhq.com/docs/jackson/deploy/env-variables#client_secret_verifier of hosted jackson instance or use 'dummy' in case you are using https://jackson-demo.boxyhq.com
  GOTRUE_EXTERNAL_BOXYHQSAML_REDIRECT_URI: 'http://localhost:8000/auth/v1/callback' # callback path to gotrue which receives the authorization code from Jackson
  GOTRUE_EXTERNAL_BOXYHQSAML_URL: # Point this to a hosted (https://boxyhq.com/docs/jackson/deploy/service) instance of jackson or use: https://jackson-demo.boxyhq.com
  ```
  
 ### Update DB schema
Reference: https://supabase.com/docs/guides/with-nextjs#set-up-the-database-schema
Run below query against the DB.
  ```sql
  -- Create a table for public "profiles"
create table profiles (
  id uuid references auth.users not null,
  updated_at timestamp with time zone,
  username text unique,
  avatar_url text,
  website text,

  primary key (id),
  unique(username),
  constraint username_length check (char_length(username) >= 3)
);

alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Set up Realtime!
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;
alter publication supabase_realtime add table profiles;

-- Set up Storage!
insert into storage.buckets (id, name)
values ('avatars', 'avatars');

create policy "Avatar images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Anyone can upload an avatar."
  on storage.objects for insert
  with check ( bucket_id = 'avatars' );

```

### Start the app

Run

```bash
npm run dev:supabase // from root folder
```

### Tenant and product

If you are using https://jackson-demo.boxyhq.com then input tenant as `boxyhq.com` in the landing page and set product in [components/Auth.js](components/Auth.js#L14) as `saml-demo.boxyhq.com`.

If you are hosting [Jackson as a service](https://boxyhq.com/docs/jackson/deploy/service) then SAML config can be [added](https://boxyhq.com/docs/jackson/saml-flow#21-saml-add-config-api) for multiple tenant/products as you wish. Allowed redirect url in the config should contain `https://localhost:8000` (service endpoint for kong)
