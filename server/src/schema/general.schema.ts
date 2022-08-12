import { SchemaTypeString } from "../types/types";

export const errorSchema = {
  type: "object",
  properties: {
    message: SchemaTypeString,
  },
};

export const userReplySchema = {
  type: "object",
  properties: {
    email: SchemaTypeString,
    login: SchemaTypeString,
  },
};
