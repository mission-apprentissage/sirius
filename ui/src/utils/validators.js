export const passwordComplexityRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])(?=.{8,})/;
export const passwordComplexityMessage = `Votre mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial`;

export const eightCharactersRegex = /^.{8,}$/;

export const oneUppercase = /^(?=.*[A-Z])/;

export const oneLowercase = /^(?=.*[a-z])/;

export const oneDigit = /^(?=.*[0-9])/;

export const oneSpecialCharacter = /^(?=.*[ !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])/;
