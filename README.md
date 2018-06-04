# Letterpad &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/ajaxtown/letterpad/blob/master/LICENSE) ![CircleCI Status](https://circleci.com/gh/ajaxtown/letterpad.svg?style=shield&circle-token=:circle-token)

Welcome to Letterpad, an open source minimalistic blogging engine which is easy to install, customize and extend. It is a single page application and loads content on the fly. It uses React, Graphql, Express and Sequelize ORM. It is in its early stages, but it covers most of the features that you will need to write a blog post. It supports multiple themes and each theme comes with its own set of features. Also it supports a markdown editor along with a rich text editor.

A verbose documentation can be found at [https://letterpad.app/docs](https://letterpad.app/docs)

#### Why Letterpad ?

Lettterpad uses modern technologes to speed up your blog with a clean user interface and tries to keep the loading time below 3 seconds on a decent internet connection. It is rediculously fast. It has SEO built-in, so you will not need any third party libraries for this. There are optimised URLs, Facebook open graph, Twitter cards and semantic markup. It has been built for users with very little to no technical knowledge and is much easier to setup. Developers will find it pleasant to tweak letterpad and build additional features on top of it.

Also, every part of Letterpad including its core files can be extended. The default themes of Letterpad focuses more on content and keeps it away from distractions. The API of letterpad exchanges information in json and you have full control over what data to get, set and display. You can build entire publishing apps on top of it, and completely customise the reader experience.

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

To visit the admin panel, visit [http://localhost:4040/admin](http://localhost:4040/admin)

### License

Letterpad is released under the MIT License.
