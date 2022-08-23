// import { v4 as uuid } from 'uuid';

export class Cargo {
    id = 0;
    type_id = 0;
    user_id = 0;
    car_id = 0;
    point_start_lat = 0;
    point_start_lon = 0;
    point_start_name = '';
    point_end_lat = 0;
    point_end_lon = 0;
    point_end_name = '';
    weigth = 0;
    price = 0;
    currency_id = 0;
    volume = 0;
    date_changed: Date;

    constructor(
        id = 0,
        type_id = 0,
        user_id = 0,
        car_id = 0,
        point_start_lat = 0,
        point_start_lon = 0,
        point_start_name = '',
        point_end_lat = 0,
        point_end_lon = 0,
        point_end_name = '',
        weigth = 0,
        price = 0,
        currency_id = 0,
        volume = 0
    ) {
        this.id = id;
        this.type_id = type_id;
        this.user_id = user_id;
        this.car_id = car_id;
        this.point_start_lat = point_start_lat;
        this.point_start_lon = point_start_lon;
        this.point_start_name = point_start_name;
        this.point_end_lat = point_end_lat;
        this.point_end_lon = point_end_lon;
        this.point_end_name = point_end_name;
        this.weigth = weigth;
        this.price = price;
        this.currency_id = currency_id;
        this.volume = volume;
        this.date_changed = new Date(); // for test
    }

    toJsonResponse() {
        const {
            id,
            type_id,
            user_id,
            car_id,
            point_start_lat,
            point_start_lon,
            point_start_name,
            point_end_lat,
            point_end_lon,
            point_end_name,
            weigth,
            price,
            currency_id,
            volume,
        } = this;
        return {
            id,
            type_id,
            user_id,
            car_id,
            point_start_lat,
            point_start_lon,
            point_start_name,
            point_end_lat,
            point_end_lon,
            point_end_name,
            weigth,
            price,
            currency_id,
            volume,
        };
    }

    static toResponse(cargo: Cargo) {
        const { id, user_id, car_id } = cargo;
        return { id, user_id, car_id };
    }
}
