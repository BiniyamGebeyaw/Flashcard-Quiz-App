import { useState, FormEvent } from "react";
import { FlashCard, InvalidUserInputError } from "./types";
import "./App.css";

const SEED_CARDS: FlashCard[] = [
  {
    questionText: "What is the capital of France?",
    options: ["Berlin", "Paris", "Madrid", "Rome"],
    questionAnswer: "Paris",
  },
  {
    questionText: "What is 2 + 2?",
    options: ["3", "5", "4", "22"],
    questionAnswer: "4",
  },
  {
    questionText: "Largest planet in our solar system?",
    options: ["Saturn", "Earth", "Neptune", "Jupiter"],
    questionAnswer: "Jupiter",
  },
];

const OPTION_LABELS = ["A", "B", "C", "D"];

export default function App() {
  // currentCards collection — required by the lab
  const [currentCards, setCurrentCards] = useState<FlashCard[]>(SEED_CARDS);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // index of the option the user picked for the current card (null = not answered yet)
  const [selected, setSelected] = useState<number | null>(null);

  // form state
  const [frontText, setFrontText] = useState<string>("");
  const [optionTexts, setOptionTexts] = useState<string[]>(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");

  const currentCard: FlashCard | undefined = currentCards[currentIndex];
  const answered = selected !== null;
  const isCorrect =
    currentCard !== undefined &&
    selected !== null &&
    currentCard.options[selected] === currentCard.questionAnswer;

  const handleSelect = (index: number) => {
    // one attempt per card
    if (answered || !currentCard) return;
    setSelected(index);
  };

  const handleDelete = () => {
    if (currentCards.length === 0) return;

    const next = currentCards.filter((_, i) => i !== currentIndex);
    setCurrentCards(next);
    // display the previous card data
    const prevIndex = Math.max(0, currentIndex - 1);
    setCurrentIndex(prevIndex < next.length ? prevIndex : 0);
    setSelected(null);
    setFeedback("Card deleted.");
  };

  const validateEntry = (q: string, opts: string[]) => {
    // required: throw InvalidUserInputError when a field is empty
    if (!q || opts.some((o) => !o)) {
      throw new InvalidUserInputError(
        "Enter the question and all four alternatives."
      );
    }
    const unique = new Set(opts.map((o) => o.toLowerCase()));
    if (unique.size !== opts.length) {
      throw new InvalidUserInputError("The four alternatives must be different.");
    }
  };

  const handleAdd = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const q = frontText.trim();
    const opts = optionTexts.map((o) => o.trim());

    try {
      validateEntry(q, opts);
    } catch (err) {
      if (err instanceof InvalidUserInputError) {
        setFeedback(err.message);
        return;
      }
      throw err;
    }

    const newCard: FlashCard = {
      questionText: q,
      options: opts,
      questionAnswer: opts[correctIndex],
    };
    // added to the END of currentCards...
    const next = [...currentCards, newCard];
    setCurrentCards(next);
    // ...and displayed as the current card
    setCurrentIndex(next.length - 1);
    setSelected(null);
    setFrontText("");
    setOptionTexts(["", "", "", ""]);
    setCorrectIndex(0);
    setFeedback("New card added!");
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelected(null);
    }
  };

  const goNext = () => {
    if (currentIndex < currentCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelected(null);
    }
  };

  const updateOption = (i: number, value: string) => {
    setOptionTexts((prev) => prev.map((o, idx) => (idx === i ? value : o)));
  };

  const optionClass = (i: number): string => {
    if (!currentCard || !answered) return "option";
    const isRightOption = currentCard.options[i] === currentCard.questionAnswer;
    if (isRightOption) return "option option--correct";
    if (i === selected) return "option option--wrong";
    return "option option--dim";
  };

  return (
    <div className="app">
      <header className="app__header">
        <h1>📚 FlashDeck</h1>
        <p className="subtitle">
          Pick the right answer for each question. Build your own deck below.
        </p>
      </header>

      <section className="card-stage">
        <div className="flashcard" data-testid="flashcard">
          <span className="flashcard__label">Question</span>
          <p className="flashcard__text">
            {currentCard
              ? currentCard.questionText
              : "No cards yet — add one below."}
          </p>
        </div>

        {currentCard && (
          <div className="options" role="group" aria-label="Answer choices">
            {currentCard.options.map((opt, i) => (
              <button
                key={i}
                type="button"
                className={optionClass(i)}
                onClick={() => handleSelect(i)}
                disabled={answered}
              >
                <span className="option__letter">{OPTION_LABELS[i]}</span>
                <span className="option__text">{opt}</span>
              </button>
            ))}
          </div>
        )}

        {answered && (
          <p
            className={`result ${isCorrect ? "result--correct" : "result--wrong"}`}
            role="status"
          >
            {isCorrect ? "You are correct!" : "You are wrong."}
          </p>
        )}

        <div className="card-nav">
          <button
            type="button"
            onClick={goPrev}
            disabled={currentIndex === 0}
            aria-label="Previous card"
          >
            ‹ Prev
          </button>
          <span className="card-counter">
            {currentCards.length === 0 ? 0 : currentIndex + 1} /{" "}
            {currentCards.length}
          </span>
          <button
            type="button"
            onClick={goNext}
            disabled={currentIndex >= currentCards.length - 1}
            aria-label="Next card"
          >
            Next ›
          </button>
        </div>
      </section>

      <section className="actions">
        <button
          id="delete-btn"
          type="button"
          onClick={handleDelete}
          className="btn-delete"
        >
          🗑 Delete this card
        </button>
      </section>

      <section className="form-area">
        <h2>Add a new card</h2>
        <form id="entry-form" onSubmit={handleAdd}>
          <label htmlFor="front-text">Question</label>
          <input
            id="front-text"
            type="text"
            value={frontText}
            onChange={(e) => setFrontText(e.target.value)}
            placeholder="e.g. What is the speed of light?"
          />

          <fieldset className="alternatives">
            <legend>Four alternatives (select the correct one)</legend>
            {optionTexts.map((text, i) => (
              <div className="alternatives__row" key={i}>
                <input
                  type="radio"
                  name="correct-option"
                  checked={correctIndex === i}
                  onChange={() => setCorrectIndex(i)}
                  aria-label={`Mark alternative ${OPTION_LABELS[i]} as correct`}
                />
                <input
                  type="text"
                  value={text}
                  onChange={(e) => updateOption(i, e.target.value)}
                  placeholder={`Alternative ${OPTION_LABELS[i]}`}
                  aria-label={`Alternative ${OPTION_LABELS[i]}`}
                />
              </div>
            ))}
          </fieldset>

          <button type="submit" className="btn-add">
            ＋ Add card
          </button>
        </form>
        {feedback && <p className="feedback">{feedback}</p>}
      </section>
    </div>
  );
}
