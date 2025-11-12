const quizData = {
    html: [
        {
            question: "Which HTML tag is used to create the largest heading?",
            options: ["<h1>", "<h6>", "<heading>", "<header>"],
            correct: "<h1>"
        },
        {
            question: "What is the correct HTML tag for creating a hyperlink?",
            options: ["<link>", "<a>", "<href>", "<url>"],
            correct: "<a>"
        },
        {
            question: "Which tag is used to display regular text/paragraph in HTML?",
            options: ["<text>", "<p>", "<paragraph>", "<txt>"],
            correct: "<p>"
        },
        {
            question: "What is the correct HTML tag for creating a button?",
            options: ["<button>", "<btn>", "<input type='button'>", "Both A and C"],
            correct: "Both A and C"
        }
    ],
    javascript: [
        {
            question: "How do you print 'Hello World' to the console in JavaScript?",
            options: ["print('Hello World')", "console.log('Hello World')", "echo('Hello World')", "System.out.println('Hello World')"],
            correct: "console.log('Hello World')"
        },
        {
            question: "Which keyword is used to declare a variable in JavaScript (modern way)?",
            options: ["var", "let", "const", "Both B and C"],
            correct: "Both B and C"
        },
        {
            question: "What is the correct syntax for a while loop in JavaScript?",
            options: ["while (condition) { }", "while condition { }", "loop while (condition) { }", "while: condition { }"],
            correct: "while (condition) { }"
        },
        {
            question: "What is the correct syntax for an if statement in JavaScript?",
            options: ["if condition { }", "if (condition) { }", "if condition then { }", "if: condition { }"],
            correct: "if (condition) { }"
        }
    ],
    python: [
        {
            question: "How do you print 'Hello World' in Python?",
            options: ["console.log('Hello World')", "print('Hello World')", "echo 'Hello World'", "System.out.println('Hello World')"],
            correct: "print('Hello World')"
        },
        {
            question: "How do you create a variable named 'x' with value 5 in Python?",
            options: ["var x = 5", "let x = 5", "x = 5", "int x = 5"],
            correct: "x = 5"
        },
        {
            question: "What is the correct syntax for a while loop in Python?",
            options: ["while (condition):", "while condition:", "while condition {", "loop while condition:"],
            correct: "while condition:"
        },
        {
            question: "What is the correct syntax for an if statement in Python?",
            options: ["if (condition):", "if condition:", "if condition {", "if condition then:"],
            correct: "if condition:"
        }
    ]
};

let currentQuiz = null;
let userAnswers = {};

function startQuiz(language) {
    currentQuiz = language;
    userAnswers = {};
    
    document.getElementById('languageSelection').style.display = 'none';
    document.getElementById('quizContainer').classList.add('active');
    document.getElementById('resultsContainer').classList.remove('active');
    
    displayQuestions();
}

function displayQuestions() {
    const questionsContainer = document.getElementById('questionsContainer');
    const questions = quizData[currentQuiz];
    
    questionsContainer.innerHTML = '';
    
    questions.forEach((q, index) => {
        const questionBox = document.createElement('div');
        questionBox.className = 'question-box';
        
        const questionText = document.createElement('div');
        questionText.className = 'question-text';
        questionText.textContent = `${index + 1}. ${q.question}`;
        questionBox.appendChild(questionText);
        
        q.options.forEach((option, optIndex) => {
            const answerOption = document.createElement('div');
            answerOption.className = 'answer-option';
            answerOption.textContent = option;
            answerOption.dataset.questionIndex = index;
            answerOption.dataset.answer = option;
            answerOption.addEventListener('click', function() {
                selectAnswer(index, option, this);
            });
            questionBox.appendChild(answerOption);
        });
        
        questionsContainer.appendChild(questionBox);
    });
    
    updateProgress();
}

function selectAnswer(questionIndex, answer, element) {
    const questionBox = element.parentElement;
    const allOptions = questionBox.querySelectorAll('.answer-option');
    
    allOptions.forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');
    
    userAnswers[questionIndex] = answer;
    
    updateProgress();
    checkAllAnswered();
}

function updateProgress() {
    const total = quizData[currentQuiz].length;
    const answered = Object.keys(userAnswers).length;
    document.getElementById('progress').textContent = `Progress: ${answered}/${total} questions answered`;
}

function checkAllAnswered() {
    const total = quizData[currentQuiz].length;
    const answered = Object.keys(userAnswers).length;
    document.getElementById('submitBtn').disabled = answered < total;
}

function submitQuiz() {
    const questions = quizData[currentQuiz];
    let score = 0;
    const results = [];
    
    questions.forEach((q, index) => {
        const userAnswer = userAnswers[index];
        const correct = q.correct;
        const isCorrect = userAnswer === correct || isCloseMatch(userAnswer, correct);
        
        if (isCorrect) {
            score++;
        }
        
        results.push({
            question: q.question,
            userAnswer: userAnswer,
            correctAnswer: correct,
            isCorrect: isCorrect
        });
    });
    
    displayResults(score, results);
}

function isCloseMatch(answer1, answer2) {
    if (!answer1 || !answer2) return false;
    
    const normalize = (str) => str.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
    return normalize(answer1) === normalize(answer2);
}

function displayResults(score, results) {
    document.getElementById('quizContainer').classList.remove('active');
    document.getElementById('resultsContainer').classList.add('active');
    
    const total = results.length;
    const percentage = Math.round((score / total) * 100);
    
    document.getElementById('scoreDisplay').innerHTML = `
        Your Score: ${score}/${total} (${percentage}%)
    `;
    
    const reviewContainer = document.getElementById('reviewContainer');
    reviewContainer.innerHTML = '';
    
    results.forEach((result, index) => {
        const reviewItem = document.createElement('div');
        reviewItem.className = 'review-item';
        reviewItem.innerHTML = `
            <div class="review-question">${index + 1}. ${result.question}</div>
            <div class="your-answer ${result.isCorrect ? 'correct' : ''}">
                Your answer: ${result.userAnswer}
                ${result.isCorrect ? '✓' : '✗'}
            </div>
            ${!result.isCorrect ? `<div class="correct-answer">Correct answer: ${result.correctAnswer}</div>` : ''}
        `;
        reviewContainer.appendChild(reviewItem);
    });
}

function restartQuiz() {
    currentQuiz = null;
    userAnswers = {};
    
    document.getElementById('languageSelection').style.display = 'flex';
    document.getElementById('quizContainer').classList.remove('active');
    document.getElementById('resultsContainer').classList.remove('active');
    document.getElementById('questionsContainer').innerHTML = '';
}

// Chatbot Knowledge Base with in-depth explanations
const codingKnowledge = {
    // HTML Topics - In Depth
    'h1': `<strong>The &lt;h1&gt; Tag - Main Heading</strong><br><br>
    <strong>What it is:</strong> The &lt;h1&gt; tag represents the most important heading on your webpage. It's typically used for the main title.<br><br>
    <strong>How to use it:</strong><br>
    <code>&lt;h1&gt;Welcome to My Website&lt;/h1&gt;</code><br><br>
    <strong>All heading levels:</strong><br>
    • &lt;h1&gt; - Largest (use once per page)<br>
    • &lt;h2&gt; - Subheadings<br>
    • &lt;h3&gt; - Sub-subheadings<br>
    • &lt;h4&gt;, &lt;h5&gt;, &lt;h6&gt; - Progressively smaller<br><br>
    <strong>Best practices:</strong><br>
    • Only use ONE &lt;h1&gt; per page<br>
    • Use headings in order (don't skip from h1 to h4)<br>
    • Headings help with SEO and accessibility<br><br>
    <strong>Example structure:</strong><br>
    <code>&lt;h1&gt;My Blog&lt;/h1&gt;<br>
    &lt;h2&gt;Today's Post&lt;/h2&gt;<br>
    &lt;h3&gt;Introduction&lt;/h3&gt;</code>`,
    
    'heading': `<strong>HTML Headings Overview</strong><br><br>
    <strong>What they are:</strong> HTML has 6 levels of headings from &lt;h1&gt; (most important) to &lt;h6&gt; (least important).<br><br>
    <strong>Complete syntax:</strong><br>
    <code>&lt;h1&gt;Biggest Heading&lt;/h1&gt;<br>
    &lt;h2&gt;Second Level&lt;/h2&gt;<br>
    &lt;h3&gt;Third Level&lt;/h3&gt;<br>
    &lt;h4&gt;Fourth Level&lt;/h4&gt;<br>
    &lt;h5&gt;Fifth Level&lt;/h5&gt;<br>
    &lt;h6&gt;Smallest&lt;/h6&gt;</code><br><br>
    <strong>When to use each:</strong><br>
    • &lt;h1&gt;: Page title (once per page)<br>
    • &lt;h2&gt;: Major sections<br>
    • &lt;h3&gt;: Subsections within h2s<br>
    • &lt;h4&gt;-&lt;h6&gt;: Further subdivisions<br><br>
    <strong>Why they matter:</strong> Headings create document structure, improve accessibility for screen readers, and help search engines understand your content.`,
    
    'a tag': `<strong>The &lt;a&gt; Tag - Hyperlinks</strong><br><br>
    <strong>What it is:</strong> The anchor tag creates clickable links to other pages, websites, files, or page sections.<br><br>
    <strong>Basic syntax:</strong><br>
    <code>&lt;a href="destination"&gt;Link Text&lt;/a&gt;</code><br><br>
    <strong>Different types of links:</strong><br><br>
    1. <strong>External links:</strong><br>
    <code>&lt;a href="https://google.com"&gt;Visit Google&lt;/a&gt;</code><br><br>
    2. <strong>Internal page links:</strong><br>
    <code>&lt;a href="about.html"&gt;About Us&lt;/a&gt;</code><br><br>
    3. <strong>Email links:</strong><br>
    <code>&lt;a href="mailto:hello@example.com"&gt;Email Me&lt;/a&gt;</code><br><br>
    4. <strong>Phone links:</strong><br>
    <code>&lt;a href="tel:+1234567890"&gt;Call Us&lt;/a&gt;</code><br><br>
    5. <strong>Anchor links (jump to section):</strong><br>
    <code>&lt;a href="#section1"&gt;Go to Section 1&lt;/a&gt;</code><br><br>
    <strong>Useful attributes:</strong><br>
    • <code>target="_blank"</code> - Opens in new tab<br>
    • <code>title="description"</code> - Shows tooltip on hover<br><br>
    <strong>Example with attributes:</strong><br>
    <code>&lt;a href="https://example.com" target="_blank" title="Visit Example"&gt;Click Here&lt;/a&gt;</code>`,
    
    'link': `<strong>Creating Links in HTML</strong><br><br>
    <strong>The &lt;a&gt; tag is used for all links.</strong> The href attribute tells the browser where to go.<br><br>
    <strong>Step-by-step guide:</strong><br><br>
    1. Start with &lt;a&gt; tag<br>
    2. Add href attribute with destination<br>
    3. Put link text between tags<br>
    4. Close with &lt;/a&gt;<br><br>
    <strong>Complete examples:</strong><br><br>
    <code>&lt;a href="https://wikipedia.org"&gt;Wikipedia&lt;/a&gt;</code><br>
    <code>&lt;a href="contact.html"&gt;Contact Page&lt;/a&gt;</code><br>
    <code>&lt;a href="#top"&gt;Back to Top&lt;/a&gt;</code><br>
    <code>&lt;a href="files/document.pdf"&gt;Download PDF&lt;/a&gt;</code><br><br>
    <strong>Opening links in new tabs:</strong><br>
    <code>&lt;a href="https://example.com" target="_blank"&gt;Opens in new tab&lt;/a&gt;</code><br><br>
    <strong>Styling links:</strong> Links can be styled with CSS to change color, remove underline, or add hover effects.`,
    
    'p tag': `<strong>The &lt;p&gt; Tag - Paragraphs</strong><br><br>
    <strong>What it is:</strong> The paragraph tag is used to define blocks of text. It's one of the most common HTML tags.<br><br>
    <strong>Basic syntax:</strong><br>
    <code>&lt;p&gt;Your paragraph text goes here.&lt;/p&gt;</code><br><br>
    <strong>How to use it:</strong><br>
    <code>&lt;p&gt;This is the first paragraph. It contains several sentences about a topic.&lt;/p&gt;<br>
    &lt;p&gt;This is a second paragraph. Browsers automatically add spacing between paragraphs.&lt;/p&gt;</code><br><br>
    <strong>Key features:</strong><br>
    • Browsers add space before and after each paragraph<br>
    • Text wraps automatically to fit container width<br>
    • Block-level element (takes full width)<br><br>
    <strong>With other tags inside:</strong><br>
    <code>&lt;p&gt;You can have &lt;strong&gt;bold&lt;/strong&gt; or &lt;em&gt;italic&lt;/em&gt; text inside.&lt;/p&gt;<br>
    &lt;p&gt;You can also include &lt;a href="page.html"&gt;links&lt;/a&gt; in paragraphs.&lt;/p&gt;</code><br><br>
    <strong>When to use:</strong> Use &lt;p&gt; for any regular text content. For longer text blocks, use multiple paragraphs rather than one long one.`,
    
    'paragraph': `<strong>Working with Paragraphs in HTML</strong><br><br>
    <strong>The &lt;p&gt; tag creates text paragraphs.</strong><br><br>
    <strong>Complete usage guide:</strong><br><br>
    1. <strong>Simple paragraph:</strong><br>
    <code>&lt;p&gt;Hello, this is a paragraph!&lt;/p&gt;</code><br><br>
    2. <strong>Multiple paragraphs:</strong><br>
    <code>&lt;p&gt;First paragraph here.&lt;/p&gt;<br>
    &lt;p&gt;Second paragraph here.&lt;/p&gt;<br>
    &lt;p&gt;Third paragraph here.&lt;/p&gt;</code><br><br>
    3. <strong>Paragraph with formatting:</strong><br>
    <code>&lt;p&gt;This has &lt;strong&gt;bold&lt;/strong&gt;, &lt;em&gt;italic&lt;/em&gt;, and &lt;u&gt;underlined&lt;/u&gt; text.&lt;/p&gt;</code><br><br>
    <strong>What NOT to do:</strong><br>
    • Don't use &lt;br&gt;&lt;br&gt; instead of paragraphs<br>
    • Don't put paragraphs inside inline elements like &lt;span&gt;<br><br>
    <strong>Spacing:</strong> Browsers automatically add margin above and below paragraphs. You can control this with CSS.`,
    
    'button': `<strong>The &lt;button&gt; Tag - Interactive Buttons</strong><br><br>
    <strong>What it is:</strong> Creates a clickable button element on your webpage.<br><br>
    <strong>Basic syntax:</strong><br>
    <code>&lt;button&gt;Click Me&lt;/button&gt;</code><br><br>
    <strong>Three ways to create buttons:</strong><br><br>
    1. <strong>Button tag (recommended):</strong><br>
    <code>&lt;button&gt;Submit&lt;/button&gt;</code><br><br>
    2. <strong>Input button:</strong><br>
    <code>&lt;input type="button" value="Click"&gt;</code><br><br>
    3. <strong>Input submit (for forms):</strong><br>
    <code>&lt;input type="submit" value="Submit Form"&gt;</code><br><br>
    <strong>Adding click actions:</strong><br>
    <code>&lt;button onclick="alert('Hello!')"&gt;Say Hello&lt;/button&gt;</code><br><br>
    <strong>Button types:</strong><br>
    • <code>type="button"</code> - Regular button<br>
    • <code>type="submit"</code> - Submits a form<br>
    • <code>type="reset"</code> - Resets form fields<br><br>
    <strong>Complete example with JavaScript:</strong><br>
    <code>&lt;button onclick="myFunction()"&gt;Click Me&lt;/button&gt;<br>
    &lt;script&gt;<br>
    function myFunction() {<br>
      &nbsp;&nbsp;alert("Button was clicked!");<br>
    }<br>
    &lt;/script&gt;</code><br><br>
    <strong>Disabled button:</strong><br>
    <code>&lt;button disabled&gt;Can't Click This&lt;/button&gt;</code>`,
    
    'text': `<strong>Displaying Text in HTML</strong><br><br>
    <strong>Common text tags:</strong><br><br>
    1. <strong>&lt;p&gt; - Paragraph:</strong><br>
    <code>&lt;p&gt;Regular paragraph text&lt;/p&gt;</code><br><br>
    2. <strong>&lt;h1&gt;-&lt;h6&gt; - Headings:</strong><br>
    <code>&lt;h1&gt;Main Title&lt;/h1&gt;</code><br><br>
    3. <strong>&lt;span&gt; - Inline text:</strong><br>
    <code>&lt;p&gt;This is &lt;span style="color:red"&gt;red text&lt;/span&gt;&lt;/p&gt;</code><br><br>
    4. <strong>&lt;div&gt; - Text container:</strong><br>
    <code>&lt;div&gt;A block of content&lt;/div&gt;</code><br><br>
    <strong>Text formatting tags:</strong><br>
    • &lt;strong&gt; or &lt;b&gt; - <strong>Bold text</strong><br>
    • &lt;em&gt; or &lt;i&gt; - <em>Italic text</em><br>
    • &lt;u&gt; - <u>Underline</u><br>
    • &lt;mark&gt; - Highlighted text<br>
    • &lt;small&gt; - Smaller text<br>
    • &lt;code&gt; - Code text<br><br>
    <strong>Example combining tags:</strong><br>
    <code>&lt;p&gt;This is &lt;strong&gt;bold&lt;/strong&gt; and &lt;em&gt;italic&lt;/em&gt; text.&lt;/p&gt;</code>`,
    
    // JavaScript Topics - In Depth
    'console.log': `<strong>console.log() - JavaScript Output</strong><br><br>
    <strong>What it is:</strong> Prints messages to the browser's developer console. Essential for debugging.<br><br>
    <strong>Basic syntax:</strong><br>
    <code>console.log("Hello World");</code><br><br>
    <strong>Different ways to use it:</strong><br><br>
    1. <strong>Print text:</strong><br>
    <code>console.log("This is a message");</code><br><br>
    2. <strong>Print variables:</strong><br>
    <code>let name = "Alice";<br>
    console.log(name);</code><br><br>
    3. <strong>Print multiple items:</strong><br>
    <code>console.log("Name:", name, "Age:", 25);</code><br><br>
    4. <strong>Print with string templates:</strong><br>
    <code>console.log(\`Hello \${name}, you are \${age} years old\`);</code><br><br>
    5. <strong>Print objects:</strong><br>
    <code>let person = {name: "Bob", age: 30};<br>
    console.log(person);</code><br><br>
    <strong>Other console methods:</strong><br>
    • <code>console.error("Error!")</code> - Red error message<br>
    • <code>console.warn("Warning!")</code> - Yellow warning<br>
    • <code>console.table(data)</code> - Display data as table<br><br>
    <strong>How to view:</strong> Open browser DevTools (F12), then click the "Console" tab.`,
    
    'print': `<strong>Printing Output in JavaScript vs Python</strong><br><br>
    <strong>JavaScript:</strong><br>
    <code>console.log("Hello World");</code><br>
    Output goes to browser console (press F12)<br><br>
    <strong>Python:</strong><br>
    <code>print("Hello World")</code><br>
    Output goes to terminal/console<br><br>
    <strong>JavaScript examples:</strong><br>
    <code>console.log("Text");<br>
    console.log(42);<br>
    console.log("Name:", name);</code><br><br>
    <strong>Python examples:</strong><br>
    <code>print("Text")<br>
    print(42)<br>
    print("Name:", name)</code><br><br>
    <strong>Key difference:</strong> JavaScript runs in browsers, Python runs on servers or computers. Both display output but in different places.`,
    
    'variable': `<strong>Variables - Storing Data</strong><br><br>
    <strong>What they are:</strong> Variables are containers that store data values you can use and change in your code.<br><br>
    <strong>JavaScript - Three ways:</strong><br><br>
    1. <strong>let (can change):</strong><br>
    <code>let age = 25;<br>
    age = 26; // Can update</code><br><br>
    2. <strong>const (cannot change):</strong><br>
    <code>const name = "Alice";<br>
    // name = "Bob"; would cause error</code><br><br>
    3. <strong>var (old way, avoid):</strong><br>
    <code>var count = 0;</code><br><br>
    <strong>Python - Simple assignment:</strong><br>
    <code>name = "Alice"<br>
    age = 25<br>
    is_student = True</code><br><br>
    <strong>Data types you can store:</strong><br>
    • Numbers: <code>let count = 42;</code><br>
    • Strings (text): <code>let name = "John";</code><br>
    • Booleans: <code>let isActive = true;</code><br>
    • Arrays: <code>let items = [1, 2, 3];</code><br>
    • Objects: <code>let person = {name: "Alice", age: 25};</code><br><br>
    <strong>Naming rules:</strong><br>
    • Start with letter, $, or _<br>
    • Can contain letters, numbers, $, _<br>
    • Case sensitive (age ≠ Age)<br>
    • Can't use reserved words (let, if, while, etc.)`,
    
    'let': `<strong>The let Keyword - Mutable Variables</strong><br><br>
    <strong>What it is:</strong> Declares a variable in JavaScript that can be changed later.<br><br>
    <strong>Syntax:</strong><br>
    <code>let variableName = value;</code><br><br>
    <strong>Complete examples:</strong><br><br>
    <code>let age = 25;<br>
    let name = "Alice";<br>
    let isStudent = true;<br>
    let score = 95.5;</code><br><br>
    <strong>Updating values:</strong><br>
    <code>let count = 0;<br>
    count = 1; // Updated to 1<br>
    count = count + 1; // Now 2<br>
    count++; // Now 3</code><br><br>
    <strong>When to use let:</strong><br>
    • Counter variables in loops<br>
    • Values that change over time<br>
    • User input storage<br>
    • Calculated values that update<br><br>
    <strong>Example in context:</strong><br>
    <code>let score = 0;<br>
    score = score + 10; // Add points<br>
    console.log("Score:", score); // Shows: Score: 10</code><br><br>
    <strong>let vs const:</strong> Use <code>let</code> when value will change, <code>const</code> when it won't.`,
    
    'const': `<strong>The const Keyword - Constant Variables</strong><br><br>
    <strong>What it is:</strong> Declares a variable that CANNOT be reassigned after creation.<br><br>
    <strong>Syntax:</strong><br>
    <code>const variableName = value;</code><br><br>
    <strong>Examples:</strong><br>
    <code>const PI = 3.14159;<br>
    const MAX_USERS = 100;<br>
    const APP_NAME = "My App";<br>
    const TAX_RATE = 0.08;</code><br><br>
    <strong>What you CAN'T do:</strong><br>
    <code>const age = 25;<br>
    age = 26; // ERROR! Cannot reassign const</code><br><br>
    <strong>What you CAN do with objects/arrays:</strong><br>
    <code>const person = {name: "Alice", age: 25};<br>
    person.age = 26; // OK! Modifying property<br>
    person.city = "NYC"; // OK! Adding property<br><br>
    const numbers = [1, 2, 3];<br>
    numbers.push(4); // OK! Modifying array<br>
    numbers[0] = 10; // OK! Changing element</code><br><br>
    <strong>When to use const:</strong><br>
    • Values that never change (PI, settings)<br>
    • Function declarations<br>
    • Object/array references<br>
    • Default choice (use const unless you need let)<br><br>
    <strong>Best practice:</strong> Use const by default. Only use let when you know the value will need to be reassigned.`,
    
    'while loop': `<strong>While Loops - Repeating Code</strong><br><br>
    <strong>What it is:</strong> Repeats code while a condition is true.<br><br>
    <strong>JavaScript syntax:</strong><br>
    <code>while (condition) {<br>
      &nbsp;&nbsp;// Code to repeat<br>
    }</code><br><br>
    <strong>Python syntax:</strong><br>
    <code>while condition:<br>
      &nbsp;&nbsp;# Code to repeat (must be indented)</code><br><br>
    <strong>JavaScript example - Count to 5:</strong><br>
    <code>let count = 1;<br>
    while (count <= 5) {<br>
      &nbsp;&nbsp;console.log(count);<br>
      &nbsp;&nbsp;count++;<br>
    }<br>
    // Prints: 1, 2, 3, 4, 5</code><br><br>
    <strong>Python example - Count to 5:</strong><br>
    <code>count = 1<br>
    while count <= 5:<br>
      &nbsp;&nbsp;print(count)<br>
      &nbsp;&nbsp;count += 1</code><br><br>
    <strong>Common patterns:</strong><br><br>
    1. <strong>Counter loop:</strong><br>
    <code>let i = 0;<br>
    while (i < 10) {<br>
      &nbsp;&nbsp;console.log(i);<br>
      &nbsp;&nbsp;i++;<br>
    }</code><br><br>
    2. <strong>Until condition met:</strong><br>
    <code>let correct = false;<br>
    while (!correct) {<br>
      &nbsp;&nbsp;// Keep trying until correct<br>
    }</code><br><br>
    <strong>Important:</strong> Make sure your loop can end! Always update the condition inside the loop to avoid infinite loops.`,
    
    'while true': `<strong>While True - Infinite Loops</strong><br><br>
    <strong>What it is:</strong> A loop that runs forever until you explicitly break out of it.<br><br>
    <strong>JavaScript syntax:</strong><br>
    <code>while (true) {<br>
      &nbsp;&nbsp;// Runs forever unless you break<br>
      &nbsp;&nbsp;if (condition) break;<br>
    }</code><br><br>
    <strong>Python syntax:</strong><br>
    <code>while True:<br>
      &nbsp;&nbsp;# Runs forever unless you break<br>
      &nbsp;&nbsp;if condition:<br>
      &nbsp;&nbsp;&nbsp;&nbsp;break</code><br><br>
    <strong>Safe example with break:</strong><br>
    <code>let count = 0;<br>
    while (true) {<br>
      &nbsp;&nbsp;count++;<br>
      &nbsp;&nbsp;console.log(count);<br>
      &nbsp;&nbsp;if (count >= 5) {<br>
      &nbsp;&nbsp;&nbsp;&nbsp;break; // Exit loop when count is 5<br>
      &nbsp;&nbsp;}<br>
    }</code><br><br>
    <strong>Python example - Menu loop:</strong><br>
    <code>while True:<br>
      &nbsp;&nbsp;choice = input("Enter choice (q to quit): ")<br>
      &nbsp;&nbsp;if choice == "q":<br>
      &nbsp;&nbsp;&nbsp;&nbsp;break<br>
      &nbsp;&nbsp;print("You chose:", choice)</code><br><br>
    <strong>Using continue:</strong><br>
    <code>while (true) {<br>
      &nbsp;&nbsp;let num = getNumber();<br>
      &nbsp;&nbsp;if (num < 0) continue; // Skip negative, keep looping<br>
      &nbsp;&nbsp;if (num === 0) break; // Exit on zero<br>
      &nbsp;&nbsp;processNumber(num);<br>
    }</code><br><br>
    <strong>Warning:</strong> Without a break statement, while(true) will freeze your program! Always include an exit condition.`,
    
    'if statement': `<strong>If Statements - Making Decisions</strong><br><br>
    <strong>What it is:</strong> Runs code only when a condition is true.<br><br>
    <strong>JavaScript syntax:</strong><br>
    <code>if (condition) {<br>
      &nbsp;&nbsp;// Code runs if condition is true<br>
    }</code><br><br>
    <strong>Python syntax:</strong><br>
    <code>if condition:<br>
      &nbsp;&nbsp;# Code runs if condition is true (must indent!)</code><br><br>
    <strong>JavaScript - Complete if/else:</strong><br>
    <code>if (age >= 18) {<br>
      &nbsp;&nbsp;console.log("You are an adult");<br>
    } else {<br>
      &nbsp;&nbsp;console.log("You are a minor");<br>
    }</code><br><br>
    <strong>JavaScript - Multiple conditions:</strong><br>
    <code>if (score >= 90) {<br>
      &nbsp;&nbsp;console.log("Grade: A");<br>
    } else if (score >= 80) {<br>
      &nbsp;&nbsp;console.log("Grade: B");<br>
    } else if (score >= 70) {<br>
      &nbsp;&nbsp;console.log("Grade: C");<br>
    } else {<br>
      &nbsp;&nbsp;console.log("Grade: F");<br>
    }</code><br><br>
    <strong>Python - Multiple conditions:</strong><br>
    <code>if score >= 90:<br>
      &nbsp;&nbsp;print("Grade: A")<br>
    elif score >= 80:<br>
      &nbsp;&nbsp;print("Grade: B")<br>
    elif score >= 70:<br>
      &nbsp;&nbsp;print("Grade: C")<br>
    else:<br>
      &nbsp;&nbsp;print("Grade: F")</code><br><br>
    <strong>Comparison operators:</strong><br>
    • <code>===</code> (JS) or <code>==</code> (Python) - equals<br>
    • <code>!==</code> (JS) or <code>!=</code> (Python) - not equals<br>
    • <code>&gt;</code> - greater than<br>
    • <code>&lt;</code> - less than<br>
    • <code>&gt;=</code> - greater than or equal<br>
    • <code>&lt;=</code> - less than or equal<br><br>
    <strong>Combining conditions:</strong><br>
    <code>if (age >= 18 && hasLicense) {<br>
      &nbsp;&nbsp;console.log("Can drive");<br>
    }</code>`,
    
    'if': `<strong>If Statements - Conditional Logic</strong><br><br>
    <strong>Complete guide to if statements:</strong><br><br>
    <strong>1. Simple if (JavaScript):</strong><br>
    <code>if (temperature > 30) {<br>
      &nbsp;&nbsp;console.log("It's hot!");<br>
    }</code><br><br>
    <strong>2. If with else:</strong><br>
    <code>if (isRaining) {<br>
      &nbsp;&nbsp;console.log("Bring umbrella");<br>
    } else {<br>
      &nbsp;&nbsp;console.log("Enjoy the sun");<br>
    }</code><br><br>
    <strong>3. Multiple conditions:</strong><br>
    <code>if (time < 12) {<br>
      &nbsp;&nbsp;console.log("Good morning");<br>
    } else if (time < 18) {<br>
      &nbsp;&nbsp;console.log("Good afternoon");<br>
    } else {<br>
      &nbsp;&nbsp;console.log("Good evening");<br>
    }</code><br><br>
    <strong>Python version:</strong><br>
    <code>if time < 12:<br>
      &nbsp;&nbsp;print("Good morning")<br>
    elif time < 18:<br>
      &nbsp;&nbsp;print("Good afternoon")<br>
    else:<br>
      &nbsp;&nbsp;print("Good evening")</code><br><br>
    <strong>AND conditions (both must be true):</strong><br>
    <code>if (age >= 18 && hasID) {<br>
      &nbsp;&nbsp;console.log("Can enter");<br>
    }</code><br><br>
    <strong>OR conditions (one must be true):</strong><br>
    <code>if (isWeekend || isHoliday) {<br>
      &nbsp;&nbsp;console.log("Day off!");<br>
    }</code><br><br>
    <strong>NOT condition:</strong><br>
    <code>if (!isLoggedIn) {<br>
      &nbsp;&nbsp;console.log("Please log in");<br>
    }</code>`,
    
    // Python Topics - In Depth
    'print python': `<strong>Python print() Function</strong><br><br>
    <strong>What it is:</strong> Displays output to the console/terminal in Python.<br><br>
    <strong>Basic syntax:</strong><br>
    <code>print("Hello World")</code><br><br>
    <strong>Different ways to use print():</strong><br><br>
    1. <strong>Print text:</strong><br>
    <code>print("Hello!")</code><br><br>
    2. <strong>Print variables:</strong><br>
    <code>name = "Alice"<br>
    print(name)</code><br><br>
    3. <strong>Print multiple items:</strong><br>
    <code>print("Name:", name, "Age:", 25)</code><br><br>
    4. <strong>Print with separator:</strong><br>
    <code>print("A", "B", "C", sep="-")<br>
    # Output: A-B-C</code><br><br>
    5. <strong>Print without newline:</strong><br>
    <code>print("Hello", end=" ")<br>
    print("World")<br>
    # Output: Hello World (on same line)</code><br><br>
    6. <strong>Print with f-strings (modern):</strong><br>
    <code>age = 25<br>
    print(f"I am {age} years old")</code><br><br>
    7. <strong>Print with .format():</strong><br>
    <code>print("I am {} years old".format(age))</code><br><br>
    8. <strong>Print multiple lines:</strong><br>
    <code>print("Line 1\\nLine 2\\nLine 3")</code><br><br>
    <strong>Common use cases:</strong><br>
    • Debugging: <code>print("Debug:", variable)</code><br>
    • User output: <code>print("Welcome to the program!")</code><br>
    • Results: <code>print("Total:", total)</code>`,
    
    'python variable': `<strong>Variables in Python</strong><br><br>
    <strong>What they are:</strong> Containers that store data. Python automatically detects the type!<br><br>
    <strong>Creating variables - Simple assignment:</strong><br>
    <code>variable_name = value</code><br><br>
    <strong>Examples of all types:</strong><br><br>
    <code># Numbers (integers)<br>
    age = 25<br>
    count = 0<br><br>
    # Numbers (floats)<br>
    price = 19.99<br>
    temperature = 98.6<br><br>
    # Strings (text)<br>
    name = "Alice"<br>
    message = 'Hello World'<br><br>
    # Booleans (True/False)<br>
    is_student = True<br>
    has_license = False<br><br>
    # Lists (arrays)<br>
    numbers = [1, 2, 3, 4, 5]<br>
    names = ["Alice", "Bob", "Charlie"]<br><br>
    # Dictionaries (key-value pairs)<br>
    person = {"name": "Alice", "age": 25}</code><br><br>
    <strong>Updating variables:</strong><br>
    <code>count = 0<br>
    count = count + 1 # Now 1<br>
    count += 1 # Now 2 (shorthand)</code><br><br>
    <strong>Multiple assignment:</strong><br>
    <code>x, y, z = 1, 2, 3<br>
    a = b = c = 0 # All equal to 0</code><br><br>
    <strong>Naming rules:</strong><br>
    • Use lowercase with underscores: <code>user_name</code><br>
    • Start with letter or underscore<br>
    • Can contain letters, numbers, underscores<br>
    • Case sensitive (age ≠ Age)<br>
    • Can't use Python keywords (if, while, print, etc.)<br><br>
    <strong>Checking type:</strong><br>
    <code>print(type(age)) # &lt;class 'int'&gt;</code>`,
    
    'python while': `<strong>While Loops in Python</strong><br><br>
    <strong>What it is:</strong> Repeats code as long as a condition is True.<br><br>
    <strong>Syntax (note the colon and indent!):</strong><br>
    <code>while condition:<br>
      &nbsp;&nbsp;# Code to repeat (MUST be indented)</code><br><br>
    <strong>Simple example - Count to 5:</strong><br>
    <code>count = 1<br>
    while count <= 5:<br>
      &nbsp;&nbsp;print(count)<br>
      &nbsp;&nbsp;count += 1<br>
    # Prints: 1, 2, 3, 4, 5</code><br><br>
    <strong>Example - User input loop:</strong><br>
    <code>password = ""<br>
    while password != "secret":<br>
      &nbsp;&nbsp;password = input("Enter password: ")<br>
    print("Access granted!")</code><br><br>
    <strong>Example - Sum numbers:</strong><br>
    <code>total = 0<br>
    number = 1<br>
    while number <= 10:<br>
      &nbsp;&nbsp;total += number<br>
      &nbsp;&nbsp;number += 1<br>
    print("Sum:", total) # 55</code><br><br>
    <strong>Using break to exit early:</strong><br>
    <code>count = 0<br>
    while count < 100:<br>
      &nbsp;&nbsp;count += 1<br>
      &nbsp;&nbsp;if count == 10:<br>
      &nbsp;&nbsp;&nbsp;&nbsp;break # Exit when count is 10<br>
    print(count) # 10</code><br><br>
    <strong>Using continue to skip:</strong><br>
    <code>count = 0<br>
    while count < 10:<br>
      &nbsp;&nbsp;count += 1<br>
      &nbsp;&nbsp;if count % 2 == 0:<br>
      &nbsp;&nbsp;&nbsp;&nbsp;continue # Skip even numbers<br>
      &nbsp;&nbsp;print(count) # Prints: 1, 3, 5, 7, 9</code><br><br>
    <strong>Important:</strong> Always make sure your condition can become False, or include a break statement, otherwise you'll have an infinite loop!`,
    
    'python if': `<strong>If Statements in Python</strong><br><br>
    <strong>What it is:</strong> Runs code only when a condition is True.<br><br>
    <strong>Basic syntax (note colon and indent!):</strong><br>
    <code>if condition:<br>
      &nbsp;&nbsp;# Code (MUST be indented)</code><br><br>
    <strong>Simple if example:</strong><br>
    <code>age = 20<br>
    if age >= 18:<br>
      &nbsp;&nbsp;print("You are an adult")</code><br><br>
    <strong>If-else example:</strong><br>
    <code>temperature = 25<br>
    if temperature > 30:<br>
      &nbsp;&nbsp;print("It's hot!")<br>
    else:<br>
      &nbsp;&nbsp;print("It's comfortable")</code><br><br>
    <strong>If-elif-else (multiple conditions):</strong><br>
    <code>score = 85<br>
    if score >= 90:<br>
      &nbsp;&nbsp;print("Grade: A")<br>
    elif score >= 80:<br>
      &nbsp;&nbsp;print("Grade: B")<br>
    elif score >= 70:<br>
      &nbsp;&nbsp;print("Grade: C")<br>
    elif score >= 60:<br>
      &nbsp;&nbsp;print("Grade: D")<br>
    else:<br>
      &nbsp;&nbsp;print("Grade: F")</code><br><br>
    <strong>Comparison operators:</strong><br>
    • <code>==</code> equals<br>
    • <code>!=</code> not equals<br>
    • <code>&gt;</code> greater than<br>
    • <code>&lt;</code> less than<br>
    • <code>&gt;=</code> greater than or equal<br>
    • <code>&lt;=</code> less than or equal<br><br>
    <strong>Combining conditions with AND:</strong><br>
    <code>age = 20<br>
    has_id = True<br>
    if age >= 18 and has_id:<br>
      &nbsp;&nbsp;print("Can enter")</code><br><br>
    <strong>Combining conditions with OR:</strong><br>
    <code>day = "Saturday"<br>
    if day == "Saturday" or day == "Sunday":<br>
      &nbsp;&nbsp;print("It's the weekend!")</code><br><br>
    <strong>Using NOT:</strong><br>
    <code>is_raining = False<br>
    if not is_raining:<br>
      &nbsp;&nbsp;print("No umbrella needed")</code><br><br>
    <strong>Nested if statements:</strong><br>
    <code>age = 25<br>
    if age >= 18:<br>
      &nbsp;&nbsp;if age >= 65:<br>
      &nbsp;&nbsp;&nbsp;&nbsp;print("Senior citizen")<br>
      &nbsp;&nbsp;else:<br>
      &nbsp;&nbsp;&nbsp;&nbsp;print("Adult")<br>
    else:<br>
      &nbsp;&nbsp;print("Minor")</code>`
};

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const chatBox = document.getElementById('chatBox');
    const message = input.value.trim();
    
    if (message === '') return;
    
    // Add user message
    const userMessageDiv = document.createElement('div');
    userMessageDiv.className = 'chat-message user-message';
    userMessageDiv.textContent = message;
    chatBox.appendChild(userMessageDiv);
    
    // Clear input
    input.value = '';
    
    // Scroll to bottom
    chatBox.scrollTop = chatBox.scrollHeight;
    
    // Generate bot response
    setTimeout(() => {
        const botMessageDiv = document.createElement('div');
        botMessageDiv.className = 'chat-message bot-message';
        botMessageDiv.innerHTML = getCodingResponse(message);
        chatBox.appendChild(botMessageDiv);
        
        // Scroll to bottom
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 500);
}

function getCodingResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check knowledge base for matching topics
    for (const [topic, response] of Object.entries(codingKnowledge)) {
        if (lowerMessage.includes(topic)) {
            return response;
        }
    }
    
    // General responses for language categories
    if (lowerMessage.includes('html')) {
        return 'HTML (HyperText Markup Language) is used to structure web pages. Key topics include headings (<code>&lt;h1&gt;</code>-<code>&lt;h6&gt;</code>), links (<code>&lt;a&gt;</code>), paragraphs (<code>&lt;p&gt;</code>), and buttons (<code>&lt;button&gt;</code>). What would you like to know about?';
    } else if (lowerMessage.includes('javascript') || lowerMessage.includes('js')) {
        return 'JavaScript is a programming language for web interactivity. Important concepts include: <code>console.log()</code> for printing, <code>let/const</code> for variables, <code>while</code> loops for repetition, and <code>if</code> statements for decisions. What would you like to learn?';
    } else if (lowerMessage.includes('python')) {
        return 'Python is a beginner-friendly programming language. Key concepts include: <code>print()</code> for output, simple variable assignment (<code>x = 5</code>), <code>while</code> loops, and <code>if</code> statements. Python uses indentation instead of curly braces. What topic interests you?';
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        return 'Hello! I can help you understand HTML, JavaScript, and Python concepts. Try asking about specific topics like "what is the a tag" or "explain while loops in Python"!';
    } else if (lowerMessage.includes('help')) {
        return 'I can explain coding concepts! Try asking about:<br>• HTML: headings, links, paragraphs, buttons<br>• JavaScript: console.log, variables, while loops, if statements<br>• Python: print, variables, while loops, if statements';
    } else {
        return 'I\'m not sure about that specific topic. Try asking about HTML tags (h1, a, p, button), JavaScript concepts (console.log, variables, while loops, if statements), or Python basics (print, variables, while loops, if statements)!';
    }
}

// Allow sending message with Enter key for chatbot
document.getElementById('chatInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
});

