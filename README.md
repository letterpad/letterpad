# Letterpad &middot; [![Backers on Open Collective](https://opencollective.com/letterpad/backers/badge.svg)](#backers) [![Sponsors on Open Collective](https://opencollective.com/letterpad/sponsors/badge.svg)](#sponsors) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/letterpad/letterpad/blob/master/LICENSE) ![CircleCI Status](https://circleci.com/gh/letterpad/letterpad.svg?style=shield&circle-token=:circle-token)

Letterpad is an open-source and a high performant publishing engine for blogs with a state-of-the-art technology. It uses React, Graphql, Express and Sequelize ORM. Few of the core features are listed below:

- Server side rendering
- Multi author support
- Comments (Disqus integration)
- Google Analytics
- Theme support
- Multi-level navigation
- Image optimizer
- React with styled-components for styling
- GraphQL for json API
- Roles - Admin, Reviewer, Author, Reader
- Markdown and RichText editor
- Search Engine Optimised
- Multi-language support with react-i18next (currently en, fr and pl)

## Update:

Letterpad now has a CLI tool to manage installations and upgrades. [Check it out here](https://github.com/letterpad/letterpad-cli).

## Contents

- [Demo](#demo)
- [Installation](#installation)
- [Production Builds](#production-builds)
- [How it works](#how-it-works)
- [Graphql API](#graphql-API)
- [Translations](#translations)
- [Database seeding](#seeding)
- [Additional Links](#additional-links)
- [Contribute](#contribute)

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

## Installation

There are three steps to install letterpad in the development environment.

1.  Open a terminal and clone the project:

```
git clone https://github.com/letterpad/letterpad.git
cd letterpad
```

2.  Make a copy of `sample.env` and name it `.env`. Open it and change `SECRET_KEY` to a random string to secure your app. Then add your SMTP credentials so email can be sent. Change the database options accordingly. By default, letterpad uses `sqlite`.

3.  Install dependencies and run (**use yarn to install dependencies**):

```sh
NODE_ENV=dev yarn install
# Seed the database and run migrations
./utils/postinstall.sh
# run in dev mode
yarn dev
```

Now visit [http://localhost:4040](http://localhost:4040) and checkout the welcome page.

To visit the admin panel, visit [http://localhost:4040/admin](http://localhost:4040/admin) and login with

```
Email: demo@demo.com
PAssword: demo
```

## Production Builds

The below command will create a build for the `api`, the `admin dashboard` and the `theme`. You will have to specify which theme you want to build.

```
theme=hugo yarn build
```

- This will create a folder called `apiBuild` which will contain all contents of the `api` folder in ES5.
- All the admin dashboard specific bundle will be in `admin/public/dist` folder.
- All the theme specific bundles will be in `client/hugo/public/dist` folder.
- The vendor bundles are common between admin and client. So they will be in `public/js` folder.

## How it works ?

Letterpad needs two servers to run your blog. One server runs Graphql API and the other server runs the Letterpad Engine. However with little modification, you can combine this to use one server.

Themes have their own separate repository. While doing `yarn install`, the default theme `hugo` is fetched as a dependency during the installation. If the theme already exist, this step will be ignored.

If you want to develop a theme, read the [documention](https://letterpad.app/docs/page/theme-introduction).

## Graphql API

The `api` folder has well defined schemas in the `schema` folder and its resolvers in the `resolvers` folder. If you wish to make any change in the database, then you should create a migration file. To create a migration file, enter this command:

```sh
yarn sequelize migration:generate --name specify-a-name-for-this-migration

#eg.
yarn sequelize migration:generate --name addGoogleAnalyticsField
```

The above migration will be created in `api/housekeeper/migrations/xxxxxxxx-addGoogleAnalyticsField.js

In order to run the migrations, enter the below command.

```sh
yarn sequelize db:migrate
```

You can play around with the Graphql API locally on [http://localhost:3030/graphql](http://localhost:3030/graphql)

## Translations

Letterpad uses react-18next library to handle translations. To add, edit or delete trannslation objects,
you can use the below commands:

```sh
usage: yarn [operation] [options] [key=value || key]
    operation (Required):
        -a, --add     Add key value pair to all files
        -s, --set     Set value of an existing key in all files
        -d, --del     Delete key from all files
            --sync    Sync all files with en.json
    options (Optional)
        -en     Operation only on this file
        -fr     Operation only on this file
        -pl     Operation only on this file
```

```sh
# Adds the translated value, only in en.json and for others leave it blank.
yarn translate --add save="Save"

# Set the translated value only in en.json and for others, set the value to empty string.
yarn translate --set oldKey="New Value"

# sets a translation object in one file
yarn translate --set -en oldKey="New Value"

# deletes a translation object from all files
yarn translate --del save

# deletes a translation object from one file
yarn translate --del -en tags.title

# sync all files with en.json
yarn translate --sync
```

## Seeding

If you want to seed the database with sample data, run the below command:

```sh
// you should have babel-cli installed. Its good to have this package installed globally.
yarn seed
```

## Additional Links:

- [Installing in Production](https://medium.com/@ajaxtown/installing-letterpad-in-digital-ocean-8ed53c66b114)

- [Letterpad - Slack](https://letterpad.slack.com)

- [Slack invite Link](https://tinyurl.com/letterpad)

## Contribute

Letterpad is in its early stages and requires support to move ahead. You can contribute through various ways like
testing, ideas, recommendations, fixing bugs, documentation, logo design, assets, etc. You can join the slack channel (letterpad.slack.com) for discussions. Thanks.

## Contributors

Thanks to all the people who contributed. [[Contribute](CONTRIBUTING.md)].

- Abhishek Saha | <a target="_blank" href="https://github.com/ajaxtown">@ajaxtown</a>
- Tien Pham | <a target="_blank" href="https://github.com/tienpham94">@tienpham94</a>
- Aleksey Derkach | <a target="_blank" href="https://github.com/alder">@alder</a>
- Boopathi Rajaa | <a target="_blank" href="https://github.com/boopathi">@boopathi</a>
- Todd Cantley | <a target="_blank" href="https://toddcantley.com">toddcantley.com</a>

## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/letterpad#backer)]

<a href="https://opencollective.com/letterpad#backers" target="_blank">
    <img src="https://opencollective.com/letterpad/backers.svg?width=890">
</a>

## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/letterpad#sponsor)]

<a href="https://opencollective.com/letterpad/sponsor/0/website" target="_blank">
    <img src="https://opencollective.com/letterpad/sponsor/0/avatar.svg">
</a>

## License

Letterpad is released under the MIT License.
