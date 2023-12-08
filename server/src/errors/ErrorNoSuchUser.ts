export class ErrorNoSuchUser extends Error {
    constructor() {
        super('User with provided email does not exist');
    }
}
