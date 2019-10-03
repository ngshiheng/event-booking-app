# An Event Booking App - Easy Booking

![alt text](https://i.imgur.com/Erh6Ily.png)
This is a very basic event booking web application which allows user to sign up, login, create their own events, make bookings or cancel their own bookings. User is able to have a very basic graphical view of the summary of the bookings they have made.

# Project Overview

This application is built using:

- Frontend: *React*

- Backend: *Node.js Express + GraphQL*

- Database: *MongoDB*

![alt text](https://i.imgur.com/jcfz7OK.png)

## Installation

Use the package manager [npm](https://docs.npmjs.com/cli/install) to install the dependencies.

```bash
npm install
```

## Usage

To run the entire application, you'll need to keep both the client and server running.

Create a `.env` file with all the required information and environment variables
```
$ touch .env
```

Example of how your `.env` file should look like:
```
MONGO_USER=your_own_username
MONGO_PASSWORD=your_super_secretive_password
MONGO_DB=your_wonderful_database_name
MONGO_TEST_DB=testing_database_name
```

*Please change the `project-dir-name` accordingly.*

Running the Node.js backend:

```
$ cd project-dir-name
$ npm install
$ npm start
```

Running the React front-end client server:

```
$ cd project-dir-name/frontend
$ npm install
$ npm start
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)