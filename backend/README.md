# ThePlotPot

## Table of Contents
- [Introduction](#introduction)
- [Installation](#installation)
  - [Node.js and npm](#nodejs-and-npm)
  - [Redis](#redis)
  - [MySQL](#mysql)
  - [Setting up MySQL Database](#setting-up-mysql-database)
  - [Configuring Environtment variables](#configuring-environment-variables)
  - [Installing Dependencies](#installing-dependencies)
  - [Running the Application](#running-the-application)
  - [Integrating Frontend with Backend](#integrating-frontend-with-backend)

## Introduction
This is the backend for the ThePlotPot project. It is responsible for handling hosting the frontend and commnunication between frontend and database.

## Installation

### Node.js and npm
Ensure you have Node.js and npm installed on your machine. You can download them from [Node.js official website](https://nodejs.org/).

### Redis
Install Redis. Follow the instructions on the [official Redis website](https://redis.io/download) for your operating system.

### MySQL
Install MySQL. You can download MySQL Community Server from [MySQL Downloads](https://dev.mysql.com/downloads/mysql/).

### Setting up MySQL Database
1. Create a new MySQL user and database for the project:

    ```sql
    CREATE DATABASE your_database_name;
    CREATE USER 'your_username'@'localhost' IDENTIFIED BY 'your_password';
    GRANT ALL PRIVILEGES ON your_database_name.* TO 'your_username'@'localhost';
    FLUSH PRIVILEGES;
    ```

   Replace `your_database_name`, `your_username`, and `your_password` with appropriate values.

2. Create necessary tables by running the SQL script provided:

    ```bash
    mysql -u your_username -p your_database_name < path/to/your/create_db.sql
    ```

   Replace `your_username`, `your_database_name`, and `path/to/your/create_db.sql` with your MySQL credentials and the path to the SQL script. Script is located in backend folder.


### Configuring Environment Variables
1. Copy the `.env.example` file:
    ```bash
    cp .env.example .env
    ```

2. Open the `.env` file in a text editor:
    ```bash
    code .env
    ```

3. Generate 3 Secure Secrets 
- On Windows:  
  Use the following PowerShell command to generate a secure, random Base64-encoded secret:
  ```powershell
  [Convert]::ToBase64String((New-Object Byte[] 32 | % { [void][System.Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($_); $_ }))
  ```
- On Linux:
  Use the openssl command to generate a secure, random Base64-encoded secret:
  ```bash
  openssl rand -base64 32
  ```

4. Replace the placeholder values with your actual configuration details. Edit the following variables:
- Database Configuration:
   - `DB_HOST`
   - `DB_PORT` (If not default 3306)
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME`

- Redis Configuration:
   - `REDIS_HOST`
   - `REDIS_PASS`
   - `REDIS_PORT` (If not default 6379)

- Application Configuration:
   - `PORT`
   - `URL`
   - `Domain`
   
- Secret Keys
   - `RECAPTCHA_SECRET_KEY` (replace with your Google reCAPTCHA secret key)
   - `IDSECRET` (generate a strong and unique secret)
   - `SECRET` (generate a strong and unique secret)
   - `CSRF_SECRET` (generate a strong and unique secret)
    
5. Save the `.env` file.


### Installing Dependencies
Run the following command in the project directory to install dependencies:

```bash
npm install
```

## Integrating Frontend with Backend

### Configure Google reCAPTCHA
Replace the google reCaptcha site key with your key in theplotpot-frontend/public/index.html

### Building Frontend

1. Navigate to the frontend directory:

    ```bash
    cd theplotpot/theplotpot-frontend/
    ```


2. Install frontend dependencies:

    ```bash
    npm install
    ```

3. Build the frontend:

    ```bash
    npm run build
    ```

   This will generate the necessary build files in the `theplotpot/theplotpot-frontend/build/` directory.

### Integrating with Backend

1. Copy the built frontend files to the backend's `dist` directory:

    ```bash
    cp -r theplotpot/theplotpot-frontend/build/* theplotpot/backend/dist/
    ```

   Ensure that the `theplotpot/backend/dist/` directory now contains the built frontend files.

2. Start the backend server:

    ```bash
    cd theplotpot/backend/
    npm start
    ```

   The server will now serve both the backend and the integrated frontend.

Visit url:your_port to access the application, replacing `url` `your_port` with the specified url and port for the backend.

Now, your application should be up and running with the integrated frontend and backend.

