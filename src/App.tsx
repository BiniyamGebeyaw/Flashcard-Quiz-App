import { useState, FormEvent } from "react";
import { FlashCard, InvalidUserInputError } from "./types";
import "./App.css";

const SEED_CARDS: FlashCard[] = [
  { questionText: "What is the capital of France?", questionAnswer: "Paris" },
  { questionText: "What is 2 + 2?", questionAnswer: "4" },
  { questionText: "Largest planet in our solar system?", questionAnswer: "Jupiter" },
];

export default function App() {
  // currentCards collection — required by the lab
  const [currentCards, setCurrentCards] = useState<FlashCard[]>(SEED_CARDS);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [flipped, setFlipped] = useState<boolean>(false);
  const [frontText, setFrontText] = useState<string>("");
  const [backText, setBackText] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");

  const currentCard: FlashCard | undefined = currentCards[currentIndex];

  const handleFlip = () => setFlipped((f) => !f);

  const handleDelete = () => {
    if (currentCards.length === 0) return;

    const next = currentCards.filter((_, i) => i !== currentIndex);
    setCurrentCards(next);
    // display the previous card data
    const prevIndex = Math.max(0, currentIndex - 1);
    setCurrentIndex(prevIndex < next.length ? prevIndex : 0);
    setFlipped(false);
    setFeedback("Card deleted.");
  };

  const handleAdd = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const q = frontText.trim();
    const a = backText.trim();

    // required: throw InvalidUserInputError when either field is empty
    if (!q || !a) {
      throw new InvalidUserInputError(
        "Question text and answer must not be empty."
      );
    }

    const newCard: FlashCard = { questionText: q, questionAnswer: a };
    // added to the END of currentCards...
    const next = [...currentCards, newCard];
    setCurrentCards(next);
    // ...and displayed as the current card
    setCurrentIndex(next.length - 1);
    setFlipped(false);
    setFrontText("");
    setBackText("");
    setFeedback("New card added!");
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setFlipped(false);
    }
  };

  const goNext = () => {
    if (currentIndex < currentCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFlipped(false);
    }
  };

  return (
    <div className="app">
      <header className="app__header">
        <h1>📚 FlashDeck</h1>
        <p className="subtitle">
          Click a card to flip it. Build your own deck below.
        </p>
      </header>

      <section className="card-stage">
        <div
          id="flashcard"
          className={`flashcard ${flipped ? "flipped" : ""}`}
          onClick={handleFlip}
          data-testid="flashcard"
        >
          <div className="flashcard__inner">
            <div className="flashcard__face flashcard__face--front">
              <span className="flashcard__label">Question</span>
              <p className="flashcard__text">
                {currentCard
                  ? currentCard.questionText
                  : "No cards yet — add one below."}
              </p>
            </div>
            <div className="flashcard__face flashcard__face--back">
              <span className="flashcard__label">Answer</span>
              <p className="flashcard__text">
                {currentCard ? currentCard.questionAnswer : "—"}
              </p>
            </div>
          </div>
        </div>

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
          <label htmlFor="front-text">Question (front)</label>
          <input
            id="front-text"
            type="text"
            value={frontText}
            onChange={(e) => setFrontText(e.target.value)}
            placeholder="e.g. What is the speed of light?"
          />

          <label htmlFor="back-text">Answer (back)</label>
          <input
            id="back-text"
            type="text"
            value={backText}
            onChange={(e) => setBackText(e.target.value)}
            placeholder="e.g. ~299,792 km/s"
          />

          <button type="submit" className="btn-add">
            ＋ Add card
          </button>
        </form>
        {feedback && <p className="feedback">{feedback}</p>}
      </section>
    </div>
  );
}
