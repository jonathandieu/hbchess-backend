# HB-Chess Backend

This is the backend for the Hand Brain chess web applications that features a MERN stack. The endpoints are organize in order of the code on the controller. If the enpoint begins with [*] then it channels through our middleware and MUST contain a JWT token in the authentification from the request. Must have "Bearer `{JWT}`" in order to successfully pass our authentification.

## Endpoints

### User Controller (`/users`)

#### Register User (`/users/register`)

Registers a user in the database using the **IUser** model for the **User** schema. The registered user must verify their email before they are able to login. Additionally, encrpyts passwords using salt and hash. On success sends a success `message`.
Checks and throws an **Error** for iff:
- Fields are empty
- Username or emial already exists
- Invalid user data

#### Verify User (`/users/verify`)

Verifies a user from the given URL sent from Register User to the User's email. On success, redirects user to the login page.
Checks and throws an **Error** for iff:
- Provided token is invalid

#### Login User (`/users/login`)

Logins a user from the database using an email and password. Returns JWT for user.
Checks and throws an **Error** for iff:
- Account has been verified
- Invalid Credentials

#### *Get User (`/users/user`)

Gets the User from database from req.user after passing successfully through the middleware.
Checks and throws an **Error** for iff:

#### *Search User (`/users/search`)

Searches for a user in the database (that is not the actual user). It has a regular expression associated to it. It returns a list of the users found that contains only their usernames and ids. Max of 5.
Checks and throws an **Error** for iff:

### Team Controller (`/teams`)

#### *Create Team (`/teams/create`)

Creates a team in the database using the **ITeam** model for the **Team** schema. The created team has a recipient and sender. The recepient must confirm the team invite before the team can be used to play a game.
Checks and throws an **Error** for iff:
- Recipient is not verified
- Team request is pending
- Team already exists
- Username of recipient doesn't exist
- Invalid token

#### *Get Team (`/teams/get`)

Searches for all teams acssociated with the user. It returns a list full of the user teams that have been accepted (`team`) and still are pending (`teamNot`).
Checks and throws an **Error** for iff:
- Invalid token

#### *Accept Team (`/teams/accept`)

Recipient accepts a team invite from a sender. Searches the database of the person from the request body `"username": "Tye"`. Sends an empty JSON on success.
Checks and throws an **Error** for iff:
- Team request revoked
- Already a team
- Username doesn't exist
- Invalid token

#### All Team (`/teams/all`)

Searches for all teams in the database with a limit and an offset. Returns a sorted list by wins from the offset to the limit. 
Checks and throws an **Error** for iff:
- Provided limit and/or offset

### Game Controller (`/games`)

#### *Get Game (`/games/get`)

Gets a game from the database.
Checks and throws an **Error** for iff:
- Team request is pending
- Team already exists
- Username of recipient doesn't exist
- Invalid token

#### *Create Game (`/games/create`)

Checks and throws an **Error** for iff:
- Team request is pending
- Team already exists
- Username of recipient doesn't exist
- Invalid token