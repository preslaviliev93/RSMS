export function validateLoginFormUserInputData(inputData) {
    const errors = {};
    let isValid = false;
    const { username, password } = inputData;
    if (!username) {
        errors.username = 'Username is required';
    } else if (username.trim() === "") {
        errors.username = 'Username cannot be empty';
    }
    if (!password) {
        errors.password = 'Password is required';
    } else if (password.trim() === "") {
        errors.password = 'Password cannot be empty';
    }
    
    if(!errors.username && !errors.password) {
        isValid = true;
    }

    return { errors, isValid };
}