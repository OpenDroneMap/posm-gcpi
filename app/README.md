## Ground Control Point interface

## Setup
1. Clone the project.
2. `npm install`

## Local development
Use `npm start` to run the app locally.


## Deploy
Make sure to set the `homepage` value in package.json with the path in which the app is served.

Use `npm run build` to bundle source code into deployable files. Output of this process will be put into the `build` directory. The `build` directory is tracked.

### Deploy [posm-local-home](https://github.com/posm/posm-local-home)
* Run `npm run build:plh` and commit changes.

* Then commit the `build` folder to the `dist` branch by running: `git subtree push --prefix app/build origin dist` from the root directory.

