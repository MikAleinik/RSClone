/**
 * Тип данных содержащий поля машины
 */
 type Car = {
    id: number;
    user_id: number;
    model: string;
    point_current_lat: number;
    point_current_lon: number;
    // route_lat: Array<number>;
    // route_lon: Array<number>;
    date_start: Date;
    price: number;
    currency: string;
    volume_max: number;
    weigth_max: number;
    speed: number;
    drived: boolean;
    description: string;
};

export default Car;