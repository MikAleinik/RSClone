// import { v4 as uuid } from 'uuid';

export class Cargo {
    id = 0;
    user_id = 0;
    point_start_lat = 0;
    point_start_lon = 0;
    point_end_lat = 0;
    point_end_lon = 0;
    volume = 0;
    weigth = 0;
    price = 0;
    currency = '';
    finished = 'false';
    description = '';
    date_changed: Date;

    constructor(
        id = 0,
        user_id = 0,
        point_start_lat = 0,
        point_start_lon = 0,
        point_end_lat = 0,
        point_end_lon = 0,
        price = 0,
        currency = '',
        volume = 0,
        weigth = 0,
        finished = '',
        description = ''
    ) {
        this.id = id;
        this.user_id = user_id;
        this.point_start_lat = point_start_lat;
        this.point_start_lon = point_start_lon;
        this.point_end_lat = point_end_lat;
        this.point_end_lon = point_end_lon;
        this.volume = volume;
        this.weigth = weigth;
        this.price = price;
        this.currency = currency;
        this.finished = finished;
        this.description = description;
        this.date_changed = new Date(); // for test
    }

    toJsonResponse() {
        const {
            id,
            user_id,
            point_start_lat,
            point_start_lon,
            point_end_lat,
            point_end_lon,
            price,
            currency,
            volume,
            weigth,
            finished,
            description,
        } = this;
        return {
            id,
            user_id,
            point_start_lat,
            point_start_lon,
            point_end_lat,
            point_end_lon,
            price,
            currency,
            volume,
            weigth,
            finished,
            description,
        };
    }

    static toResponse(cargo: Cargo) {
        const { id, user_id } = cargo;
        return { id, user_id };
    }
}
