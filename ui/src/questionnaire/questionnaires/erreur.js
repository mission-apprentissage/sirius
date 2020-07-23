import React from "react";
import { Message } from "../toolkit";

export default (e) => {
  return [
    {
      id: "erreur",
      message: (
        <Message>
          Désolé une erreur est survenue. <br />
          {e.message}.
        </Message>
      ),
      last: true,
    },
  ];
};
