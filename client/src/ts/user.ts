function loadUserData(){
  const user:{[index: string]: any} = {
    id: 0,
    name: 'Ivan',
    surname: 'Fedorov',
    email: 'fake@mail.com',
    cargoes: {bundle1: 200, bundle2: 100}, // {bundleName: size}
    transport: {truck1: 100, truck2: 150}, // {trackName: capacity}
    races: {finished: 22, current: 1, planned: 0},
    rating: 5
  }
  return user;
}

export { loadUserData }