# Letterpad
Letterpad is a blog publishing platform.

## Screenshots

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

- Fully developed Admin Dashboard and Website
- Domain Mapping
- Inline Editing
- Grid and List Layout
- Customisable Brand Color
- Use mysql or sqlite3
- Integrations with Cloudinary and Unsplash
- Multi User Install by default
- Creatives - Page Builder for creating photostories ( portfolio, photoblog, showcasing art/design, etc).
- Grammar Checker with Grammarly
- Drag and Drop support for image uploads.
- SEO covered


## Demo:
https://demo.letterpad.app

# How to install

Clone this project

```sh
git clone git@github.com:letterpad/letterpad.git
```
Change directory
```sh
cd letterpad
```

## Install dependencies and generate database tables

```sh
yarn install
yarn seed
```

## Production
```sh
yarn build
yarn start
```

## Development
```sh
yarn dev
```

## URL and Port
By default the admin panel runs on port 3000 and client runs on port 3001
- Admin  - http://localhost:3000/admin
- Client - http://localhost:3001

## Letterpad Admin
You can find more information about configuration in this [folder](https://github.com/letterpad/letterpad/tree/master/apps/admin)

## Letterpad Client

The letterpad client (public) app can be found inside `apps/client`.
Demo: https://demo.letterpad.app

Letterpad Admin provides a client key which can be found in settings. If you want to host the client in a different domain, then you should set this client_key in `apps/client/next.config.js`.

## Contribute

You are welcome to contribute to the project. If you find any bugs, please create an issue or a pull request. Also if you would like to have a feature, feel free to inform us with an issue.

