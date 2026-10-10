# Session 3 Inventory Classroom

A local React classroom project for practicing inventory testing, product validation, source investigation, and selected automation. The project is separate from the hosted Techlith Lab and uses only its own in-memory classroom state.

## Prerequisites

- Node.js 24 LTS and npm are recommended. The project was verified in this environment with Node.js `v23.4.0` and npm `10.9.2`; Node.js 24 LTS was not available here for verification.
- A terminal and a code editor.

An earlier environment used Node.js `v16.17.1` and npm `8.15.0`. Installation reported engine warnings for two transitive packages that declare Node.js 18 or newer, although the classroom build and test commands completed. Node.js 18 is no longer a supported release, so use a currently supported Node.js LTS version.

## Setup and start

1. Extract the ZIP file.
2. Open a terminal in the extracted `session-3-inventory-classroom` folder.
3. Install dependencies with `npm install`.
4. Start the local application with `npm start`.
5. Open the local address shown in the terminal.

Keep the local development server on a trusted device and stop it when you finish the classroom activity. Do not expose it to untrusted networks.

## Automated tests

Run the test suite without watch mode:

```sh
npm test -- --watchAll=false
```

The suite contains inventory boundary scenarios and a product requirement check. Record the results you observe, including the test names and command used.

## Project structure

- `src/App.js` — classroom screens and in-memory interactions.
- `src/inventoryRules.js` — inventory and product rules used by the app.
- `src/inventoryRules.test.js` — automated rule checks.
- `src/styles.css` — application styles.
- `src/index.js` — application entry point.
- `public/index.html` — HTML document loaded by the development server.
- `package.json` and `package-lock.json` — project scripts and dependency versions.

## Manual testing workflow

Use the Inventory dataset screen to inspect the starting records. Use Boundary Testing to submit inventory transactions. Use Product Validation to submit products and observe the local catalog. Reset the classroom to restore its starting state between scenarios.

## Source investigation workflow

Inspect the application and rule files. Compare the written product requirements with observed behavior and the automated test results. Record your own steps, inputs, expected observations, and actual observations as evidence.

## Retest and regression workflow

After making a source change in your extracted project, run the automated tests again and repeat relevant manual scenarios. Record the commands and results. The downloaded project runs locally; your edits do not change the hosted Techlith Lab.

## Data isolation

This project keeps its classroom inventory and product catalog in local application memory. It does not connect to or modify Techlith Lab's main inventory, stock history, report, or testing data.
