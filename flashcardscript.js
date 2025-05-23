document.addEventListener('DOMContentLoaded', () => {
    // 問題と解答のデータ
    // 各問題に 'tags' プロパティを追加し、配列でタグを指定します。
    const problems = [
        {
            question: "一次方程式 $2x + 5 = 11$ を解きなさい。",
            answer: "$2x = 11 - 5 \\Rightarrow 2x = 6 \\Rightarrow x = 3$",
            tags: ["方程式"]
        },
        {
            question: "二次方程式 $x^2 - 4x + 4 = 0$ を解きなさい。",
            answer: "$(x - 2)^2 = 0 \\Rightarrow x = 2$",
            tags: ["方程式", "二次関数"]
        },
        {
            question: "関数 $y = 2x^2 + 3x - 1$ を微分しなさい。",
            answer: "$y' = 4x + 3$",
            tags: ["微分"]
        },
        {
            question: "数列 $1, 3, 5, 7, \\dots$ の一般項を求めなさい。",
            answer: "$a_n = 2n - 1$",
            tags: ["数列"]
        },
        {
            question: "三角形の内角の和は何度ですか？",
            answer: "$180^\\circ$",
            tags: ["図形"]
        },
        {
            question: "不定積分 $\\int (3x^2 + 2x) dx$ を計算しなさい。",
            answer: "$x^3 + x^2 + C$",
            tags: ["積分"]
        },
        {
            question: "連立方程式 $x+y=5, x-y=1$ を解きなさい。",
            answer: "$x=3, y=2$",
            tags: ["方程式"]
        },
        {
             question: "$X$ を空でない集合とする.関数$d$ が $X$ 上の距離関数であることの定義を述べよ.",
             answer: `次の3条件をみたすとき:
            <ol>
                <li>任意の $x,y \\in X$ に対して $d(x,y) \\geq 0$ で,$d(x,y)=0 \\Longrightleftarrow x=y.$</li>
                <li>任意の $x,y \\in X$ に対して $d(x,y)=d(y,x).$</li>
                <li>任意の $x,y,z \\in X$ に対して $d(x,z) \\leq d(x,y)+d(y,z).$</li>
            </ol>
        `,
             tags: ["位相空間","距離空間"]
        }
        // 他の問題をここに追加できます
        // {
        //     question: "新しい問題のLaTeX記法",
        //     answer: "新しい解答のLaTeX記法",
        //     tags: ["新しいタグ", "複数タグ"]
        // }
    ];

    let currentProblems = []; // 現在出題される問題のリスト
    let unsolvedProblems = []; // わからなかった問題のリスト
    let currentIndex = 0; // 現在の問題のインデックス
    let selectedTag = "all"; // 選択されたタグ (初期値は"all"で全ての分野)

    // DOM要素の取得
    const questionDiv = document.getElementById('question');
    const answerDiv = document.getElementById('answer');
    const solvedBtn = document.getElementById('solvedBtn');
    const unsolvedBtn = document.getElementById('unsolvedBtn');
    const accordionHeader = document.querySelector('.accordion-header');
    const accordionContent = document.querySelector('.accordion-content');
    const flashcardDiv = document.getElementById('flashcard');
    const completionMessageDiv = document.getElementById('completionMessage');
    const restartBtn = document.getElementById('restartBtn');

    const tagSelectionDiv = document.getElementById('tagSelection'); // 新規
    const tagSelect = document.getElementById('tagSelect');         // 新規
    const startQuizBtn = document.getElementById('startQuizBtn');   // 新規

    // 問題をシャッフルする関数
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // タグオプションを生成する関数
    function populateTagSelect() {
        const allTags = new Set(); // 重複を避けるためにSetを使用
        problems.forEach(problem => {
            problem.tags.forEach(tag => allTags.add(tag));
        });

        // タグをソートしてoptionに追加
        Array.from(allTags).sort().forEach(tag => {
            const option = document.createElement('option');
            option.value = tag;
            option.textContent = tag;
            tagSelect.appendChild(option);
        });
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
                // 全てのカードを終えたら、タグ選択画面に戻るオプションも
                // restartBtn.textContent = '別の分野で学習する';
            }
        }
    }

    // クイズを初期化・開始する関数
    function initializeQuiz() {
        // 選択されたタグに基づいて問題をフィルタリング
        let filteredProblems = problems;
        if (selectedTag !== "all") {
            filteredProblems = problems.filter(problem => problem.tags.includes(selectedTag));
        }

        if (filteredProblems.length === 0) {
            alert(`選択されたタグ「${selectedTag}」に問題がありません。別のタグを選択してください。`);
            tagSelectionDiv.style.display = 'block'; // タグ選択画面に戻す
            flashcardDiv.style.display = 'none';
            completionMessageDiv.style.display = 'none';
            return; // クイズ開始を中止
        }

        currentProblems = shuffleArray([...filteredProblems]); // フィルタリングされた問題をコピーしてシャッフル
        unsolvedProblems = [];
        currentIndex = 0;

        tagSelectionDiv.style.display = 'none'; // タグ選択画面を非表示に
        flashcardDiv.style.display = 'block';   // フラッシュカードを表示
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
        // 全てのカードを終えた後、タグ選択画面に戻る
        tagSelectionDiv.style.display = 'block';
        flashcardDiv.style.display = 'none';
        completionMessageDiv.style.display = 'none';
        tagSelect.value = "all"; // 選択をリセット
        selectedTag = "all";
    });

    // 新規イベントリスナー
    tagSelect.addEventListener('change', (event) => {
        selectedTag = event.target.value;
    });

    startQuizBtn.addEventListener('click', () => {
        initializeQuiz();
    });

    // アプリケーション起動時にタグ選択オプションを生成し、タグ選択画面を表示
    populateTagSelect();
    tagSelectionDiv.style.display = 'block'; // 初期表示はタグ選択画面
    flashcardDiv.style.display = 'none'; // フラッシュカードは初期非表示
});