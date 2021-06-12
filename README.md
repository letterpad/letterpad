Letterpad Admin is the dashboard for publishing blogs.

## Running Letterpad Admin on Production Mode

There are few things that you should know before running letterpad in a production environment.

- In the root folder, you will find a file `env.development.local`. Clone is file and rename it to `env.production.local`. The most import key is `SECRET_KEY`, set the value of this key to something different. This key is used to encrypt passwords, sessions and preview links.

- Letterpad runs on the url `/admin`. If you would like to run the admin dashboard in the root url,
  edit `next.config.js` and remove the basePath. Also open `env.production.local` and remove the `/admin` from all the urls.

- Run the below commands.

```bash
yarn install
yarn seed
yarn build
yarn start # starts the server
```

- Open http://localhost:3000/admin

- Login with demo account

```
Email - demo@demo.com
Password - demo
```

---

## Running Letterpad on Development Mode

First install the node modules and seed the database using

```bash
yarn install
yarn seed
```

Then, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser. You can login with the test account mentioned below

```
Email - demo@demo.com
Password - demo
```

---

Letterpad has been developed using Next.js.
To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Letterpad Client

We also have a letterpad client which you can find in [this repository](https://github.com/letterpad/letterpad-client).
