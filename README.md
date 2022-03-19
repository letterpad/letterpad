Letterpad Admin is the dashboard for publishing blogs.

<img src="./demo.png" >

## Features

- High performant GraphQL API.
- Uses Graphql, React Apollo, NextJS and Prisma
- Uses TinyMCE editor, specially composed for Letterpad
- Theme customisation (css) from Dashboard.
- Use Language Tool AI Model to check grammar.
- CDN Powered images (Uses cloudinary and Unsplash)
- Connects to multiple databases. Default is sqlite3
- Can be used as a multi-user service
- Minimalistic Dashboard

## Demo:

https://letterpad.app/admin/login?demo

## Without self hosting

You can register in https://letterpad.app/admin/register and start writing posts, free of cost.

## With self hosting

There are few things that you should know before running letterpad in a production environment.

- In the root folder, you will find a file `env.development.local`. Clone is file and rename it to `env.production.local`. The most important key is `SECRET_KEY`, set the value of this key to something different. This key is used to encrypt passwords, sessions and preview links.

- Letterpad Admin runs on the url `/admin`. If you would like to run the admin dashboard in the root url,
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

## Enabling Emails

Letterpad integrates with [MailChimp](https://mailchimp.com/). You should set `MJ_APIKEY_PUBLIC` and `MJ_APIKEY_PRIVATE` in `.env.production.local` file to activate emails.

---

## Captcha for registrations

This section is required only if you want to use Letterpad as a multi-user account. Letterpad uses [ReCaptcha](https://www.google.com/recaptcha/about/). You can register and set the `RECAPTCHA_KEY` in `env.production.local`.

---

## Running Letterpad on Development Mode

First install the node modules and seed the database using

```bash
yarn install
yarn seed
```

`yarn seed` will reset the database. So use this only in dev environment. When you execute this command, it is going to create the prisma client from the env variable `DATABASE_URL`, with which it is going to seed the database.

> If you want to swith the db to something different like `mysql`, you should change the `DATABASE_URL` and generate the client with the command `prisma:generate`.

Then, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000/admin](http://localhost:3000/admin) with your browser. You can login with the test account mentioned below

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

We also have a letterpad client which you can find in [this repository](https://github.com/letterpad/letterpad-client). The letterpad client is a simple react application which uses the graphql API of letterpad to render a public facing blog.

Demo: https://demo.letterpad.app

Letterpad Admin provides a client key which can be found in settings. If you want to host the client in a different domain, then you should set this client_key in `next.config.js`.

## Contribute

You are welcome to contribute to the project. If you find any bugs, please create an issue or a pull request. Also if you would like to have a feature, feel free to inform us with an issue.
