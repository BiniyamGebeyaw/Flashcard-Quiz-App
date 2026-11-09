export interface FlashCard {
  questionText: string;
  questionAnswer: string;
}

export class InvalidUserInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidUserInputError";
    Object.setPrototypeOf(this, InvalidUserInputError.prototype);
  }
}
