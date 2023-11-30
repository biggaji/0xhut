# 0xhut
Easy authentication flow. A implementation similar to 0Auth. It aims to be RESTful.

## Testing
- Fork this repo.
- Run `yarn` or `npm install`. Either works file.
- Create a .env file in your root directory, set the `MONGO_ENDPOINT` to equal your mongo instance url.
- Make sure you have docker installed on your system. Else follow this guide to install ![Docker](https://docs.docker.com/get-started/overview/)
- Open your terminal and run `docker-compose up` to start the server.
- You can now make API requests to `localhost:3000/identity`.
- Follow the route declared in the route files, to understand how it works :).

Thank you and happy coding!
