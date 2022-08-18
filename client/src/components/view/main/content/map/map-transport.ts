function getTransportLocation(){ //fake transport location
  const transport: {[index: string]: any} = {
    truck1: [53.6688, 23.8223],
    truck2: [53.8981, 30.3325],
    truck3: [53.3904, 24.4861]
  }
  return transport;
}

export {getTransportLocation}