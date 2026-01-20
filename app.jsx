const { useState, useEffect } = React;

const STORAGE_KEY = "bsnl_quiz_state";
const CSV_FILES = [
    { value: '01 C-DOT.csv', label: 'C-DOT' },
    { value: '02 C-DOT RSU.csv', label: 'C-DOT RSU' },
    { value: '03 C DOT RAX.csv', label: 'C-DOT RAX' },
    { value: '04 GD Tubes.csv', label: 'GD Tubes' },
    { value: '05 E-10b.csv', label: 'E-10B' },
    { value: '06 Networking.csv', label: 'Networking' },
    { value: '07 MDF_UG cables.csv', label: 'MDF' },
    { value: '07 MDF_UG_cables.csv', label: 'MDF1' },
    { value: '08 Power Plant.csv', label: 'Power Plant' },
    { value: 'TEST01.CSV', label: 'TEST01' },
    { value: 'TEST02.CSV', label: 'TEST02' },
    { value: 'TEST03.CSV', label: 'TEST03' },
    { value: 'TEST_R_01.csv', label: 'TEST_R_01' },
    { value: 'LICE 2018 Part-1.csv', label: 'LICE 2018 Part-1' },
    { value: 'Book1.csv', label: 'Book1' },
    { value: 'demo.csv', label: 'demo' }
];

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function parseCSV(csv) {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    return lines.slice(1).map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, i) => {
            obj[header] = values[i]?.trim() || '';
            return obj;
        }, {});
    }).filter(q => q.Question && q.Answer);
}

function QuizApp() {
    const [loading, setLoading] = useState(true);
    const [state, setState] = useState({
        questions: [],
        currentIndex: 0,
        answers: [],
        completed: false,
        selectedCSV: null,
        showFeedback: false,
        isReadingMode: false
    });

    useEffect(() => {
        loadState();
    }, []);

    const loadState = () => {
        try {
            const stored = sessionStorage.getItem(STORAGE_KEY);
            if (stored) {
                const savedState = JSON.parse(stored);
                setState(prev => ({
                    ...prev,
                    currentIndex: savedState.currentIndex || 0,
                    answers: savedState.answers || [],
                    completed: savedState.completed || false,
                    selectedCSV: savedState.selectedCSV || null,
                    showFeedback: savedState.showFeedback || false,
                    isReadingMode: savedState.isReadingMode || false
                }));

                if (savedState.selectedCSV) {
                    loadQuestions(savedState.selectedCSV);
                } else {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        } catch (e) {
            console.warn('Failed to load state:', e);
            setLoading(false);
        }
    };

    const saveState = (updates = {}) => {
        const newState = { ...state, ...updates };
        setState(newState);

        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
                currentIndex: newState.currentIndex,
                answers: newState.answers,
                completed: newState.completed,
                selectedCSV: newState.selectedCSV,
                showFeedback: newState.showFeedback,
                isReadingMode: newState.isReadingMode,
                timestamp: Date.now()
            }));
        } catch (e) {
            console.warn('Failed to save state:', e);
        }
    };

    const loadQuestions = async (csvFile, isReadingMode = false) => {
        setLoading(true);
        try {
            const response = await fetch(csvFile);
            if (!response.ok) throw new Error(`Failed to load quiz: ${csvFile}`);
            const csvData = await response.text();
            const questions = parseCSV(csvData);

            if (questions.length === 0) {
                throw new Error('No questions found in selected quiz');
            }

            saveState({
                questions,
                selectedCSV: csvFile,
                isReadingMode,
                loading: false
            });
        } catch (error) {
            alert(`Error: ${error.message}`);
            saveState({ selectedCSV: null });
        } finally {
            setLoading(false);
        }
    };

    const selectAnswer = (letter) => {
        const newAnswers = [...state.answers];
        newAnswers[state.currentIndex] = letter;
        saveState({ answers: newAnswers });
    };

    const previousQuestion = () => {
        if (state.currentIndex > 0) {
            saveState({ currentIndex: state.currentIndex - 1 });
        }
    };

    const nextQuestion = () => {
        if (state.currentIndex < state.questions.length - 1) {
            saveState({ currentIndex: state.currentIndex + 1 });
        } else {
            if (state.answers.length === state.questions.length &&
                state.answers.every(a => a)) {
                saveState({ completed: true });
            } else {
                alert('Please answer all questions before submitting.');
            }
        }
    };

    const restartQuiz = () => {
        saveState({
            currentIndex: 0,
            answers: [],
            completed: false
        });
    };

    const changeQuiz = () => {
        if (confirm('Are you sure you want to change the quiz? Your current progress will be lost.')) {
            sessionStorage.removeItem(STORAGE_KEY);
            saveState({
                questions: [],
                currentIndex: 0,
                answers: [],
                completed: false,
                selectedCSV: null,
                showFeedback: false,
                isReadingMode: false
            });
        }
    };

    const clearCache = () => {
        if (confirm('Are you sure you want to clear all cached data? This will restart the quiz from the beginning.')) {
            sessionStorage.clear();
            localStorage.clear();
            saveState({
                questions: [],
                currentIndex: 0,
                answers: [],
                completed: false,
                selectedCSV: null,
                isReadingMode: false
            });
            alert('Cache cleared successfully!');
        }
    };

    const toggleFeedback = (checked) => {
        saveState({ showFeedback: checked });
    };

    if (loading) {
        return (
            <div className="app">
                <div className="loading">Loading...</div>
            </div>
        );
    }

    if (!state.selectedCSV) {
        return <QuizSelector onStart={loadQuestions} />;
    }

    if (state.completed) {
        return <Results
            state={state}
            onRestart={restartQuiz}
            onChangeQuiz={changeQuiz}
            onClearCache={clearCache}
        />;
    }

    return <QuizScreen
        state={state}
        onSelectAnswer={selectAnswer}
        onPrevious={previousQuestion}
        onNext={nextQuestion}
        onChangeQuiz={changeQuiz}
        onClearCache={clearCache}
        onToggleFeedback={toggleFeedback}
    />;
}

function QuizSelector({ onStart }) {
    const [selectedCSV, setSelectedCSV] = useState('');
    const [isReadingMode, setIsReadingMode] = useState(false);

    const handleStart = () => {
        if (selectedCSV) {
            onStart(selectedCSV, isReadingMode);
        }
    };

    return (
        <div className="app">
            <div className="selector-screen">
                <h1>BSNL LICE JE Quiz App</h1>
                <div className="csv-selector">
                    <label htmlFor="csvSelect">Select Quiz Topic:</label>
                    <select
                        id="csvSelect"
                        value={selectedCSV}
                        onChange={(e) => setSelectedCSV(e.target.value)}
                    >
                        <option value="">-- Choose a quiz --</option>
                        {CSV_FILES.map(file => (
                            <option key={file.value} value={file.value}>
                                {file.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="reading-mode-toggle">
                    <input
                        type="checkbox"
                        id="readingMode"
                        checked={isReadingMode}
                        onChange={(e) => setIsReadingMode(e.target.checked)}
                    />
                    <label htmlFor="readingMode">Reading Mode (Show Answers Directly)</label>
                </div>
                <button
                    className="start-btn"
                    onClick={handleStart}
                    disabled={!selectedCSV}
                >
                    Start Quiz
                </button>
            </div>
            <Footer />
        </div>
    );
}

function QuizScreen({
    state,
    onSelectAnswer,
    onPrevious,
    onNext,
    onChangeQuiz,
    onClearCache,
    onToggleFeedback
}) {
    const quizName = CSV_FILES.find(f => f.value === state.selectedCSV)?.label || 'Quiz';

    // Add keyboard event handling
    useEffect(() => {
        const handleKeyDown = (event) => {
            // Prevent handling if user is typing in an input field
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.tagName === 'SELECT') {
                return;
            }

            const key = event.key.toUpperCase();
            
            // Handle answer selection (A, B, C, D)
            if (['A', 'B', 'C', 'D'].includes(key)) {
                event.preventDefault();
                onSelectAnswer(key);
                return;
            }
            
            // Handle navigation (Arrow keys)
            if (key === 'ARROWLEFT') {
                event.preventDefault();
                onPrevious();
                return;
            }
            
            if (key === 'ARROWRIGHT') {
                event.preventDefault();
                onNext();
                return;
            }
        };

        // Add event listener
        document.addEventListener('keydown', handleKeyDown);
        
        // Cleanup function
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onSelectAnswer, onPrevious, onNext]);

    if (state.isReadingMode) {
        return (
            <div className="app">
                <div className="quiz-info">📚 {quizName} - Reading Mode</div>
                <div className="header">
                    <h2>Answers</h2>
                    <div className="header-actions">
                        <button className="change-quiz-btn" onClick={onChangeQuiz}>
                            Change Quiz
                        </button>
                        <button className="clear-btn" onClick={onClearCache}>
                            Clear Cache
                        </button>
                    </div>
                </div>
                <div className="reading-list">
                    {state.questions.map((q, i) => (
                        <div key={i} className="reading-item">
                            <div className="question-number">Q{i + 1}:</div>
                            <div className="question" dangerouslySetInnerHTML={{ __html: escapeHtml(q.Question) }}></div>
                            <div className="answer">
                                <strong> ✅: {escapeHtml(q[`Option-${q.Answer}`])}</strong>
                                {q.Trap === 'YES' && <span className="badge">TRAP</span>}
                            </div>
                        </div>
                    ))}
                </div>
                <Footer />
            </div>
        );
    }

    const q = state.questions[state.currentIndex];
    const progress = ((state.currentIndex + 1) / state.questions.length) * 100;
    const userAnswer = state.answers[state.currentIndex];
    const isCorrect = userAnswer && userAnswer === q.Answer;
    const isIncorrect = userAnswer && userAnswer !== q.Answer;

    return (
        <div className="app">
            <div className="quiz-info">📚 {quizName}</div>
            <div className="header">
                <h2>Question {state.currentIndex + 1} / {state.questions.length}</h2>
                <div className="header-actions">
                    <button className="change-quiz-btn" onClick={onChangeQuiz}>
                        Change Quiz
                    </button>
                    <button className="clear-btn" onClick={onClearCache}>
                        Clear Cache
                    </button>
                </div>
            </div>

            <div className="progress">
                <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>

            <div className="feedback-toggle">
                <input
                    type="checkbox"
                    id="feedbackToggle"
                    checked={state.showFeedback}
                    onChange={(e) => onToggleFeedback(e.target.checked)}
                />
                <label htmlFor="feedbackToggle">Show instant Result</label>
            </div>

            <div className="keyboard-hint">
                💡 Use A/B/C/D keys to select answers, ←/→ arrows to navigate
            </div>

            {state.showFeedback && userAnswer && (
                <div className={`feedback-message ${isCorrect ? 'correct' : 'incorrect'}`}>
                    <span className="feedback-icon">{isCorrect ? '✓' : '✗'}</span>
                    {isCorrect ? 'Correct!' : 'Incorrect!'}
                    {isIncorrect && (
                        <span className="correct-answer">
                            Correct answer: {escapeHtml(q[`Option-${q.Answer}`])}
                        </span>
                    )}
                </div>
            )}

            <div className="question" dangerouslySetInnerHTML={{ __html: escapeHtml(q.Question) }}></div>

            <div className="options">
                {['A', 'B', 'C', 'D'].map(letter => {
                    let optionClass = userAnswer === letter ? 'selected' : '';
                    if (state.showFeedback && userAnswer) {
                        if (letter === q.Answer) {
                            optionClass += ' correct';
                        } else if (letter === userAnswer && letter !== q.Answer) {
                            optionClass += ' wrong';
                        }
                    }

                    return (
                        <div
                            key={letter}
                            className={`option ${optionClass}`}
                            onClick={() => onSelectAnswer(letter)}
                        >
                            <span className="option-letter">{letter}</span>
                            <span dangerouslySetInnerHTML={{
                                __html: escapeHtml(q[`Option-${letter}`] || '')
                            }}></span>
                        </div>
                    );
                })}
            </div>

            <div className="navigation">
                <button
                    className="nav-btn"
                    onClick={onPrevious}
                    disabled={state.currentIndex === 0}
                >
                    ← Previous
                </button>
                <button className="nav-btn" onClick={onNext}>
                    {state.currentIndex === state.questions.length - 1 ? 'Submit' : 'Next →'}
                </button>
            </div>

            <Footer />
        </div>
    );
}

function Results({ state, onRestart, onChangeQuiz, onClearCache }) {
    const correct = state.questions.filter((q, i) =>
        state.answers[i] === q.Answer
    ).length;
    const percent = Math.round((correct / state.questions.length) * 100);
    const quizName = CSV_FILES.find(f => f.value === state.selectedCSV)?.label || 'Quiz';

    return (
        <div className="app">
            <div className="quiz-info">📚 {quizName} - Results</div>
            <div className="header">
                <h1 style={{ margin: 0, flex: 1 }}>Quiz Results</h1>
                <div className="header-actions">
                    <button className="change-quiz-btn" onClick={onChangeQuiz}>
                        Change Quiz
                    </button>
                    <button className="clear-btn" onClick={onClearCache}>
                        Clear Cache
                    </button>
                </div>
            </div>

            <div className="results-card">
                <div className="score">{percent}%</div>
                <p className="stats">
                    Correct: {correct} | Incorrect: {state.questions.length - correct}
                </p>
            </div>

            <div className="review">
                {state.questions.map((q, i) => {
                    const isCorrect = state.answers[i] === q.Answer;
                    return (
                        <div key={i} className={`review-item ${isCorrect ? 'answered-correct' : 'answered-wrong'}`}>
                            <strong>
                                Q{i + 1}: {escapeHtml(q.Question)}
                                {q.Trap === 'YES' && <span className="badge">TRAP</span>}
                            </strong>
                            <p>
                                Your Answer: <span style={{ color: isCorrect ? 'var(--success)' : 'var(--danger)' }}>
                                    {escapeHtml(q[`Option-${state.answers[i]}`] || 'Not Answered')}
                                </span>
                            </p>
                            {!isCorrect && (
                                <p>
                                    Correct Answer: <span style={{ color: 'var(--success)' }}>
                                        {escapeHtml(q[`Option-${q.Answer}`])}
                                    </span>
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>

            <button className="btn" onClick={onRestart}>Restart Quiz</button>
            <Footer />
        </div>
    );
}

function Footer() {
    return (
        <div className="footer">
            Developed by <span>K. Narayana Rao</span>
        </div>
    );
}

function App() {
    return (
        <div>
            {/* <App_login /> */}
            <QuizApp />
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));