# Car Sharers

Final University project focus on a car sharing service.

- Next JS
- React JS
- Express JS and Node
- Mongo DB and Mongoose 
- Leaflet Map and Leaflet Routing Machine
- Moment JS

## Tested on

Opera,Chrome, Edge and Firefox

It should be operational on mobile and tablets

## Requirements 

- Mongo DB 
- Import the fuelPrices.json file in the repository and create a mongo collection with the name carsspecs. 
  - Fuel price collection is needed for the fuel consumption calculation
  - Use the API to add new car specs 
    - /cars-specs/insert 
      - It requires ,**fuelConsumption** and **numberPlate**
      - It is an optional section aimed to mimic an external api with car details
      - if user car is matched via the number plate it will pick up the fuel consumption of that car
      - if car is not matched default of 69 is assigned
- Google Auth Account 
- .env with the following 
  - PORT=5000 or any other port
  - DBNAME= carSharers - optional 
  - DBURL= mongodb://localhost:27017/ or your own configuration
  - SECRET= any word 
  - BASE_URL=http://localhost:5000 depending on PORT above
  - CLIENTID= From google
  - ClientSecret= From google
  - CHOKIDAR_USEPOLLING=true

## Installation

- `yarn`
- `npm install`

## Run commands 

### Dev on server 

use `npm run dev` or `yarn dev` 

### Run only next localhost

use `npm run next or `yarn next` 

### Build with 

use `npm run build or `yarn build` 

### Run as production 

use `npm run start or `yarn start` 

- It requires nodemon and it will run the index.js file in server folder



## Issues 

- Global state management tool is needed to use for the storage of a user instead of using a function on each page within the getInitialProps() to grab the user