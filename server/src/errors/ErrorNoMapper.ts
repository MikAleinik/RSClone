export class ErrorNoMapper extends Error {
    constructor() {
        super('DB Mapper absent');
    }
}
