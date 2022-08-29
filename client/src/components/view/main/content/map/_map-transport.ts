import { Truck, userTruck } from "../../_user-adapter";

function getTrack(truck: Truck){
  return new Promise((resolve, reject) => {
    const data = truck;
    if(truck){
      resolve(data)
    } else {
      reject(new Error('unable to load data'))
    }
  })
}

async function getTransportLocation(){
  const tracks = [];
  for (const t of userTruck){
    tracks.push(getTrack(t))
  }
  const results = await Promise.allSettled(tracks);
  const transport: {[index: string]: number[]} = {}
  for (const i of results){
    if (i.status === 'fulfilled'){
      const data = i.value as Truck;
      transport[data.name] = data.location;
    }
  }
  return transport;
}

export {getTransportLocation}