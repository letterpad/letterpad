# Letterpad &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/ajaxtown/letterpad/blob/master/LICENSE) ![CircleCI Status](https://circleci.com/gh/ajaxtown/letterpad.svg?style=shield&circle-token=:circle-token)

Letterpad is an open source and minimalistic blogging platform. The main focus of letterpad is speed and has all the major features that you would need. It is not a software for building big commercial websites.

### Technologies

Letterpad has been developed with React, uses Graphql as a datalayer and runs on NodeJS. JSON WebTokens are used to validate authenticated users accessing the dashboard and the frontend is accessed independently without tokens. This seperation is great if you want to build your own client in different technologies. It uses the famous ORM Sequalize to connect to database and this gives the flexibility to choose any kind of database, Mysql, PostgreSQL, SQLite, etc.

### Installation

There are three steps to install letterpad in the development environment.

1.  Open a terminal and clone the project:

```
git clone https://github.com/ajaxtown/letterpad.git
cd letterpad
```

2.  Make a copy of `sample.env` and name it `.env`. Open it and change `SECRET_KEY` to a random string to secure your app. Then add your SMTP credentials so email can be sent. Change the database options accordingly. By default, letterpad uses `sqlite`.

3.  Install dependencies and run (**use yarn to install dependencies**):

```
yarn install
THEME=document npm run dev
```

Now visit [http://localhost:4040](http://localhost:4040) and checkout the welcome page.

### License

Letterpad is released under the MIT License.
