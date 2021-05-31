# README

This README file includes the composition and installation of the app.

## TEMPLATE COMPOSITION
***

## Base
* Languaje: React 17.0
* CSS: Tailwindcss. [Learn Tailwindcss](https://tailwindcss.com/)
* Redux
* Connected Store

## Code quality
* PropType
    > `Always use prop-types to define all the props in the components.`
* ESLint
    > `It is a linter to make the code easier to review.`

### Estructure

1. The name of main folders, functions files or class files:
    * Lower case
    * High dash
    * Singular
    * kebab-case (When it is not possible to use a single word)

2. The name of the rest folders:
    * Capital letter
    * camelCase

3. The name of the component folders will be the same as the main component that contains.

4. The component folders will contain:
    * A index.js to export the main component
    * A file with the main component and this file will have the same name as the folder that contains them
    * A CSS file

### Setup

* Package manager: Yarn. [Learn Yarn](https://yarnpkg.com/)
* The .env file will follow the react documentation. [Learn custom environment variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)
* The .gitignore will only contain project exclusions.
    >   The exclusions that do not belong to the project but to the developer, will be in the global .gitignore.
        [$ HOME] /. gitignore

### Code manners

* Number of lines: 120
* Spaces: 2
* Single element without children:  ` <Element /> `
* Standard variable names
    > e=error

    > evt=event

    > i=index

    > k=key

    > v=value

    > r=request

    > rs=response


* Standard functions names:
    > triggerClick: launch an event "on something"

    > handleClick: react to onClick

    > onClick

* GitHub
    * The name of the branches will be:
        ```

        ```
    * The branches will have the path:
        ```
        /feature
        /bugfix
        ```
    * When a branch is merged in develop it will be removed.

## INSTALATION
***

### Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```
