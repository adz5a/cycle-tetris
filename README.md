# README

## Step 0 - Install

This repository is a demo of a simple Tetris game using the latest version of
CycleJS and its library ecosystem:

- `@cycle/run`
- `@cycle/dom`
- `@cycle/state`
- `xstream` (Stream library powering cycleJS)

As well as Typescript

To install the project, run `yarn` or `npm install`

To run: `yarn webpack-dev-server --config config/webpack.js`

It should start the server on port `8080`. Then open the `src/index.ts` file.
Replacing the `"hello world"` string should result in the page reloading itself
with the new message.
