export class Car {
    id = 0;
    date_change = new Date();
    user_id = 0;
    model = 'MAZ';
    point_current_lat = 0;
    point_current_lon = 0;
    route_lat: number[] | null = [];
    route_lon: number[] | null = [];
    date_start: Date | null = null;
    price = 0;
    currency = 'USD';
    volume_max = 0;
    weight_max = 0;
}
