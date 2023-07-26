# Home-Test-OSR
OSR Back-end home test

## About The Project
Website (only back-end) that displays global Bitcoin news articles of the last month.

### Built With
* Node.js
* MongoDB

## Getting Started
### Installation
1. Clone the repo
   ```sh
   git clone https://github.com/Chavi744/Home-Test-OSR.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```

## Usage
Run the attached GET request in Postman.
In the query you need to put a date (in all formats: "YYYY-MM-DD", "YYYY/MM/DD", "MM-DD-YYYY", etc.) that you want receive data of 30 days before.
### notice!
You can enter any date in query, but if you have the free version of 'News API' you won't be able to get news. The free version provides information only up to 30 days before.
Therefore, if you use this version, enter the current date in the format you want.

### the order of perform postman calls :
* The first time you run the request, the information will be retrieved from the external API because the DB is still empty.
* The second time run the request less than 10 minutes later, the information will be retrieved from the cache.
* The third time run the request after more than 10 minutes, the information will be pulled from the DB.
* When you run the request with a later date you can see that some of the information comes back from the DB and some from the external API. In case you run the current date due to the free version you will only be able to see it if you run at least a day after...

(You can see the messages in the console).
