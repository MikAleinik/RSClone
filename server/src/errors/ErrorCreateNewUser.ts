export class ErrorCreateNewUser extends Error {
    constructor() {
        super('User is not unique, enter another email');
    }
}
