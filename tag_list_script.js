document.addEventListener('DOMContentLoaded', () => {
    // 問題と解答のデータ (flashcardscript.jsと内容を同一にする)
    // この配列は、tag_list_script.jsが単独で動作するために必要です。
    // もし大規模なアプリにするなら、外部JSONファイルから読み込むなどの方法を検討してください。
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


    const problemListDiv = document.getElementById('problemList');
    const listTitle = document.getElementById('listTitle');

    // URLからタグ名を取得
    const urlParams = new URLSearchParams(window.location.search);
    const tag = urlParams.get('tag');

    let filteredProblems = [];

    if (tag && tag !== "all") {
        filteredProblems = problems.filter(problem => problem.tags.includes(tag));
        listTitle.textContent = `「${tag}」の問題一覧`;
    } else {
        filteredProblems = problems;
        listTitle.textContent = "全ての分野の問題一覧";
    }

    if (filteredProblems.length === 0) {
        problemListDiv.innerHTML = `<p>選択されたタグ「${tag}」に問題がありません。</p>`;
    } else {
        filteredProblems.forEach((problem, index) => {
            const problemItem = document.createElement('div');
            problemItem.classList.add('problem-item');

            const questionText = document.createElement('p');
            questionText.classList.add('problem-question-text');
            questionText.textContent = `問題 ${index + 1}: `;

            const questionSpan = document.createElement('span');
            questionSpan.classList.add('math-problem');
            questionSpan.innerHTML = problem.question;
            questionText.appendChild(questionSpan);
            problemItem.appendChild(questionText);

            const tagDisplay = document.createElement('span');
            tagDisplay.classList.add('tag-display');
            problem.tags.forEach(t => {
                const tagBadge = document.createElement('span');
                tagBadge.classList.add('tag-badge');
                tagBadge.textContent = t;
                tagDisplay.appendChild(tagBadge);
            });
            problemItem.appendChild(tagDisplay);


            const accordion = document.createElement('div');
            accordion.classList.add('accordion');

            const accordionHeader = document.createElement('button');
            accordionHeader.classList.add('accordion-header');
            accordionHeader.textContent = '解答を見る';
            accordion.appendChild(accordionHeader);

            const accordionContent = document.createElement('div');
            accordionContent.classList.add('accordion-content');
            const answerDiv = document.createElement('div');
            answerDiv.classList.add('math-solution');
            answerDiv.innerHTML = problem.answer;
            accordionContent.appendChild(answerDiv);
            accordion.appendChild(accordionContent);

            problemItem.appendChild(accordion);
            problemListDiv.appendChild(problemItem);

            // アコーディオンの開閉機能
            accordionHeader.addEventListener('click', () => {
                accordionContent.classList.toggle('active');
                if (accordionContent.classList.contains('active')) {
                    accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";
                } else {
                    accordionContent.style.maxHeight = null;
                }
                // MathJaxの再レンダリング (アコーディオン展開時に必要)
                if (window.MathJax) {
                    window.MathJax.typesetPromise([answerDiv]).catch((err) => console.error("MathJax typesetting failed:", err));
                }
            });
        });

        // 全ての問題が描画された後にMathJaxをレンダリング
        if (window.MathJax) {
            window.MathJax.typesetPromise().catch((err) => console.error("Initial MathJax typesetting failed:", err));
        }
    }
});