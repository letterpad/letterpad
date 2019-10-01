&middot; [![Backers on Open Collective](https://opencollective.com/letterpad/backers/badge.svg)](#backers) [![Sponsors on Open Collective](https://opencollective.com/letterpad/sponsors/badge.svg)](#sponsors) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/letterpad/letterpad/blob/master/LICENSE) ![CircleCI Status](https://circleci.com/gh/letterpad/letterpad.svg?style=shield&circle-token=:circle-token)

<img src="banner.jpg">

<p align="center">
  An open-source and a high performant publishing engine for blogs <br/>
  with state-of-the-art technology.
</p>

<br/>

It uses React, Graphql, Express and Sequelize ORM. Few of the core features are listed below:

- Server side rendering
- Static Site creation
- Multi author support
- Comments (Disqus integration)
- Google Analytics
- Theme support
- Multi-level navigation
- Image optimizer
- Styled-components
- GraphQL
- Roles - Admin, Reviewer, Author, Reader
- Markdown and RichText editor
- Search Engine Optimised
- Multi-language support with react-i18next (currently en, fr and pl)

## Contents

- [Demo](#demo)
- [Installation](#installation)
- [Production Builds](#production-builds)
- [Additional Links](#additional-links)
- [Contribute](#contribute)

## Demo

To check letterpad in action, check out this [Demo Site](https://letterpad.app/demo).
You can visit the [Admin Panel](https://letterpad.app/demo/admin/login) and login with

```
Email: demo@demo.com
Password: demo
```

## Documentation

Documentation can be found at [https://docs.letterpad.app](https://docs.letterpad.app).

Letterpad is an open source project, licensed under MIT.

## Installation

Run the below commands to install:

```
git clone https://github.com/letterpad/letterpad.git
cd letterpad
yarn install
yarn dev
```

At this point an environment file has been created at the root by the name `.env`.

**Optional:**

Open the .env and change `SECRET_KEY` to a random string to secure your app. Then add your SMTP credentials for emails to work. Change the database options accordingly. By default, letterpad uses `sqlite`.

Now visit [http://localhost:4040](http://localhost:4040) and checkout the welcome page.

To visit the admin panel, visit [http://localhost:4040/admin](http://localhost:4040/admin) and login with

```
Email: demo@demo.com
PAssword: demo
```

## Production Builds

The below command will create a build for the `admin dashboard` and the `theme`. It will build the default theme, Hugo

```sh
yarn build # creates a /dist folder
yarn prod  # run production
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
