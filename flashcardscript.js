document.addEventListener('DOMContentLoaded', () => {
    // 問題と解答のデータ
    // 問題と解答をここに記述します。LaTeX記法が使えます。
    const problems = [
        {
            question: "一次方程式 \(2x + 5 = 11\) を解きなさい。",
            answer: "\(2x = 11 - 5 \\Rightarrow 2x = 6 \\Rightarrow x = 3\)"
        },
        {
            question: "二次方程式 $x^2 - 4x + 4 = 0$ を解きなさい。",
            answer: "$(x - 2)^2 = 0 \\Rightarrow x = 2$"
        },
        {
            question: "関数 $y = 2x^2 + 3x - 1$ を微分しなさい。",
            answer: "$y' = 4x + 3$"
        },
        {
            question: "数列 $1, 3, 5, 7, \\dots$ の一般項を求めなさい。",
            answer: "$a_n = 2n - 1$"
        },
        {
            question: "三角形の内角の和は何度ですか？",
            answer: "$180^\\circ$"
        }
        // 他の問題をここに追加できます
        // {
        //     question: "新しい問題のLaTeX記法",
        //     answer: "新しい解答のLaTeX記法"
        // }
    ];

    let currentProblems = []; // 現在出題される問題のリスト
    let unsolvedProblems = []; // わからなかった問題のリスト
    let currentIndex = 0; // 現在の問題のインデックス

    const questionDiv = document.getElementById('question');
    const answerDiv = document.getElementById('answer');
    const solvedBtn = document.getElementById('solvedBtn');
    const unsolvedBtn = document.getElementById('unsolvedBtn');
    const accordionHeader = document.querySelector('.accordion-header');
    const accordionContent = document.querySelector('.accordion-content');
    const flashcardDiv = document.getElementById('flashcard');
    const completionMessageDiv = document.getElementById('completionMessage');
    const restartBtn = document.getElementById('restartBtn');

    // 問題をシャッフルする関数
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // 次の問題を表示する関数
    function displayNextProblem() {
        if (currentIndex < currentProblems.length) {
            const problem = currentProblems[currentIndex];
            questionDiv.innerHTML = problem.question;
            answerDiv.innerHTML = problem.answer;

            // MathJaxで数式をレンダリング
            if (window.MathJax) {
                window.MathJax.typesetPromise([questionDiv, answerDiv]).then(() => {
                    // 数式レンダリング後にアコーディオンを閉じ、解答を非表示に
                    accordionContent.style.maxHeight = null;
                    accordionContent.classList.remove('active');
                }).catch((err) => console.error("MathJax typesetting failed:", err));
            } else {
                // MathJaxが読み込まれていない場合のフォールバック
                accordionContent.style.maxHeight = null;
                accordionContent.classList.remove('active');
            }
        } else {
            // 全ての問題を終えた場合
            if (unsolvedProblems.length > 0) {
                // わからなかった問題があれば、それを再度出題
                currentProblems = shuffleArray([...unsolvedProblems]); // コピーしてシャッフル
                unsolvedProblems = []; // リセット
                currentIndex = 0;
                displayNextProblem();
            } else {
                // 全ての問題を解き終えた場合
                flashcardDiv.style.display = 'none';
                completionMessageDiv.style.display = 'block';
            }
        }
    }

    // 初期化関数
    function initializeQuiz() {
        currentProblems = shuffleArray([...problems]); // 元の問題リストをコピーしてシャッフル
        unsolvedProblems = [];
        currentIndex = 0;
        flashcardDiv.style.display = 'block';
        completionMessageDiv.style.display = 'none';
        displayNextProblem();
    }

    // イベントリスナー
    accordionHeader.addEventListener('click', () => {
        accordionContent.classList.toggle('active');
        if (accordionContent.classList.contains('active')) {
            accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";
        } else {
            accordionContent.style.maxHeight = null;
        }
    });

    solvedBtn.addEventListener('click', () => {
        currentIndex++;
        displayNextProblem();
    });

    unsolvedBtn.addEventListener('click', () => {
        unsolvedProblems.push(currentProblems[currentIndex]); // わからなかった問題を追加
        currentIndex++;
        displayNextProblem();
    });

    restartBtn.addEventListener('click', () => {
        initializeQuiz();
    });

    // アプリケーション起動時にクイズを初期化
    initializeQuiz();
});
