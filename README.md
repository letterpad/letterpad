## Table of Contents

- [Letterpad](#letterpad)
  - [Features](#features)
  - [Demo](#demo)
- [How to Install](#how-to-install)
  - [Development](#development)
  - [Production](#production)
    - [Using Docker](#using-docker)
    - [Configuration Options](#configuration-options)
  - [URL and Port](#url-and-port)
- [Letterpad Admin](#letterpad-admin)
- [Letterpad Client](#letterpad-client)
- [Contribute](#contribute)

# Letterpad

Letterpad is a comprehensive blog publishing engine that simplifies the process of managing and publishing content for your blog or website.

<p align="center">
  <img src="https://user-images.githubusercontent.com/1502352/213929848-293a0de7-d935-4744-859e-c6572dd97d10.png" width="600" align="center">
  <p align="center">Admin Dashboard</p>
</p>

---

<p align="center">
  <img src="https://user-images.githubusercontent.com/1502352/213930321-c6bec8c1-0e22-4545-ae51-c336211453d0.png" width="600">
  <p align="center">Website</p>
</p>

## Features

- **Fully Developed Admin Dashboard and Website**: Get started quickly with a ready-to-use admin dashboard and a customizable website.
- **Domain Mapping**: Easily map your custom domain to your Letterpad blog.
- **Inline Editing**: Edit your content directly on the website with inline editing capabilities.
- **Grid and List Layout**: Choose between grid and list layouts for displaying your content.
- **Customizable Brand Color**: Personalize your blog with a customizable brand color.
- **Database Options**: Use either MySQL or SQLite3 for your database.
- **Integrations**: Seamlessly integrate with Cloudinary and Unsplash for media management.
- **Multi-User Install**: Letterpad supports multi-user installations by default.
- **Creatives - Page Builder**: Create beautiful photostories, portfolios, photoblogs, and art/design showcases with the Creatives page builder.
- **Grammar Checker**: Integration with Grammarly ensures your content is free of grammatical errors.
- **SEO Optimization**: Built-in SEO features help boost your blog's visibility.
- **Server Rendered Blog**: Enjoy the benefits of a server-rendered blog for optimal performance.
- **Themes**: Choose from three themes and contribute your own designs.

## Demo

Explore Letterpad's capabilities in action by visiting the [demo](https://demo.letterpad.app).

# How to Install

To set up Letterpad on your system, follow these steps:

1. Clone this project:

   ```sh
   git clone git@github.com:letterpad/letterpad.git
   ```

2. Change to the project directory:

   ```sh
   cd letterpad
   ```

Before you proceed, ensure you've copied `apps/admin/.env.sample` to `apps/admin/.env` and set the `SECRET_KEY` to a unique value.

## Development

```sh
bun install
bun run build

# Copy apps/admin/.env.sample to apps/admin/.env
# Change the secret key in .env file.
bun run seed
bun run dev
```

## Production

```sh
bun install
bun run build

# Copy apps/admin/.env.sample to apps/admin/.env
# Change the secret key in .env file.
bun run seed
bun run start
```

### Using Docker

If you prefer using Docker for deployment, you can run Letterpad with the following command:

```sh
docker run \
-v 'data:/app/apps/admin/prisma/sqlite/data' \
-p 3001:3001 \
-p 3000:3000 \
-e DATABASE_URL='file:data/letterpad.sqlite' \
-e SECRET_KEY='provide-a-secret-key' \
-e EMAIL="xxx@xxx.com" \
-e PASSWORD='xxxxxxxxxxx' \
abhisheksaha11/letterpad
```

> **IMPORTANT!!!** - 
> The client uses `apps/client/.env` to connect with the API. This file contains the CLIENT_TOKEN, which you can find by logging into your admin dashboard and navigating to Settings > Keys. If you've changed the SECRET_KEY, make sure to update the CLIENT_ID.

### Configuration Options

Letterpad can be configured using environment variables. Here are the available options:
Here's the provided information converted into a table format:

| Configuration Options              | Description                                       |
| ---------------------------------- | ------------------------------------------------- |
| **User Configuration**             |                                                 |
| EMAIL                              | The email of the first user. (Docker only)        |
| PASSWORD                           | The password of the first user. (Docker only)      |
| **Security Configuration**         |                                                 |
| SECRET_KEY                         | A secret key used for encrypting passwords and emails. |
| **Database Configuration**         |                                                 |
| DATABASE_URL                       | Database connection URL. You can use either SQLite or MySQL. |
| **Spam Protection**                |                                                 |
| RECAPTCHA_KEY_CLIENT               | Google reCAPTCHA client key.                     |
| RECAPTCHA_KEY_SERVER               | Google reCAPTCHA server key.                     |
| **Email Configuration**            |                                                 |
| GMAIL_USER                         | Gmail email address.                             |
| GMAIL_PASSWORD                     | Gmail password.                                  |
| SENDER_EMAIL                       | Email address for sending emails.                |
| **Media Management Configuration (Cloudinary)** |                                         |
| CLOUDINARY_KEY                     | Cloudinary API key.                              |
| CLOUDINARY_NAME                    | Cloudinary cloud name.                           |
| CLOUDINARY_SECRET                  | Cloudinary API secret.                           |
| **Unsplash Integration**           |                                                 |
| UNSPLASH_CLIENT_ID                 | Unsplash client ID.                              |
| **Debugging**                      |                                                 |
| DEBUG                              | Enable debugging.                                |

## URL and Port

By default, the admin panel runs on port 3000, and the client runs on port 3001.

- Admin: [http://localhost:3000/admin](http://localhost:3000/admin)
- Client: [http://localhost:3001](http://localhost:3001)

## Letterpad Admin

For more information about configuring the admin panel, refer to this [folder](https://github.com/letterpad/letterpad/tree/master/apps/admin).

## Letterpad Client

The Letterpad client (public) app can be found inside `apps/client`.

Demo: [https://demo.letterpad.app](https://demo.letterpad.app)

Letterpad Admin provides a client key that can be found in settings. If you want to host the client on a different domain, set this client_key in `apps/client/next.config.js`.

## Contribute

You are welcome to contribute to the project. If you encounter any bugs or have feature requests, please create an issue or submit a pull request. Feel free to join our [Discord channel](https://discord.gg/n89rCNnzRw) to connect with the community and stay updated on the project's development.