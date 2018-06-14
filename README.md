# Letterpad &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/ajaxtown/letterpad/blob/master/LICENSE) ![CircleCI Status](https://circleci.com/gh/ajaxtown/letterpad.svg?style=shield&circle-token=:circle-token)

Letterpad is an open-source and a high performant publishing engine for blogs with a state-of-the-art technology. It uses React, Graphql, Express and Sequelize ORM. It is in beta now. Few of the core features are listed below:

-   Server side rendering
-   Multi author support
-   Comments (Disqus integration)
-   Google Analytics
-   Theme support
-   Multi-level navigation
-   Image optimizer
-   GraphQL for json API
-   Roles - Admin, Reviewer, Author, Reader
-   Markdown and RichText editor
-   Search Engine Optimised
-   Multi-language support (currently en, fr and pl)

To check letterpad in action, check out this [Demo Site](https://letterpad.app/demo)
You can visit the [Admin Panel](https://letterpad.app/demo/admin/login) and login with

```
Email: demo@demo.com
Password: demo
```

A verbose documentation can be found at [https://letterpad.app/docs](https://letterpad.app/docs)

Letterpad is an open source project, licensed under MIT. It is a Single Page Application and runs ridiculously fast. It has a very minimal initial configuration and is easy to setup.

The API of letterpad exchanges information in json and you have full control over what data to get, set and display. You can build entire publishing apps on top of it, and completely customise the reader experience.

### Installation

There are three steps to install letterpad in the development environment.

1.  Open a terminal and clone the project:

```
git clone https://github.com/letterpad/letterpad.git
cd letterpad
```

2.  Make a copy of `sample.env` and name it `.env`. Open it and change `SECRET_KEY` to a random string to secure your app. Then add your SMTP credentials so email can be sent. Change the database options accordingly. By default, letterpad uses `sqlite`.

3.  Install dependencies and run (**use yarn to install dependencies**):

```
yarn install
theme=hugo npm run dev
```

Now visit [http://localhost:4040](http://localhost:4040) and checkout the welcome page.

To visit the admin panel, visit [http://localhost:4040/admin](http://localhost:4040/admin) and login with

```
Email: demo@demo.com
PAssword: demo
```

### How it works ?

Letterpad needs two servers to run your blog. One server runs Graphql API and the other server runs the Letterpad Engine. However with little modification, you can combine this to use one server.

Themes have their own seperate repository. While doing `yarn install`, the default theme `hugo` is fetched as a dependency during the install. If the theme already exist, this step will be ignored.

### Graphql API

The graphql api code (ES6) for development is in the `api` folder. After the build, the folder `apiBuild` is created which contains all api code in ES5. This is used in production. The reason we have this build folder in this repository is because you can directly clone this repo in your production and use it straightaway.

The api folder has well defined schemas in the `schema` folder and its resolvers in the `resolvers` folder. If you wish to make any change in the database label, then you should create a migration file. To create a migration file, enter this command:

```
yarn sequelize migration:generate --name specify-a-name-for-this-migration

//eg.
yarn sequelize migration:generate --name addGoogleAnalyticsField
```

The above migration will be created in `api/housekeeper/migrations/xxxxxxxx-addGoogleAnalyticsField.js

In order to run the migrations, enter the below command.

```
yarn sequelize db:migrate
```

### EsLint

Letterpad settings are based on VsCode editor but this can be used in any editor as well, however I have not tried this. To use class properties, we will install babel-eslint globally.

```
npm i -g babel-eslint
```

### Seeding

If you want to seed the database with sample data, run the below command:

```
// you should have babel-node installed.
babel-node ./api/seed/seed.js
```

### License

Letterpad is released under the MIT License.
