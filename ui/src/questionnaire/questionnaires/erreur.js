import React from "react";
import { Message } from "../toolkit";

export default (e) => {
  return [
    {
      id: "erreur",
      message: <Message>{e.message}</Message>,
      last: true,
    },
  ];
};
