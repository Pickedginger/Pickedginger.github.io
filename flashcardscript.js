document.addEventListener('DOMContentLoaded', () => {
    // 問題と解答のデータ (共通のデータソース)
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
                <li>任意の $x,y \\in X$ に対して $d(x,y) \\geq 0$ で,$d(x,y)=0 \\Longleftrightarrow x=y.$</li>
                <li>任意の $x,y \\in X$ に対して $d(x,y)=d(y,x).$</li>
                <li>任意の $x,y,z \\in X$ に対して $d(x,z) \\leq d(x,y)+d(y,z).$</li>
            </ol>
        `,
             tags: ["距離空間"]
        },
        {
             question: `$(X,d)$ を距離空間, $x \\subset X$ とする.
             <ol>
                <li>$B \\subset X$ が点 $x$ の $\\varepsilon$ 近傍$B(x;\\varepsilon)$</li>
                <li>$O \\subset X$ が開集合</li>
                <li>$F \\subset X$ が閉集合</li>
                <li>$U \\subset X$ が点 $x$ の近傍</li>
                <li>点 $x$ に対し $\\mathcal{N}(x)$ を $x$ の近傍系とする.このとき $\\mathcal{B}(x) \\subset \\mathcal{N}(x)$ が $x$ の基本近傍系</li>
                <li>$x$ が $A$ の内点</li>
                <li>$x$ が $A$ の外点</li>
                <li>$x$ が $A$ の境界点</li>
                <li>$x$ が $A$ の集積点</li>
                <li>$x$ が $A$ の孤立点</li>
             </ol>
        `,
             answer: `
             <ol>
                <li>$B(x;\\varepsilon)=\\{y \\in X|d(x,y)<\\varepsilon\\}$</li>
                <li>$O$ の任意の点が内点</li>
                <li>$F$ の補集合が開集合</li>
                <li>$x$ が $U$ の内点である</li>
                <li>任意の $N \\in \\mathcal{N}(x)$ に対しある $B \\in \\mathcal{B}(x)$ が存在して $x \\in B \\subset N$</li>
                <li>ある $\\varepsilon>0$ が存在して $B(x;\\varepsilon) \\subset A$</li>
                <li>任意の $\\varepsilon>0$ について $B(x;\\varepsilon) \\cap A^c = \\emptyset$</li>
                <li>任意の $\\varepsilon>0$ について $B(x;\\varepsilon) \\cap A^c = \\emptyset,~B(x;\\varepsilon) \\cap A = \\emptyset$</li>
                <li>ある数列 $\\{a_n\\}_n \\subset A \\setminus \\{x\\}$ が存在して $a_n \\to x$ をみたすとき</li>
                <li>$x$ が $A$ の集積点でない</li>
             </ol>
        `,
             tags: ["距離空間"]
        },
        {
            question: "距離空間 $(X,d)$ の点列 $\\{x_n\\}_n$ が点 $a \\in X$ に収束することの定義を述べよ.",
            answer: "任意の $\\varepsilon>0$ に対してある $N \\in \\mathbb{N}$ が存在して, $n \\geq N$ ならば$d(x_n,a)<\\varepsilon.$",
            tags: ["距離空間"]
        }
        
        // 他の問題をここに追加できます
        // {
        //     question: "新しい問題のLaTeX記法",
        //     answer: "新しい解答のLaTeX記法",
        //     tags: ["新しいタグ", "複数タグ"]
        // }
    ];

    let currentProblems = []; // 現在出題される問題のリスト
    let unsolvedProblems = []; // わからなかった問題のリスト (5問モード用)
    let currentIndex = 0; // 現在の問題のインデックス
    let selectedTag = "all"; // 選択されたタグ (初期値は"all"で全ての分野)
    let quizMode = "all"; // 出題形式 (初期値は"all"で全問出題)

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

    const tagSelectionDiv = document.getElementById('tagSelection');
    const tagSelect = document.getElementById('tagSelect');
    const startQuizBtn = document.getElementById('startQuizBtn');
    const viewListBtn = document.getElementById('viewListBtn');

    const quizModeRadios = document.querySelectorAll('input[name="quizMode"]'); // 新規

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

        // 既存のオプションをクリア（「全ての分野」以外）
        while (tagSelect.options.length > 1) { // 最初のオプション（「全ての分野」）は残す
            tagSelect.remove(1);
        }

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
            if (quizMode === "5" && unsolvedProblems.length > 0) {
                // 5問モードで、わからなかった問題があれば、それを再度出題
                alert(`5問中、${unsolvedProblems.length}問が未解決です。もう一度出題します。`);
                currentProblems = shuffleArray([...unsolvedProblems]); // コピーしてシャッフル
                unsolvedProblems = []; // リセット
                currentIndex = 0;
                displayNextProblem();
            } else {
                // 全ての問題を解き終えた場合 (または全問モードで終了)
                flashcardDiv.style.display = 'none';
                completionMessageDiv.style.display = 'block';
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
            returnToTagSelection(); // タグ選択画面に戻る
            return; // クイズ開始を中止
        }

        // 5問モードの場合の処理
        if (quizMode === "5") {
            if (filteredProblems.length <= 5) {
                // 5問未満なら全て出題
                currentProblems = shuffleArray([...filteredProblems]);
                alert(`「${selectedTag}」には${filteredProblems.length}問しかありません。全ての${filteredProblems.length}問を出題します。`);
            } else {
                // 5問ランダムに抽選
                const shuffledFilteredProblems = shuffleArray([...filteredProblems]);
                currentProblems = shuffledFilteredProblems.slice(0, 5);
            }
            unsolvedProblems = []; // 5問モードでは未解決問題リストをリセット
        } else {
            // 全問モードの場合
            currentProblems = shuffleArray([...filteredProblems]);
        }

        currentIndex = 0;

        tagSelectionDiv.style.display = 'none'; // タグ選択画面を非表示に
        flashcardDiv.style.display = 'block';   // フラッシュカードを表示
        completionMessageDiv.style.display = 'none';
        displayNextProblem();
    }

    // タグ選択画面に戻る共通関数
    function returnToTagSelection() {
        tagSelectionDiv.style.display = 'block';
        flashcardDiv.style.display = 'none';
        completionMessageDiv.style.display = 'none';
        tagSelect.value = "all"; // 選択をリセット
        selectedTag = "all";
        // ラジオボタンもデフォルトに戻す
        document.getElementById('modeAll').checked = true;
        quizMode = "all";
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
        // 5問モードの場合のみ未解決リストに追加
        if (quizMode === "5") {
            unsolvedProblems.push(currentProblems[currentIndex]);
        }
        currentIndex++;
        displayNextProblem();
    });

    restartBtn.addEventListener('click', () => {
        returnToTagSelection();
    });

    // 新規イベントリスナー
    tagSelect.addEventListener('change', (event) => {
        selectedTag = event.target.value;
    });

    // ラジオボタンの変更を監視
    quizModeRadios.forEach(radio => {
        radio.addEventListener('change', (event) => {
            quizMode = event.target.value;
        });
    });

    startQuizBtn.addEventListener('click', () => {
        initializeQuiz();
    });

    viewListBtn.addEventListener('click', () => {
        const url = `tag_list.html?tag=${encodeURIComponent(selectedTag)}`;
        location.href = url;
    });

    // アプリケーション起動時にタグ選択オプションを生成し、タグ選択画面を表示
    populateTagSelect();
    tagSelectionDiv.style.display = 'block'; // 初期表示はタグ選択画面
    flashcardDiv.style.display = 'none'; // フラッシュカードは初期非表示
});