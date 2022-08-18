function loadUserData(){
  const user:{[index: string]: any} = {
    id: 0,
    name: 'Ivan',
    surname: 'Fedorov',
    email: 'fake@mail.com',
    cargo: {bundle1: 200, bundle2: 100}, // {bundleName: size}
    transport: {truck1: 100, truck2: 150, truck3: 100}, // {trackName: capacity}
    races: {finished: 22, current: 1, planned: 0},
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

export { loadUserData, userRoleContent, userRoleActions }