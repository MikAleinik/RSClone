import { LatLng } from "leaflet";

function loadUserData(){
  const user:{[index: string]: any} = {
    id: 0,
    name: 'Ivan',
    surname: 'Fedorov',
    email: 'fake@mail.com',
    cargo: {bundle1: 200, bundle2: 100}, // {bundleName: size}
    transport: {truck1: 100, truck2: 150, truck3: 100}, // {trackName: capacity}
    company: {'Horns and Howes': 1, 'Bigfoots': 1},
    rating: 5,
    role: 'customer'
  }
  return user;
}

const userRoleContent: {[index: string]: string[]} = { // fake user role content
  'user__data': ['user__name', 'user__rating', 'user__transport', 'user__cargo', 'user__company'],
  'user__map': ['user__locations']
};

const userRoleActions: {[index: string]: string} = { // fake user role actions
  'overview': 'Overview', // i use key also like an image name
  'truck': 'Transport',
  'cargo': 'Cargoes',
  'company': 'Companies',
  'map': 'Calculate routes',
  'news': 'News'
};

interface Cargo {
  name: string;
  size: number;
  from: number[];
  to: number[];
  date: string;
  status: string;
}

const userCargo: Cargo[] = [
  {
    name: 'Horns',
    size: 200,
    from: [53.90, 27.55],
    to: [52.43, 30.99],
    date: '2022-10-01',
    status: 'pending'
  },
  {
    name: 'Hooves',
    size: 200,
    from: [53.90, 27.55],
    to: [52.43, 30.99],
    date: '2022-10-01',
    status: 'Volvo'
  },
  {
    name: 'Skin',
    size: 100,
    from: [ 53.90, 27.55],
    to: [52.43, 30.99],
    date: '2022-10-01',
    status: 'Volvo'
  }
]

interface Truck {
  name: string;
  capacity: number;
  location: number[];
  track?: [LatLng:{}],
  status: string,
  filling: number;
}

const userTruck: Truck[] = [
  {
    name: 'Volvo',
    capacity: 2000,
    location: [53.90, 27.55],
    status: 'filling',
    filling: 300
  },
  {
    name: 'Iveca',
    capacity: 1500,
    location: [52.43, 30.99],
    status: 'pending',
    filling: 0
  }
]

export { loadUserData, userRoleContent, userRoleActions, userCargo, userTruck, Truck }