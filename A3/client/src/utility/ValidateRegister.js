const validateSignup = (data) => {
    let errors = {};

    function validEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };

    if (!data.email) { // check if first name was provided
        errors.email = "Email is required."
    } else if (!validEmail(data.email)) { // check if first name contains alphabet chars only
        errors.email = "Incorrect email format."
    }
    if (!data.username) { // check if username was provided
        errors.username = "Username is required."
    } else if (data.username.length < 4) { // check if username length is longer than 4
        errors.username = "Username must be longer than 4 characters."
    }
    if (!data.password) { // check if password was provided
        errors.password = "Password is required."
    } else if (data.password.length < 8) { // check if password length is longer than 4
        errors.password = "Password must be longer than 8 characters long."
    }
    if (!data.confirmPassword) { // check if confirmation password was provided
        errors.confirmPassword = "Please confirm your password."
    }
    if (data.password != data.confirmPassword) { // check if password and confirmation password matches
        errors.confirmPassword = "Password does not match."
    }
    return errors;
}

export default validateSignup
