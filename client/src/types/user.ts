/**
 * Тип данных содержащий поля пользователя
 */
type user = {
    id: number;
    login: string;
    email: string;
    password: string;
    role_id: string;
    first_name: string;
    last_name: string;
    phone: string;
    company: string;
    address: string;
    rating: number;
    rating_count: number;
    point_lat: number;
    point_lon: number;
};

export default user;