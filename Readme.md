# InvestConnect-APP API

## Description

API Documentation: https://documenter.getpostman.com/view/31008872/2sAYHxn4EW#be5b3ad9-c002-4d8a-ae71-b1ac81fb36e4

## Methods and Endpoints

| Method | Endpoint                                       | Description                                      |
| ------ | ---------------------------------------------- | ------------------------------------------------ |
| POST   | /register                                      | Register a new user                              |
| POST   | /login                                         | Authenticate and sign in a user                  |
| GET    | /account/:user_id                              | Retrieve User Detail Data                        |
| GET    | /investors                                     | Retrieve All Investor Data                       |
| GET    | /umkm                                          | Retrieve All UMKM Data                           |
| POST   | /investors                                     | Add Investor                                     |
| POST   | /umkm                                          | Add UMKM                                         |
| GET    | /investors/:investor_id                        | Retrieve Detail Investor by ID                   |
| GET    | /umkm/:umkm_id                                 | Retrieve Detail UMKM by ID                       |
| POST   | /investments/requests                          | Add Investment Request to Investor               |
| POST   | /investments/offerings                         | Add Investment Offer to UMKM                     |
| GET    | /investments/requests/received                 | Retrieve All Received Investments Requests Data  |
| GET    | /investments/requests/sent                     | Retrieve All Sent Investments Requests Data      |
| GET    | /investments/offerings/received                | Retrieve All Received Investments Offerings Data |
| GET    | /investments/offerings/sent                    | Retrieve All Sent Investments Offerings Data     |
| PUT    | /investments/offerings/:investment_offering_id | Update Investment Offering Status                |
| PUT    | /investments/requests/:investment_request_id   | Update Investment Request Status                 |

## How to use

- First, clone this repository using this command: `git clone https://github.com/InvestConnect-Bangkit-2024/Backend-API.git`.
- Second, open your terminal and go to your project's root directory.
- Third, type `npm install` on your terminal and hit `Enter`.
- Fourth, type `node server.js` on your terminal and hit `Enter`.
- Finally, the server will run on your `http://localhost:3000`
