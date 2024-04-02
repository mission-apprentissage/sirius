export const passwordComplexityRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])(?=.{8,})/;

export const eightCharactersRegex = /^.{8,}$/;

export const oneUppercase = /^(?=.*[A-Z])/;

export const oneLowercase = /^(?=.*[a-z])/;

export const oneDigit = /^(?=.*[0-9])/;

export const oneSpecialCharacter = /^(?=.*[ !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])/;

export const allFieldMessage = "Tous les champs doivent être complétés.";

export const notCorrespondingPasswordMessage = "Les mots de passe ne sont pas les mêmes.";

export const emailFormatMessage = "L'email n'est pas au bon format";

export const notCorrespondingRole = "Le role n'est pas valide.";
