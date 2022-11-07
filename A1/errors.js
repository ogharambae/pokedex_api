class PokemonBadRequest extends Error {
    constructor(message) {
        super(message);
        this.name = "PokemonBadRequest";
        this.message = "Error: please check the API doc as the provided request is invalid.";
        this.errorCode = 400;
    }
}

class PokemonNotFound extends Error {
    constructor(message) {
        super(message);
        this.name = "PokemonNotFound";
        this.message = "Error: pokemon with provided request was not found.";
        this.errorCode = 400;
    }
}

class PokemonDb extends Error {
    constructor(message) {
        super(message);
        this.name = "PokemonDb";
        this.message = "Error: a database error has occurred. Please contact the API owner for more detail.";
        this.errorCode = 400;
    }
}

class PokemonDuplicate extends PokemonBadRequest {
    constructor(message) {
        super(message);
        this.name = "PokemonDuplicate";
        this.message = "Error: requested pokemon has already been inserted.";
        this.errorCode = 500;
    }
}

class PokemonMissingID extends PokemonBadRequest {
    constructor(message) {
        super(message);
        this.name = "PokemonMissingID";
        this.message = "Error: please check the API doc as provided request is invalid.";
        this.errorCode = 500;
    }
}

class PokemonNoSuchRoute extends PokemonBadRequest {
    constructor(message) {
        super(message);
        this.name = "PokemonNoSuchRoute";
        this.message = "Error: please check the API doc as provided request is invalid.";
        this.errorCode = 500;
    }
}

module.exports = {
    PokemonBadRequest,
    PokemonNotFound,
    PokemonDb,
    PokemonDuplicate,
    PokemonMissingID,
    PokemonNoSuchRoute
}