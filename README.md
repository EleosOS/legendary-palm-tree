# legendary-palm-tree

Private Discord bot made with [Detritus](https://github.com/detritusjs/client), specifically for a private friend server.

## Features:
-   Change the hue of the server picture by 10° every day
-   Allow users to create/remove their own custom roles with colors and names
-   Uses slash commands instead of text-based commands.

## Self-Hosting

Self-hosting is currently very much not recommended, but not impossible. This bot requires a higher node version (not sure which versions are supported exactly, but the latest LTS should work) and MySQL.

A Discord application with bot account needs to be made, guides for that can be found online.

A MySQL server and database with tables needs to be set up manually, right now however there are no instructions whatsoever. A basic structure can be made up from the queries used in the code, if you're desperate. Proper instructions, an automatic set up of a database and perhaps even a Docker Image will be made in the future.

If there is a database, you can fill out `config_example.ts`, download the dependencies with `npm install` and compile and run the code with `npm start`.