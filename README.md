# Card Fraud Interception Plugin

This is a geolocation-based transaction plugin that can be used in ATMs to combat card fraud. It provides banks with quantitative statistics based on the number of ATMs in use. The frontend is developed using Reactjs, and the backend is developed using Flask, with Postgres SQL as the database.

## Features

- Geolocation-based transaction plugin to detect and prevent card fraud in ATMs.
- Provides quantitative statistics based on the number of ATMs in use.
- User-friendly interface developed using Reactjs for frontend.
- Flask used as the backend to handle API requests and responses.
- Postgres SQL used as the database to store user data and transaction history.

## Installation and Usage

To use this plugin, follow these steps:

1. Clone this repository.
2. Install the required dependencies for both frontend and backend using `npm install` and `pip install` respectively.
3. Create a Postgres SQL database to store user data and transaction history.
4. Set up the required environment variables for Flask backend and Reactjs frontend.
5. Start the backend server using `python app.py` in the terminal.
6. Start the frontend server using `npm start` in the terminal.
7. Access the application on your preferred web browser.

## API Endpoints

The following API endpoints are available:

- `GET /api/transactions`: Retrieves all transactions made by users.
- `GET /api/transactions/:id`: Retrieves a specific transaction by ID.
- `POST /api/transactions`: Adds a new transaction to the database.
- `PUT /api/transactions/:id`: Updates an existing transaction by ID.
- `DELETE /api/transactions/:id`: Deletes a transaction from the database by ID.
## Sample Creds 
-5747390137:Xgirln - Allison Sherman
-8626057123:K6vQKT - Shannon Hall

## Contributors

This project was developed by [NAMAN GUPTA ,RONIT KHATRI, B.S.N ABHIRAM]. If you encounter any issues or have any suggestions, feel free to contact us.

## License

This project is licensed under the [insert license name] license. See the [LICENSE](./LICENSE) file for more information.
