# Altınay Fleet

Welcome to the Altınay Fleet project! This repository contains the code for managing and tracking the fleet of vehicles at Altınay.


## Installation on Server Side

1. Install MongoDB to your system. You can use [this
](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/#std-label-install-mdb-community-ubuntu
) tutorial.

```bash
sudo systemctl start mongod
mongosh
```
2. Install MongoDB Compass to your system. You can use [this](https://www.mongodb.com/docs/compass/current/install/) tutorial. Start compass with this command:

```bash
mongodb-compass
```

3. Name your database in mongo-compass : 

```bash
altinay_amr_fleet
```

4. To start the 'server' direct to the 'server' directory

```bash
cd server
```

5. Install the dependencies for the backend of the application:

```bash 
npm install
```

6. To start the backend-side type this command:

```bash
npm start
```

## Installation on Client Side


1. From another terminal, navigate to the `client` directory:

```bash
cd client
```

2. After this step in the same  directory run the command :  
```bash
npm install
```

3. The last step is when the node modules downloaded run this command to start the React Application

```bash
npm start
```

And your App can be seen in localhost:3000
