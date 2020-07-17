import React from "react";
import { Message } from "../toolkit";

export default () => {
  return [
    {
      id: "erreur",
      message: (
        <Message>"Désolé une erreur est survenue. Vous pouvez nous contacter en nous laissant un message"</Message>
      ),
      last: true,
    },
  ];
};
