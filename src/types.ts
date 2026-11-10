export interface FlashCard {
  questionText: string;
  /** The four alternatives shown to the user (includes the right answer). */
  options: string[];
  /** The correct answer. Must be one of `options`. */
  questionAnswer: string;
}

export class InvalidUserInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidUserInputError";
    Object.setPrototypeOf(this, InvalidUserInputError.prototype);
  }
}
