# Letterpad &middot; [![Backers on Open Collective](https://opencollective.com/letterpad/backers/badge.svg)](#backers) [![Sponsors on Open Collective](https://opencollective.com/letterpad/sponsors/badge.svg)](#sponsors) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/letterpad/letterpad/blob/master/LICENSE) ![CircleCI Status](https://circleci.com/gh/letterpad/letterpad.svg?style=shield&circle-token=:circle-token)

Letterpad is an open-source and a high performant publishing engine for blogs with a state-of-the-art technology. It uses React, Graphql, Express and Sequelize ORM. It is getting closer to releasing v1.0. Few of the core features are listed below:

-   Server side rendering
-   Multi author support
-   Comments (Disqus integration)
-   Google Analytics
-   Theme support
-   Multi-level navigation
-   Image optimizer
-   React with styled-components for styling
-   GraphQL for json API
-   Roles - Admin, Reviewer, Author, Reader
-   Markdown and RichText editor
-   Search Engine Optimised
-   Multi-language support with react-i18next (currently en, fr and pl)

## Demo

To check letterpad in action, check out this [Demo Site](https://letterpad.app/demo).
You can visit the [Admin Panel](https://letterpad.app/demo/admin/login) and login with

```
Email: demo@demo.com
Password: demo
```

A verbose documentation can be found at [https://letterpad.app/docs](https://letterpad.app/docs).

Letterpad is an open source project, licensed under MIT. It runs ridiculously fast.

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
NODE_ENV=dev yarn install
theme=hugo yarn dev
```

`NODE_ENV=dev yarn install` is going to install all the dependencies, seed the database, prepare a build and welcome you to letterpad.

Now visit [http://localhost:4040](http://localhost:4040) and checkout the welcome page.

To visit the admin panel, visit [http://localhost:4040/admin](http://localhost:4040/admin) and login with

```
Email: demo@demo.com
PAssword: demo
```

### Creating a build for production

The below command will create a build for the `api`, the `admin dashboard` and the `theme`. You will have to specify which theme you want to build.

```
theme=hugo yarn build
```

-   This will create a folder called `apiBuild` which will contain all contents of the `api` folder in ES5.
-   All the admin dashboard specific bundle will be in `admin/public/dist` folder.
-   All the theme specific bundles will be in `client/hugo/public/dist` folder.
-   The vendor bundles are common between admin and client. So they will be in `public/js` folder.

### How it works ?

Letterpad needs two servers to run your blog. One server runs Graphql API and the other server runs the Letterpad Engine. However with little modification, you can combine this to use one server.

Themes have their own seperate repository. While doing `yarn install`, the default theme `hugo` is fetched as a dependency during the installation. If the theme already exist, this step will be ignored.

Every theme should contain the below config file. This will have some metadata about your theme.

```javascript
{
    "name": "Hugo",
    "short_name: "hugo",
    "description":
        "A theme for writing classic blogs. Seo optimised, spa, disqus integrtion",
    "author": "Redsnow",
    "thumbnail": "/images/thumbnail.png" // IMPORTANT: This thumbnail should exist inside the public folder of your theme
}
```

Read more about how to create a theme in the [documention site](https://letterpad.app/docs/page/theme-introduction).

### Admin Authentication

Apollo Client is responsible to exchange data with graphql. After the users logs in to admin panel, a new token is created with the below information:

```javascript
{
    email: "EMAIL",
    id: "USER_ID",
    role: "ROLE_NAME",
    permissions: ["PERMISSIONS"],
    name: "AUTHOR_FNAME",
    expiresIn: "30d" // "1d";
},
SECRET, // from .env file
{ expiresIn }
```

This token is then saved in localStorage. For every secured route in admin panel, a new token is issued and the previous token in localStorage is updated.

You can check the code of this here: `shared/apolloClient.js`.
And you can check the code at the route level here - `admin/containers/Secured.js`

### Graphql API

The graphql api code (ES6) for development is in the `api` folder. After the build, the folder `apiBuild` is created which contains all api code in ES5. This is used in production.

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

You can play around with the Graphql API locally on [http://localhost:3030/graphql](http://localhost:3030/graphql)

### VSCode setup

Extensions: Prettier, postcss-syntax, GraphQL, ESLint, DotENV, Babel ES6/ES7

```
npm i -g babel-eslint
```

For Prettier, it is recommended to add to the editor's `settings.json` to run on save.

```
"editor.formatOnSave": true
```

### Seeding

If you want to seed the database with sample data, run the below command:

```
// you should have babel-cli installed. Its good to have this package installed globally.
yarn seed
```

### Addition Links:

-   [Installing in Production](https://medium.com/@ajaxtown/installing-letterpad-in-digital-ocean-8ed53c66b114)

### Contribute

Letterpad is in its early stages and requires support to move ahead. You can contribute through various ways like
testing, ideas, recommendations, fixing bugs, documentation, logo design, assets, etc. You can join the slack channel (letterpad.slack.com) for discussions. Thanks.

Slack Channel - [https://letterpad.slack.com](https://letterpad.slack.com)

[Slack invite Link](https://tinyurl.com/letterpad)

## Contributors

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].
<a href="graphs/contributors"><img src="https://opencollective.com/letterpad/contributors.svg?width=890&button=false" /></a>

## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/letterpad#backer)]

<a href="https://opencollective.com/letterpad#backers" target="_blank"><img src="https://opencollective.com/letterpad/backers.svg?width=890"></a>

## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/letterpad#sponsor)]

<a href="https://opencollective.com/letterpad/sponsor/0/website" target="_blank"><img src="https://opencollective.com/letterpad/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/letterpad/sponsor/1/website" target="_blank"><img src="https://opencollective.com/letterpad/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/letterpad/sponsor/2/website" target="_blank"><img src="https://opencollective.com/letterpad/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/letterpad/sponsor/3/website" target="_blank"><img src="https://opencollective.com/letterpad/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/letterpad/sponsor/4/website" target="_blank"><img src="https://opencollective.com/letterpad/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/letterpad/sponsor/5/website" target="_blank"><img src="https://opencollective.com/letterpad/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/letterpad/sponsor/6/website" target="_blank"><img src="https://opencollective.com/letterpad/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/letterpad/sponsor/7/website" target="_blank"><img src="https://opencollective.com/letterpad/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/letterpad/sponsor/8/website" target="_blank"><img src="https://opencollective.com/letterpad/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/letterpad/sponsor/9/website" target="_blank"><img src="https://opencollective.com/letterpad/sponsor/9/avatar.svg"></a>

### License

Letterpad is released under the MIT License.
