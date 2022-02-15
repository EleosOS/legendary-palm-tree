# legendary-palm-tree

Private Discord bot made with [Detritus](https://github.com/detritusjs/client), specifically for a private friend server.

## Features:
-   Automatically change the hue of the server picture, with customizable cron expressions and step size
-   Allow users to create/remove their own custom roles with colors and names
-   Only uses webhooks for info logging, so message destinations can be customized
-   Only uses slash commands instead of text-based commands

## Self-Hosting
This bot is only meant to be used on one server, not multiple!

A "high-ish" node version (not sure which versions are supported exactly, but the latest LTS should work) and MySQL are required.

A Discord application with bot account needs to be made, guides for that can be found online. The MySQL server needs to have a user for the bot and a database set up, the bot should *theoretically* set up the tables itself.

Once that is given, you can fill out `config_example.ts`, download the dependencies with `npm install` and compile and run the code with `npm start`.
