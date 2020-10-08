import React from "react";
import { Message } from "../toolkit";

export default (message) => {
  return [
    {
      id: "erreur",
      message: <Message>{message}</Message>,
      last: true,
    },
  ];
};
