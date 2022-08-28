# Decarb My State

Chi Hack Night data visualization project to measure the state and progress of decarbonization for all States in the USA.

- [Running project notes](https://docs.google.com/document/d/14gs7gO9YmBgIWOMd7oGXmIF1XRwfBIt8jGTOpn8udjg/edit#heading=h.n9cfl96c3r81)
- [Wireframes](https://app.moqups.com/pcSQvUMmsyAa1SN58KaKg1EKuYRs8iRX/view/page/a68639957)

This is a Gatsby app built on top of the [DataMade Gatsby starter template](https://github.com/datamade/how-to/tree/master/docker/templates), which was adapted from the [default Gatsby starter repo](https://github.com/gatsbyjs/gatsby-starter-default).

### 💾 Requirements

- [Docker](https://docs.docker.com/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### 🚀 Quick start

1. Grab the repo:

   ```shell
   git clone git@github.com:chihacknight/decarbonize-my-state.git
   cd decarbonize-my-state
   ```

2. Start developing

   ```shell
   docker-compose up --build
   ```

   Your site should now be up and running at `http://localhost:8000`!

## Dependencies

This starter has a minimal number of dependencies in order to stay lean, but you'll likely want to add more to suit your needs. To add a dependency, run:

```shell
docker-compose run --rm app add <dependency name> --save
```

To remove a dependency:

```shell
docker-compose run --rm app remove <dependency name>
```

## Testing & syntax linting

When you run `docker-compose up` locally, ESLint makes sure you're following the right JS style conventions and not importing or exporting anything extraneously. If you are, the build will fail.

If you want to check the linter on its own you can run:

```
docker-compose run --rm app run test
```

To auto-fix, run this command with `--fix` like so:

```
docker-compose run --rm app run test --fix
```

## Data processing

All data that appears on the frontend of this site should come directly from a file in `data/final`—for more on that line of thinking, see [this guide to data handling](https://github.com/datamade/how-to/blob/master/gatsby/recharts.md#on-data-transformation) in Gatsby. The data processing pipeline for this project lives in `data/` and follows DataMade's [data making guidelines](https://github.com/datamade/data-making-guidelines). As these files are relatively small, we keep both raw and final data under version control.

To recreate the data, run:

```bash
cd data
docker-compose up --build
```

### Social Cards

We wanted the social cards to include what number emitter the state is and what their emissions breakdown is. To do this, we created a social card page and used puppeteer to take screenshots to output get the dynamic social cards. The new screenshots can be found in `/static/social-cards`

**To generate them:**

First make sure `yarn develop` is running
Then run `yarn generate-social`

### 🤖 What's inside?

_Taken from `gatsby-starter-default`_

A quick look at the top-level files and directories you'll see in a Gatsby project.

    .
    ├── .github/workflows
    ├── src
    ├── static
    ├── .gitignore
    ├── .prettierrc
    ├── gatsby-browser.js
    ├── gatsby-config.js
    ├── gatsby-node.js
    ├── gatsby-ssr.js
    ├── LICENSE
    ├── package-lock.json
    ├── package.json
    └── README.md

1.  **`/.github/workflows`**: This directory contains the project's [Github Actions](https://github.com/features/actions). By default, `test.yml` runs a linter.

2.  **`/src`**: This directory will contain all of the code related to what you will see on the front-end of your site (what you see in the browser) such as your site header or a page template. `src` is a convention for “source code”.

3.  **`/static`**: This directory contains files you'll need to access directly on the frontend, like images for social cards.

4.  **`.eslintrc.js`**: This is a configuration file for [ESLint](https://eslint.org/), a Javascript linter.

5.  **`.gitignore`**: This file tells git which files it should not track / not maintain a version history for.

6.  **`gatsby-browser.js`**: This file is where Gatsby expects to find any usage of the [Gatsby browser APIs](https://www.gatsbyjs.org/docs/browser-apis/) (if any). These allow customization/extension of default Gatsby settings affecting the browser.

7.  **`gatsby-config.js`**: This is the main configuration file for a Gatsby site. This is where you can specify information about your site (metadata) like the site title and description, which Gatsby plugins you’d like to include, etc. (Check out the [config docs](https://www.gatsbyjs.org/docs/gatsby-config/) for more detail).

8.  **`gatsby-node.js`**: This file is where Gatsby expects to find any usage of the [Gatsby Node APIs](https://www.gatsbyjs.org/docs/node-apis/) (if any). These allow customization/extension of default Gatsby settings affecting pieces of the site build process.

9.  **`gatsby-ssr.js`**: This file is where Gatsby expects to find any usage of the [Gatsby server-side rendering APIs](https://www.gatsbyjs.org/docs/ssr-apis/) (if any). These allow customization of default Gatsby settings affecting server-side rendering.

10. **`LICENSE`**: Gatsby is licensed under the MIT license.

11. **`package.json`**: A manifest file for Node.js projects, which includes things like metadata (the project’s name, author, etc). This manifest is how npm knows which packages to install for your project.

12. **`README.md`**: A text file containing useful reference information about your project.

### 🎓 Learning Gatsby

Looking for more guidance? Full documentation for Gatsby lives [on the website](https://www.gatsbyjs.org/). Here are some places to start:

- **For most developers, we recommend starting with our [in-depth tutorial for creating a site with Gatsby](https://www.gatsbyjs.org/tutorial/).** It starts with zero assumptions about your level of ability and walks through every step of the process.

- **To dive straight into code samples, head [to our documentation](https://www.gatsbyjs.org/docs/).** In particular, check out the _Guides_, _API Reference_, and _Advanced Tutorials_ sections in the sidebar.

### 💫 Deploy

DataMade deploys static sites using Netlify. This project's staging URL is [decarbonizemystate.com](https://decarbonizemystate.com/).
