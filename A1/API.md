# Pokedex Application
Simple pokedex application to run CRUD operations on the pokedex! Data is fetched from https://github.com/fanzeyi/pokemon.json.

## Routes
#### URL: 
***/api/v1/pokemons*** : retrieves all pokemon if params are empty. Else, user can specify the "count" and "after" to specify the number of pokemons to retrieve after skipping (i.e. "/pokemons?count=2&after=10" to grab 2 pokemons after skipping the first 10).
#### Method:
GET
#### Params:
* count = [integer], specifies how many pokemons to grab.
* after = [integer], specifies how many pokemons to skip.
#### Success Response:
Sends a JSON object of the pokemon(s).<br>
Content: JSON object 
#### Error Response:
Sends an error message as a JSON object if pokemon trying to be retrieved with the id does not exist.<br>
Context: { errMsg: "Error: no pokemon found with specified id. Please check your id again." }<br><br>
#### Sample Call:
```'/api/v1/pokemons?count=2&after=10'```
<hr>

#### URL:
***/api/v1/pokemon*** : creates a new pokemon.
#### Method:
POST
#### Params:
None
#### Success Response:
Sends a message as a JSON object if pokemon is created successfully.<br>
Content: { msg: "Pokemon created successfully." }
#### Error Response:
Sends an error message as a JSON object if ID of pokemon user is trying to create already exists.<br>
Context: { errMsg: "Pokemon with that ID already exists." }<br><br>
OR <br><br>
Sends an error message as a JSON object if user violates pokemon schema.<br>
Context: { errMsg: "ValidationError: check your values to see if they match the specifications of the schema." }<br>
#### Sample Call:
```api/v1/pokemon```
<hr>

#### URL:
***/api/v1/pokemon/:id*** : get a pokemon specified by the pokemon ID.
#### Method:
GET
#### Params:
* id = [integer], specifies the ID of the pokemon user is trying to retrieve. ID is required.
#### Success Response:
Sends a JSON object of the pokemon specified by ID if pokemon is retrieved successfully.
Content: JSON object
#### Error Response:
Sends an error message as a JSON object if user species a wrong ID.
Content: { errMsg: "Cast Error: pokemon id must be between 1 and 809." }
#### Sample Call:
```/api/v1/pokemon/:777```
<hr>

#### URL:
***/api/v1/pokemonImage/:id*** : get a pokemon Image URL as a JSON object specified by the pokemon ID.
#### Method:
GET
#### Params:
* id = [integer], specifies the ID of the pokemon image user is trying to retrieve. ID is required and must be 3 digits long (i.e. 001 to retrieve pokemon image of ID 1).
#### Success Response:
Sends a message as a JSON object if pokemon image specified by ID is retrieved successfully.
Content: { url: "https://github.com/fanzeyi/pokemon.json/blob/master/images/001.png" }
#### Sample Call:
```/api/v1/pokemonImage/001```
<hr>

#### URL:
***/api/v1/pokemon/:id*** : upsert a whole pokemon document.
#### Method:
PUT
#### Params:
* id = [integer], specifies the ID of the pokemon user is trying to upsert. ID is required.
#### Success Response:
Sends a JSON object if pokemon was upserted successfully.
Content: { msg: "Pokemon upserted successfully.", data: doc }
#### Error Response:
Sends an error message as a JSON object if schema is invalid.
Content: { errMsg: "ValidationError: check your values to see if they match the specifications of the schema." }
#### Sample Call:
```/api/v1/pokemon/123``` 
<br><br>OR<br>

```/api/v1/pokemon/1000``` 
<hr>

#### URL:
***/api/v1/pokemon/:id*** : patch a pokemon document or a portion of the pokemon document.
#### Method:
PATCH
#### Params:
* id = [integer], specifies the ID of the pokemon user is trying to patch. ID is required.
#### Success Response:
Sends a JSON object if pokemon was patched successfully.
Content: { msg: "Pokemon updated successfully.", data: doc }
#### Error Response:
Sends an error message as a JSON object
Content: { errMsg: "ValidationError: check your values to see if they match the specifications of the schema." }
#### Sample Call:
```/api/v1/pokemon/456```
<hr>

#### URL:
***/api/v1/pokemon/:id*** : delete a pokemon specified by the pokemon ID.
#### Method:
DELETE
#### Params:
* id = [integer], specifies the ID of the pokemon user is trying to delete. ID is required.
#### Success Response:
Sends a message as a JSON object if pokemon was deleted successfully.
Content: { msg: "Deleted pokemon successfully." }
#### Error Response:
Sends an error message as a JSON object if pokemon specified by ID does not exist.
Content: { errMsg: "Error: pokemon not found." }
#### Sample Call:
```/api/v1/pokemon/789```
<hr>

#### URL:
***\**** : handles improper routes.
#### Error Response:
Sends an error message as a JSON object if provided an improper route.
Content: { errMsg: "Improper route. Check API docs plz." }
#### Sample Call:
```/api/v1/pokemooooooooooooons```
<hr>