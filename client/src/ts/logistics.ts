function getLogisticstLocation(){ //fake logistics centers location
  const transport: {[index: string]: any} = {
    center1: [52.4313, 30.9937],
    center2: [55.1927, 30.2064],
    center3: [52.1182, 26.1017]
  }
  return transport;
}

export { getLogisticstLocation }