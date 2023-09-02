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
### Using Docker
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
### Options:
Letterpad can be configured using environemt variables. The below are all possible options.

Create your first user. You should run the container the first time using this. 
> When you restart the container only Email is required.
```
EMAIL
PASSWORD
```

Provide a secret key which will be used for encryting passwords and emails.
```
SECRET_KEY
```

Provide a database url string. If you want to use `mysql`, then you should either have the credentials ready or use `docker-compose.yml` file to add the db. If you dont wnat to create additional setup, then you can use `sqlite`.
```sh
DATABASE_URL

# eg.
# DATABASE_URL="file:data/letterpad.sqlite"
# DATABASE_URL="mysql://user:pwd@172.17.0.1:3306/db_name?connect_timeout=5" 
```
> 172.17.0.1 is the docker default docker ip. Prisma does not work if you use the container name as host. 


If you want to add spam protection for registration page, then you should configure google recaptcha keys.
You can create the keys here - https://www.google.com/recaptcha/admin/create
```
RECAPTCHA_KEY_CLIENT
RECAPTCHA_KEY_SERVER
```

It is also highly advisable to configure emails. Currently Letterpad supports gmail.
```
GMAIL_USER
GMAIL_PASSWORD
SENDER_EMAIL
```

If you want to upload your images to CDN, then you should configure the cloudinary keys here - https://cloudinary.com/.
```
CLOUDINARY_KEY
CLOUDINARY_NAME
CLOUDINARY_SECRET
```

If you want to enable Unsplash which is a repository for quality images, then you should configure unsplash here - https://unsplash.com/oauth/applications.
```
UNSPLASH_CLIENT_ID
```
Enable debugging
```
DEBUG
```

## Development

```sh
yarn dev
```

## URL and Port
By default the admin panel runs on port 3000 and client runs on port 3001.
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

