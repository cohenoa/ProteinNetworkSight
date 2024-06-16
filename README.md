# Code to accompany the paper: ”ProteinNetworkSight efficiently transforms co-expressed protein lists into interactive networks and offers suggestions for their modifications”



## Files

### `routes.py`

This file contains the Flask routes and API endpoints for the application.

### `src/`

This folder contains various modules and functions used by the Flask application.

#### `src/validate.py`

This file contains the `cal_string_id` function used in the `/api/validate` route to validate a name and return a matching ID.

#### `src/graph_data.py`

This file contains the `make_graph_data` function used in the `/api/graphs` route to generate nodes and links for creating a graph.

#### `src/organism_list.py`

This file contains the `get_organism_list` function used in the `/api/organism` route to retrieve a list of available organisms.

#### `src/user_register.py`

This file contains the `register_user` function used in the `/api/user` route to create a new user table.

#### `src/names.py`

This file contains the `cal_string_suggestions` function used in the `/api/names` route to provide suggestions for matching names.

#### Routes

- `/api/` (GET): Returns a welcome message.
- `/api/organism` (GET): Returns a list of available organisms.
- `/api/names` (POST): Given a list of organism names and an organism, returns a list of matching names with suggestions.
- `/api/validate` (POST): Given a name and an organism, returns a matching ID.
- `/api/user` (POST): Creates a new user table with provided proteins, IDs, and string names.
- `/api/graphs` (POST): Given a user ID, values map, and thresholds, returns nodes and links for creating a graph.

## Installation
### This is not a full installation for this project some parts are left out. (like a postgres installation with the STRING DB)
## This is left out do to security reasons

1. Clone the repository.
2. Install the required dependencies (e.g., Flask, Flask-CORS).

## Execution

1. Navigate to the project directory.
2. Run the Flask application with `python routes.py`.
3. The server will start running on `http://0.0.0.0:3000`.

## Data

The application likely uses some data sources or databases to retrieve information about organisms, proteins, and their interactions. The specific data sources are not included in the provided code.
