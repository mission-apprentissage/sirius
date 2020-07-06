export default () => {
  return [
    {
      id: "erreur",
      message: "Désolé une erreur est survenue. Vous pouvez nous contacter en nous laissant un message",
      trigger: "contact",
    },
    {
      id: "contact",
      user: true,
      trigger: "fin",
    },
    {
      id: "fin",
      end: true,
      message: "Merci, nous allons vous recontacter rapidement",
    },
  ];
};
