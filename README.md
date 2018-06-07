# Letterpad &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/ajaxtown/letterpad/blob/master/LICENSE) ![CircleCI Status](https://circleci.com/gh/ajaxtown/letterpad.svg?style=shield&circle-token=:circle-token)

Letterpad is an open-source and a high performant publishing engine for blogs with a state-of-the-art technology. It uses React, Graphql, Express and Sequelize ORM. It is in beta now. Few of the core features are listed below:


- Server side rendering
- Multi author support
- Comments (Disqus integration)
- Google Analytics
- Theme support
- Multi-level navigation
- Image optimizer 
- GraphQL for json API
- Roles - Admin, Reviewer, Author, Reader
- Markdown and RichText editor
- Search Engine Optimised
- Multi-language support (currently en, fr and pl)


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



### License

Letterpad is released under the MIT License.
