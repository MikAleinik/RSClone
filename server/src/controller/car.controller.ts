import { ContentTypeJson } from "../types/types";
import { OkCodes } from "../types/enums";

export class CarsController {
  private static instance: CarsController;

  private constructor() {}

    async processGetAllCars
        (req: any, res: any) {
    res.code(OkCodes.OK);
    res.header(...ContentTypeJson);
    res.send([]);
  };

  static getInstance() {
    if (!CarsController.instance) {
      CarsController.instance = new CarsController();
    }
    return CarsController.instance;
  }
}