/**
 * Тип данных содержащий поля груза
 */
 type Cargo = {
    id: number;
    user_id: number;
    point_start_lat: number;
    point_start_lon: number;
    point_end_lat: number;
    point_end_lon: number;
    price: number;
    currency: string;
    date_from: Date;
    volume: number;
    weigth: number;
    finished: boolean;
    description: string;
};

export default Cargo;