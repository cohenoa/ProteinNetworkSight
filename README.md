# Code to accompany the paper: ProteinNetworkSight: A User-Friendly Platform for Transforming Co-Expression Patterns into Actionable Therapeutic Insights Through Interactive Network Visualization

Protein network sight for running the development server you can use the following commands on the branch layout-chooser.

This project contains both a frontend React app and a backend Flask API.

Frontend The frontend code is located in the frontend folder. It contains a React app built with Create React App.

To run the frontend:

cd frontend npm install npm start

The React app will start on http://localhost:3000.

The main frontend code is located in src.

Backend The backend code is located in the backend folder. It contains a Flask API.

To run the backend:

cd backend pip install -r requirements.txt python app.py

The Flask API will start on http://localhost:5000.

The main backend code is located in app.py. The backend depends on some packages like Flask, pandas, etc which are listed in requirements.txt.

Connecting Frontend and Backend The frontend makes API calls to the backend Flask API. The API endpoints are defined in app.py.

Some examples:

GET /data - Get some data POST /predict - Make predictions based on input data The frontend code makes these API calls using fetch or a library like Axios.

Deployment The frontend and backend can be deployed separately.

The frontend can be built into static assets using npm run build and deployed to any static hosting service like AWS S3, Netlify, etc.

The backend can be deployed to a server like AWS EC2, Heroku, etc.

Documentation More detailed documentation on the project structure, architecture and API endpoints is located in the docs folder.

for running the pruduction server you can use the following commands on the branch develop-docker: cd frontend docker build -t medmolnet-frontend .

cd ../backend docker build -t medmolnet-backend .

cd .. docker-compose up -d

for creating your configuration of the nginx you will need to create a file called nginx.conf in the root folder of the project.

Create a domain name and replace the domain name in the docker-compose file with your domain name and your own mail in the Certbot configuration for the ssl configuration of the domain or buy it from a reputable source and run the nginx config without the ssl configuration (as an http without the ssl certificate) and comment out the ssl configuration in the nginx.conf file and run the docker-compose up -d command again.

it is currently set to run on the port https://localhost:443/ you can change it in the nginx configuration file and the docker-compose. the backend server will be run on https://localhost:443/api/.

Create The DB to create the db you can download the db files from the following link:https://string-db.org/cgi/download?sessionId=b4AnT38sBJT9 download the network_schema.v12.0.sql.gz and the items_schema.v12.0.sql.gz files create them in postgres and change the connection to it in the code to your own connection. our advice is to create it in the docker container of postgres so you can delete or stop its run at your own need.
