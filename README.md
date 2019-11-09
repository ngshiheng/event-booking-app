# An Event Booking App - Easy Booking :ticket:

![alt text](https://i.imgur.com/Erh6Ily.png)
This is a very basic event booking web application which allows user to sign up, login, create their own events, make bookings or cancel their own bookings. User is able to have a very basic graphical view of the summary of the bookings they have made.

# Project Overview

This application is built using:

-   Frontend: _React_

-   Backend: _Node.js Express + GraphQL_

-   Database: _MongoDB_

![alt text](https://i.imgur.com/jcfz7OK.png)

## Requirements :notebook:

-   [Node.js](https://nodejs.org/en/) v11 OR above.

-   Package manager [npm](https://docs.npmjs.com/cli/install) to install the all dependencies.

-   Setup a [MongoDB](https://www.mongodb.com/) account and create a database there.

-   Setup environment variables in `.env` file, place it in the `/server` folder.
    -   _Reference: `.env.example`_

## Setup for Ubuntu :nut_and_bolt:

This project is tested and develop on Ubuntu 18.04 LTS.

### Using Bash Script :page_with_curl:

```bash
./setup.sh
./run.sh
```

### Using Manual Method :hammer:

Setup for Linux users

```bash
./setup.sh
```

Note: _If you're not using Linux, you need to manually run `npm i` at both `server` and `client` folder._

Start Express + GraphQL API backend:

```bash
cd server
npm start
```

`cd` back to the project directory

Start the React frontend:

```bash
cd client
npm start
```

### Using Docker :whale:

Make sure you have [Docker](https://docs.docker.com/install/linux/docker-ce/ubuntu/) installed on your machine.

```
docker-compose build
docker-compose up
```

## Contributing :construction_worker:

-   Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

-   Please run `./lint.sh` before commiting any code and make sure it passes all the lint and format check

-   Please make sure to update tests as appropriate.

## License :checkered_flag:

[MIT](https://choosealicense.com/licenses/mit/)
