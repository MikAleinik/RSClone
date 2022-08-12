import { v4 as uuid } from "uuid";

export class Car {
  id: string;
  name: string;
  data: unknown;

  constructor({ id = uuid(), name = "CAR1", data = {} } = {}) {
    this.id = id;
    this.name = name;
    this.data = {};
  }

  toJsonResponse() {
    const { id, name, data } = this;
    return { id, name, data };
  }

  static toResponse(car: Car) {
    const { id, name, data } = car;
    return { id, name, data };
  }
}
