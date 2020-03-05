&middot; [![Backers on Open Collective](https://opencollective.com/letterpad/backers/badge.svg)](#backers) [![Sponsors on Open Collective](https://opencollective.com/letterpad/sponsors/badge.svg)](#sponsors) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/letterpad/letterpad/blob/master/LICENSE)

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

<table>
    <tr>
        <td align="center">
            <a href="https://github.com/ajaxtown"><img src="https://avatars3.githubusercontent.com/u/1502352?s=460&v=4" width="100px;" alt="Abhishek Saha" />
                <br /><sub><b>Abhishek Saha</b></sub></a>
           </td>
        <td align="center">
            <a href="https://github.com/tienpham94"><img src="https://avatars0.githubusercontent.com/u/25751050?s=460&v=4" width="100px;" alt="Tien Pham" />
                <br /><sub><b>Tien Pham</b></sub></a>
           </td>
        <td align="center">
            <a href="https://github.com/alder"><img src="https://avatars3.githubusercontent.com/u/199887?s=460&v=4" width="100px;" alt="Aleksey Derkach" />
                <br /><sub><b>Aleksey Derkach</b></sub></a>
        </td>
        <td align="center">
            <a href="https://github.com/boopathi"><img src="https://avatars1.githubusercontent.com/u/294474?s=460&v=4" width="100px;" alt="Boopathi Rajaa" />
                <br /><sub><b>Boopathi Rajaa</b></sub></a>
            </td>
       </td>
       <td align="center">
            <a href="https://toddcantley.com"><img src="https://cdn.dribbble.com/users/997175/avatars/normal/dd175be405cc04ac43be1877f521184d.png?1501249987" width="100px;" alt="Todd Cantley" />
                <br /><sub><b>Todd Cantley</b></sub></a>
            </td>
       </td>
    </tr>
</table>

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
