# Dashboard Site Setup - MERN
\* Node Version 20.12+ required!
## Backend (Express + MongoDB + Pinecone)
1. `$ cd` into the `server/` directory
2. Run `$ npm install`
3. Create `config.env` file with same variables as in `config.env.template` file, and replace the corresponding values (you can ignore the 4 AUTH0 values for now)
4. Run the server with `$ node --env-file=config.env server.js`
## Frontend (React + Vite)
1. `$ cd` into the `client/` directory
2. Run `$ npm install`
3. Run `$ npm run dev`
