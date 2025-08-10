// --- ゲーム全体の状態管理 ---
let money = 0;
let isPaused = false;
let gameLoopIntervals = { coin: null, dice: null };
let prestigePoints = 0;
const prestigeRequirement = 1000000;

let prestigeUpgrades = {
    incomeMultiplier: { level: 0, cost: 1, effectBase: 1.1 }
};
let globalIncomeMultiplier = 1;

let models = {
    coin: {
        perSecond: 0, reward: 1, baseIntervalMs: 1000, probability: 0.5,
        upgrades: { speed: { cost: 25 }, reward: { cost: 40 }, frequency: { cost: 100 }, probability: { cost: 1000 } }
    },
    dice: {
        unlocked: false, unlockCost: 500, perSecond: 0, rewardMultiplier: 1, baseIntervalMs: 1000, sides: 6,
        upgrades: { automate: { cost: 50 }, speed: { cost: 100 }, reward: { cost: 200 }, frequency: { cost: 500 }, sides: { cost: 2000 } }
    }
};

let missions = [
    { id: 1, description: "所持金を100円にする", rewardDescription: "50円", condition: () => money >= 100, reward: () => { money += 50; }, isCompleted: false },
    { id: 2, description: "コインの速度を5にする", rewardDescription: "コインの基礎報酬+1", condition: () => models.coin.perSecond >= 5, reward: () => { models.coin.reward++; alert("ミッション達成！コインの基礎報酬が1上がった！"); }, isCompleted: false },
    { id: 3, description: "サイコロモデルをアンロックする", rewardDescription: "1000円", condition: () => models.dice.unlocked, reward: () => { money += 1000; }, isCompleted: false }
];
const initialModelsState = JSON.parse(JSON.stringify(models));
const initialMissionsState = JSON.parse(JSON.stringify(missions));

// --- HTML要素の取得 ---
const moneyDisplay = document.getElementById('money-display');
const pauseResumeButton = document.getElementById('pause-resume-button');
const debugMoneyInput = document.getElementById('debug-money-input');
const addMoneyButton = document.getElementById('add-money-button');
const resetSaveButton = document.getElementById('reset-save-button');
const coinResultDisplay = document.getElementById('coin-result-display');
const coinSpeedDisplay = document.getElementById('coin-speed-display');
const coinRewardDisplay = document.getElementById('coin-reward-display');
const cycleTimeDisplay = document.getElementById('cycle-time-display');
const coinProbabilityDisplay = document.getElementById('coin-probability-display');
const upgradeCostDisplay = document.getElementById('upgrade-cost-display');
const rewardUpgradeCostDisplay = document.getElementById('reward-upgrade-cost-display');
const frequencyUpgradeCostDisplay = document.getElementById('frequency-upgrade-cost-display');
const probabilityUpgradeCostDisplay = document.getElementById('probability-upgrade-cost-display');
const flipCoinButton = document.getElementById('flip-coin-button');
const automateCoinButton = document.getElementById('automate-coin-button');
const upgradeSpeedButton = document.getElementById('upgrade-speed-button');
const upgradeRewardButton = document.getElementById('upgrade-reward-button');
const upgradeFrequencyButton = document.getElementById('upgrade-frequency-button');
const upgradeProbabilityButton = document.getElementById('upgrade-probability-button');
const diceUnlockSection = document.getElementById('dice-unlock-section');
const diceMainSection = document.getElementById('dice-main-section');
const diceUnlockButton = document.getElementById('unlock-dice-button');
const diceUnlockCostDisplay = document.getElementById('dice-unlock-cost');
const diceResultDisplay = document.getElementById('dice-result-display');
const diceSpeedDisplay = document.getElementById('dice-speed-display');
const diceRewardDisplay = document.getElementById('dice-reward-display');
const diceCycleTimeDisplay = document.getElementById('dice-cycle-time-display');
const diceSidesDisplay = document.getElementById('dice-sides-display');
const rollDiceButton = document.getElementById('roll-dice-button');
const automateDiceButton = document.getElementById('automate-dice-button');
const upgradeDiceSpeedButton = document.getElementById('upgrade-dice-speed-button');
const upgradeDiceRewardButton = document.getElementById('upgrade-dice-reward-button');
const upgradeDiceFrequencyButton = document.getElementById('upgrade-dice-frequency-button');
const upgradeDiceSidesButton = document.getElementById('upgrade-dice-sides-button');
const diceSpeedUpgradeCostDisplay = document.getElementById('dice-speed-upgrade-cost-display');
const diceRewardUpgradeCostDisplay = document.getElementById('dice-reward-upgrade-cost-display');
const diceFrequencyUpgradeCostDisplay = document.getElementById('dice-frequency-upgrade-cost-display');
const sidesUpgradeCostDisplay = document.getElementById('sides-upgrade-cost-display');
const pauseResumeButtonDice = document.getElementById('pause-resume-button-dice');
const missionList = document.getElementById('mission-list');
const coinIncomePerSecondDisplay = document.getElementById('coin-income-per-second');
const diceIncomePerSecondDisplay = document.getElementById('dice-income-per-second');
const upgradeSpeedButtonX10 = document.getElementById('upgrade-speed-button-x10');
const upgradeRewardButtonX10 = document.getElementById('upgrade-reward-button-x10');
const upgradeFrequencyButtonX10 = document.getElementById('upgrade-frequency-button-x10');
const upgradeProbabilityButtonX10 = document.getElementById('upgrade-probability-button-x10');
const upgradeDiceSpeedButtonX10 = document.getElementById('upgrade-dice-speed-button-x10');
const upgradeDiceRewardButtonX10 = document.getElementById('upgrade-dice-reward-button-x10');
const upgradeDiceFrequencyButtonX10 = document.getElementById('upgrade-dice-frequency-button-x10');
const upgradeDiceSidesButtonX10 = document.getElementById('upgrade-dice-sides-button-x10');
const upgradeSpeedCostX10 = document.getElementById('upgrade-speed-cost-x10');
const upgradeRewardCostX10 = document.getElementById('upgrade-reward-cost-x10');
const upgradeFrequencyCostX10 = document.getElementById('upgrade-frequency-cost-x10');
const upgradeProbabilityCostX10 = document.getElementById('upgrade-probability-cost-x10');
const upgradeDiceSpeedCostX10 = document.getElementById('upgrade-dice-speed-cost-x10');
const upgradeDiceRewardCostX10 = document.getElementById('upgrade-dice-reward-cost-x10');
const upgradeDiceFrequencyCostX10 = document.getElementById('upgrade-dice-frequency-cost-x10');
const sidesUpgradeCostX10 = document.getElementById('sides-upgrade-cost-x10');
const prestigeContainer = document.getElementById('prestige-container');
const prestigePointsDisplay = document.getElementById('prestige-points-display');
const prestigePointsOnReset = document.getElementById('prestige-points-on-reset');
const prestigeButton = document.getElementById('prestige-button');
const prestigeShopContainer = document.getElementById('prestige-shop-container');
const incomeMultiplierLevel = document.getElementById('income-multiplier-level');
const incomeMultiplierEffect = document.getElementById('income-multiplier-effect');
const incomeMultiplierCost = document.getElementById('income-multiplier-cost');
const buyIncomeMultiplierButton = document.getElementById('buy-income-multiplier');

// ... (既存のgetElementByIdの最後に追加)
const prestigePointsShopDisplay = document.getElementById('prestige-points-shop-display');

// --- セーブ＆ロード関数 ---
function saveGame() {
    const missionSaveData = missions.map(m => ({ id: m.id, isCompleted: m.isCompleted }));
    const gameState = {
        money: money,
        models: models,
        missions: missionSaveData, // 関数を含まない、達成状況だけのデータを保存
        prestigePoints: prestigePoints,
        prestigeUpgrades: prestigeUpgrades
    };
    localStorage.setItem('probabilityIdleGameSave', JSON.stringify(gameState));
    console.log("Game Saved!");
}
function loadGame() {
    const savedStateJSON = localStorage.getItem('probabilityIdleGameSave');
    if (savedStateJSON) {
        const savedState = JSON.parse(savedStateJSON);
        money = savedState.money || 0;
        if (savedState.models) Object.assign(models, savedState.models);
        if (savedState.prestigePoints) prestigePoints = savedState.prestigePoints;
        if (savedState.prestigeUpgrades) Object.assign(prestigeUpgrades, savedState.prestigeUpgrades);
        
        // ミッションは、保存された達成状況だけを現在のミッションリストに反映させる
        if (savedState.missions) {
            savedState.missions.forEach(savedMission => {
                const mission = missions.find(m => m.id === savedMission.id);
                if (mission) {
                    mission.isCompleted = savedMission.isCompleted;
                }
            });
        }
        console.log("Game Loaded!");
    }
}
// --- ミッション関連の関数 ---
function renderMissions() {
    missionList.innerHTML = '';
    const currentMission = missions.find(mission => !mission.isCompleted);
    const li = document.createElement('li');
    if (currentMission) {
        li.textContent = `${currentMission.description} (報酬: ${currentMission.rewardDescription})`;
    } else {
        li.textContent = "全てのミッションを達成しました！";
        li.classList.add('completed');
    }
    missionList.appendChild(li);
}
function checkMissions() {
    missions.forEach(mission => {
        if (!mission.isCompleted && mission.condition()) {
            mission.isCompleted = true;
            mission.reward();
            alert(`ミッション達成！\n「${mission.description}」\n報酬を獲得しました！`);
            renderMissions();
            saveGame();
        }
    });
}
// --- 主要な関数 ---
function calculatePrestigeBonuses() {
    const upgrade = prestigeUpgrades.incomeMultiplier;
    globalIncomeMultiplier = Math.pow(upgrade.effectBase, upgrade.level);
}
function flipCoin() {
    if (Math.random() < models.coin.probability) {
        const earnings = models.coin.reward * globalIncomeMultiplier;
        money += earnings;
        coinResultDisplay.textContent = `表！ ${Math.floor(earnings)}円獲得！`;
    } else {
        coinResultDisplay.textContent = '裏...！';
    }
}
function rollDice() {
    const roll = Math.floor(Math.random() * models.dice.sides) + 1;
    let earnings = roll * models.dice.rewardMultiplier;
    earnings *= globalIncomeMultiplier;
    money += earnings;
    diceResultDisplay.textContent = `${roll}の目！ ${Math.floor(earnings)}円獲得！`;
}
function prestige() {
    if (money < prestigeRequirement) return;
    if (confirm('本当にプレステージを実行しますか？\n所持金、アップグレード、ミッションの進捗が全てリセットされます。')) {
        const pointsToGain = Math.floor(Math.sqrt(money / prestigeRequirement));
        prestigePoints += pointsToGain;
        money = 0;
        models = JSON.parse(JSON.stringify(initialModelsState));
        missions = JSON.parse(JSON.stringify(initialMissionsState));
        saveGame();
        location.reload();
    }
}
function updateDisplay() {
    if (!moneyDisplay) return;
    moneyDisplay.textContent = Math.floor(money);
    const coin = models.coin;
    coinSpeedDisplay.textContent = coin.perSecond;
    coinRewardDisplay.textContent = coin.reward;
    cycleTimeDisplay.textContent = (coin.baseIntervalMs / 1000).toFixed(2);
    coinProbabilityDisplay.textContent = (coin.probability * 100).toFixed(2);
    coinIncomePerSecondDisplay.textContent = (coin.perSecond * coin.reward * coin.probability * globalIncomeMultiplier).toFixed(2);
    if (coin.perSecond > 0) {
        automateCoinButton.style.display = 'none';
        pauseResumeButton.style.display = 'inline-block';
        upgradeSpeedButton.style.display = 'inline-block';
        upgradeSpeedButtonX10.style.display = 'inline-block';
        upgradeSpeedCostX10.style.display = 'inline';
        upgradeRewardButton.style.display = 'inline-block';
        upgradeRewardButtonX10.style.display = 'inline-block';
        upgradeRewardCostX10.style.display = 'inline';
        upgradeFrequencyButton.style.display = 'inline-block';
        upgradeFrequencyButtonX10.style.display = 'inline-block';
        upgradeFrequencyCostX10.style.display = 'inline';
        upgradeProbabilityButton.style.display = 'inline-block';
        upgradeProbabilityButtonX10.style.display = 'inline-block';
        upgradeProbabilityCostX10.style.display = 'inline';
    }
    let totalCost, currentCost;
    totalCost = 0; currentCost = coin.upgrades.speed.cost;
    for (let i = 0; i < 10; i++) { totalCost += currentCost; currentCost = Math.floor(currentCost * 1.5); }
    upgradeSpeedCostX10.textContent = ` (コスト: ${totalCost}円)`;
    upgradeSpeedButton.disabled = money < coin.upgrades.speed.cost;
    upgradeSpeedButton.classList.toggle('disabled', money < coin.upgrades.speed.cost);
    upgradeSpeedButtonX10.disabled = money < totalCost;
    upgradeSpeedButtonX10.classList.toggle('disabled', money < totalCost);
    upgradeCostDisplay.textContent = coin.upgrades.speed.cost;
    totalCost = 0; currentCost = coin.upgrades.reward.cost;
    for (let i = 0; i < 10; i++) { totalCost += currentCost; currentCost = Math.floor(currentCost * 1.8); }
    upgradeRewardCostX10.textContent = ` (コスト: ${totalCost}円)`;
    upgradeRewardButton.disabled = money < coin.upgrades.reward.cost;
    upgradeRewardButton.classList.toggle('disabled', money < coin.upgrades.reward.cost);
    upgradeRewardButtonX10.disabled = money < totalCost;
    upgradeRewardButtonX10.classList.toggle('disabled', money < totalCost);
    rewardUpgradeCostDisplay.textContent = coin.upgrades.reward.cost;
    totalCost = 0; currentCost = coin.upgrades.frequency.cost;
    for (let i = 0; i < 10; i++) { totalCost += currentCost; currentCost = Math.floor(currentCost * 2); }
    upgradeFrequencyCostX10.textContent = ` (コスト: ${totalCost}円)`;
    upgradeFrequencyButton.disabled = money < coin.upgrades.frequency.cost;
    upgradeFrequencyButton.classList.toggle('disabled', money < coin.upgrades.frequency.cost);
    upgradeFrequencyButtonX10.disabled = money < totalCost;
    upgradeFrequencyButtonX10.classList.toggle('disabled', money < totalCost);
    frequencyUpgradeCostDisplay.textContent = coin.upgrades.frequency.cost;
    totalCost = 0; currentCost = coin.upgrades.probability.cost;
    const canBuyProbability = coin.probability + 0.1 < 0.99;
    for (let i = 0; i < 10; i++) { totalCost += currentCost; currentCost = Math.floor(currentCost * 2.5); }
    upgradeProbabilityCostX10.textContent = ` (コスト: ${totalCost}円)`;
    upgradeProbabilityButton.disabled = money < coin.upgrades.probability.cost || coin.probability >= 0.99;
    upgradeProbabilityButton.classList.toggle('disabled', money < coin.upgrades.probability.cost || coin.probability >= 0.99);
    upgradeProbabilityButtonX10.disabled = money < totalCost || !canBuyProbability;
    upgradeProbabilityButtonX10.classList.toggle('disabled', money < totalCost || !canBuyProbability);
    probabilityUpgradeCostDisplay.textContent = coin.upgrades.probability.cost;
    const dice = models.dice;
    diceUnlockButton.disabled = money < dice.unlockCost;
    diceUnlockButton.classList.toggle('disabled', money < dice.unlockCost);
    diceUnlockCostDisplay.textContent = dice.unlockCost;
    if (dice.unlocked) {
        diceUnlockSection.style.display = 'none';
        diceMainSection.style.display = 'block';
        diceSpeedDisplay.textContent = dice.perSecond;
        diceRewardDisplay.textContent = dice.rewardMultiplier;
        diceCycleTimeDisplay.textContent = (dice.baseIntervalMs / 1000).toFixed(2);
        diceSidesDisplay.textContent = dice.sides;
        const averageRoll = (dice.sides + 1) / 2;
        diceIncomePerSecondDisplay.textContent = (dice.perSecond * averageRoll * dice.rewardMultiplier * globalIncomeMultiplier).toFixed(2);
        if (dice.perSecond > 0) {
            automateDiceButton.style.display = 'none';
            upgradeDiceSpeedButton.style.display = 'inline-block';
            upgradeDiceSpeedButtonX10.style.display = 'inline-block';
            upgradeDiceSpeedCostX10.style.display = 'inline';
            upgradeDiceRewardButton.style.display = 'inline-block';
            upgradeDiceRewardButtonX10.style.display = 'inline-block';
            upgradeDiceRewardCostX10.style.display = 'inline';
            upgradeDiceFrequencyButton.style.display = 'inline-block';
            upgradeDiceFrequencyButtonX10.style.display = 'inline-block';
            upgradeDiceFrequencyCostX10.style.display = 'inline';
            upgradeDiceSidesButton.style.display = 'inline-block';
            upgradeDiceSidesButtonX10.style.display = 'inline-block';
            sidesUpgradeCostX10.style.display = 'inline';
            pauseResumeButtonDice.style.display = 'inline-block';
        }
        automateDiceButton.disabled = money < dice.upgrades.automate.cost;
        automateDiceButton.classList.toggle('disabled', money < dice.upgrades.automate.cost);
        automateDiceButton.textContent = `自動化する (コスト: ${dice.upgrades.automate.cost}円)`;
        totalCost = 0; currentCost = dice.upgrades.speed.cost;
        for (let i = 0; i < 10; i++) { totalCost += currentCost; currentCost = Math.floor(currentCost * 1.5); }
        upgradeDiceSpeedCostX10.textContent = ` (コスト: ${totalCost}円)`;
        upgradeDiceSpeedButton.disabled = money < dice.upgrades.speed.cost;
        upgradeDiceSpeedButton.classList.toggle('disabled', money < dice.upgrades.speed.cost);
        upgradeDiceSpeedButtonX10.disabled = money < totalCost;
        upgradeDiceSpeedButtonX10.classList.toggle('disabled', money < totalCost);
        diceSpeedUpgradeCostDisplay.textContent = dice.upgrades.speed.cost;
        totalCost = 0; currentCost = dice.upgrades.reward.cost;
        for (let i = 0; i < 10; i++) { totalCost += currentCost; currentCost = Math.floor(currentCost * 1.8); }
        upgradeDiceRewardCostX10.textContent = ` (コスト: ${totalCost}円)`;
        upgradeDiceRewardButton.disabled = money < dice.upgrades.reward.cost;
        upgradeDiceRewardButton.classList.toggle('disabled', money < dice.upgrades.reward.cost);
        upgradeDiceRewardButtonX10.disabled = money < totalCost;
        upgradeDiceRewardButtonX10.classList.toggle('disabled', money < totalCost);
        diceRewardUpgradeCostDisplay.textContent = dice.upgrades.reward.cost;
        totalCost = 0; currentCost = dice.upgrades.frequency.cost;
        for (let i = 0; i < 10; i++) { totalCost += currentCost; currentCost = Math.floor(currentCost * 2); }
        upgradeDiceFrequencyCostX10.textContent = ` (コスト: ${totalCost}円)`;
        upgradeDiceFrequencyButton.disabled = money < dice.upgrades.frequency.cost;
        upgradeDiceFrequencyButton.classList.toggle('disabled', money < dice.upgrades.frequency.cost);
        upgradeDiceFrequencyButtonX10.disabled = money < totalCost;
        upgradeDiceFrequencyButtonX10.classList.toggle('disabled', money < totalCost);
        diceFrequencyUpgradeCostDisplay.textContent = dice.upgrades.frequency.cost;
        totalCost = 0; currentCost = dice.upgrades.sides.cost;
        for (let i = 0; i < 10; i++) { totalCost += currentCost; currentCost = Math.floor(currentCost * 3); }
        sidesUpgradeCostX10.textContent = ` (コスト: ${totalCost}円)`;
        upgradeDiceSidesButton.disabled = money < dice.upgrades.sides.cost;
        upgradeDiceSidesButton.classList.toggle('disabled', money < dice.upgrades.sides.cost);
        upgradeDiceSidesButtonX10.disabled = money < totalCost;
        upgradeDiceSidesButtonX10.classList.toggle('disabled', money < totalCost);
        sidesUpgradeCostDisplay.textContent = dice.upgrades.sides.cost;
    }
    prestigePointsDisplay.textContent = prestigePoints;
    if (money >= prestigeRequirement) {
        prestigeContainer.style.display = 'block';
        const pointsToGain = Math.floor(Math.sqrt(money / prestigeRequirement));
        prestigePointsOnReset.textContent = pointsToGain;
    }
    if (prestigePoints > 0) {
        prestigeShopContainer.style.display = 'block';
        prestigePointsShopDisplay.textContent = prestigePoints; // ★この行を追加
        const upgrade = prestigeUpgrades.incomeMultiplier;
        incomeMultiplierLevel.textContent = upgrade.level;
        incomeMultiplierEffect.textContent = ((globalIncomeMultiplier - 1) * 100).toFixed(0);
        incomeMultiplierCost.textContent = upgrade.cost;
        buyIncomeMultiplierButton.disabled = prestigePoints < upgrade.cost;
        buyIncomeMultiplierButton.classList.toggle('disabled', prestigePoints < upgrade.cost);
    }
}
function updateCoinGameLoop() {
    if (gameLoopIntervals.coin) clearInterval(gameLoopIntervals.coin);
    if (models.coin.perSecond > 0) {
        const interval = models.coin.baseIntervalMs / models.coin.perSecond;
        gameLoopIntervals.coin = setInterval(() => { if (!isPaused) { flipCoin(); } }, interval);
    }
}
function updateDiceGameLoop() {
    if (gameLoopIntervals.dice) clearInterval(gameLoopIntervals.dice);
    if (models.dice.perSecond > 0) {
        const interval = models.dice.baseIntervalMs / models.dice.perSecond;
        gameLoopIntervals.dice = setInterval(() => { if (!isPaused) { rollDice(); } }, interval);
    }
}
function togglePause() {
    isPaused = !isPaused;
    const buttonText = isPaused ? '再開' : '一時停止';
    pauseResumeButton.textContent = buttonText;
    pauseResumeButtonDice.textContent = buttonText;
}
// --- イベントリスナーエリア ---
flipCoinButton.addEventListener('click', () => { flipCoin(); updateDisplay(); });
automateCoinButton.addEventListener('click', () => {
    const cost = 10;
    if (money >= cost) {
        money -= cost;
        models.coin.perSecond++;
        updateDisplay();
        updateCoinGameLoop();
        saveGame();
    }
});
upgradeSpeedButton.addEventListener('click', () => {
    const cost = models.coin.upgrades.speed.cost;
    if (money >= cost) { money -= cost; models.coin.perSecond++; models.coin.upgrades.speed.cost = Math.floor(cost * 1.5); updateDisplay(); updateCoinGameLoop(); saveGame(); }
});
upgradeRewardButton.addEventListener('click', () => {
    const cost = models.coin.upgrades.reward.cost;
    if (money >= cost) { money -= cost; models.coin.reward++; models.coin.upgrades.reward.cost = Math.floor(cost * 1.8); updateDisplay(); saveGame(); }
});
upgradeFrequencyButton.addEventListener('click', () => {
    const cost = models.coin.upgrades.frequency.cost;
    if (money >= cost) { money -= cost; models.coin.baseIntervalMs *= 0.9; models.coin.upgrades.frequency.cost = Math.floor(cost * 2); updateDisplay(); updateCoinGameLoop(); saveGame(); }
});
upgradeProbabilityButton.addEventListener('click', () => {
    const cost = models.coin.upgrades.probability.cost;
    if (money >= cost && models.coin.probability < 0.99) {
        money -= cost;
        models.coin.probability += 0.01;
        models.coin.upgrades.probability.cost = Math.floor(cost * 2.5);
        updateDisplay();
        saveGame();
    }
});
diceUnlockButton.addEventListener('click', () => {
    const cost = models.dice.unlockCost;
    if (money >= cost) { money -= cost; models.dice.unlocked = true; updateDisplay(); saveGame(); }
});
rollDiceButton.addEventListener('click', () => { rollDice(); updateDisplay(); });
automateDiceButton.addEventListener('click', () => {
    const cost = models.dice.upgrades.automate.cost;
    if (money >= cost) {
        money -= cost;
        models.dice.perSecond++;
        updateDisplay();
        updateDiceGameLoop();
        saveGame();
    }
});
upgradeDiceSpeedButton.addEventListener('click', () => {
    const cost = models.dice.upgrades.speed.cost;
    if (money >= cost) { money -= cost; models.dice.perSecond++; models.dice.upgrades.speed.cost = Math.floor(cost * 1.5); updateDisplay(); updateDiceGameLoop(); saveGame(); }
});
upgradeDiceRewardButton.addEventListener('click', () => {
    const cost = models.dice.upgrades.reward.cost;
    if (money >= cost) { money -= cost; models.dice.rewardMultiplier++; models.dice.upgrades.reward.cost = Math.floor(cost * 1.8); updateDisplay(); saveGame(); }
});
upgradeDiceFrequencyButton.addEventListener('click', () => {
    const cost = models.dice.upgrades.frequency.cost;
    if (money >= cost) { money -= cost; models.dice.baseIntervalMs *= 0.9; models.dice.upgrades.frequency.cost = Math.floor(cost * 2); updateDisplay(); updateDiceGameLoop(); saveGame(); }
});
upgradeDiceSidesButton.addEventListener('click', () => {
    const cost = models.dice.upgrades.sides.cost;
    if (money >= cost) {
        money -= cost;
        models.dice.sides += 2;
        models.dice.upgrades.sides.cost = Math.floor(cost * 3);
        updateDisplay();
        saveGame();
    }
});
pauseResumeButton.addEventListener('click', togglePause);
pauseResumeButtonDice.addEventListener('click', togglePause);
addMoneyButton.addEventListener('click', () => {
    const amount = parseInt(debugMoneyInput.value, 10);
    if (!isNaN(amount) && amount > 0) { money += amount; updateDisplay(); }
    debugMoneyInput.value = '';
});
resetSaveButton.addEventListener('click', () => {
    if (confirm('本当にセーブデータをリセットしますか？')) { localStorage.removeItem('probabilityIdleGameSave'); location.reload(); }
});
prestigeButton.addEventListener('click', prestige);
buyIncomeMultiplierButton.addEventListener('click', () => {
    const upgrade = prestigeUpgrades.incomeMultiplier;
    if (prestigePoints >= upgrade.cost) {
        prestigePoints -= upgrade.cost;
        upgrade.level++;
        upgrade.cost++;
        calculatePrestigeBonuses();
        updateDisplay();
        saveGame();
    }
});
// --- x10ボタンのイベントリスナーエリア ---
upgradeSpeedButtonX10.addEventListener('click', () => {
    const quantity = 10;
    let totalCost = 0;
    let currentCost = models.coin.upgrades.speed.cost;
    for (let i = 0; i < quantity; i++) {
        totalCost += currentCost;
        currentCost = Math.floor(currentCost * 1.5);
    }
    if (money >= totalCost) {
        money -= totalCost;
        models.coin.perSecond += quantity;
        models.coin.upgrades.speed.cost = currentCost;
        updateDisplay();
        updateCoinGameLoop();
        saveGame();
    } else {
        alert('お金が足りません！');
    }
});
upgradeRewardButtonX10.addEventListener('click', () => {
    const quantity = 10;
    let totalCost = 0;
    let currentCost = models.coin.upgrades.reward.cost;
    for (let i = 0; i < quantity; i++) {
        totalCost += currentCost;
        currentCost = Math.floor(currentCost * 1.8);
    }
    if (money >= totalCost) {
        money -= totalCost;
        models.coin.reward += quantity;
        models.coin.upgrades.reward.cost = currentCost;
        updateDisplay();
        saveGame();
    } else {
        alert('お金が足りません！');
    }
});
upgradeFrequencyButtonX10.addEventListener('click', () => {
    const quantity = 10;
    let totalCost = 0;
    let currentCost = models.coin.upgrades.frequency.cost;
    for (let i = 0; i < quantity; i++) {
        totalCost += currentCost;
        currentCost = Math.floor(currentCost * 2);
    }
    if (money >= totalCost) {
        money -= totalCost;
        models.coin.baseIntervalMs *= Math.pow(0.9, quantity);
        models.coin.upgrades.frequency.cost = currentCost;
        updateDisplay();
        updateCoinGameLoop();
        saveGame();
    } else {
        alert('お金が足りません！');
    }
});
upgradeProbabilityButtonX10.addEventListener('click', () => {
    const quantity = 10;
    let totalCost = 0;
    let currentCost = models.coin.upgrades.probability.cost;
    if (models.coin.probability + (0.01 * quantity) >= 0.99) {
        alert('これ以上アップグレードできません。');
        return;
    }
    for (let i = 0; i < quantity; i++) {
        totalCost += currentCost;
        currentCost = Math.floor(currentCost * 2.5);
    }
    if (money >= totalCost) {
        money -= totalCost;
        models.coin.probability += 0.01 * quantity;
        models.coin.upgrades.probability.cost = currentCost;
        updateDisplay();
        saveGame();
    } else {
        alert('お金が足りません！');
    }
});
upgradeDiceSpeedButtonX10.addEventListener('click', () => {
    const quantity = 10;
    let totalCost = 0;
    let currentCost = models.dice.upgrades.speed.cost;
    for (let i = 0; i < quantity; i++) {
        totalCost += currentCost;
        currentCost = Math.floor(currentCost * 1.5);
    }
    if (money >= totalCost) {
        money -= totalCost;
        models.dice.perSecond += quantity;
        models.dice.upgrades.speed.cost = currentCost;
        updateDisplay();
        updateDiceGameLoop();
        saveGame();
    } else {
        alert('お金が足りません！');
    }
});
upgradeDiceRewardButtonX10.addEventListener('click', () => {
    const quantity = 10;
    let totalCost = 0;
    let currentCost = models.dice.upgrades.reward.cost;
    for (let i = 0; i < quantity; i++) {
        totalCost += currentCost;
        currentCost = Math.floor(currentCost * 1.8);
    }
    if (money >= totalCost) {
        money -= totalCost;
        models.dice.rewardMultiplier += quantity;
        models.dice.upgrades.reward.cost = currentCost;
        updateDisplay();
        saveGame();
    } else {
        alert('お金が足りません！');
    }
});
upgradeDiceFrequencyButtonX10.addEventListener('click', () => {
    const quantity = 10;
    let totalCost = 0;
    let currentCost = models.dice.upgrades.frequency.cost;
    for (let i = 0; i < quantity; i++) {
        totalCost += currentCost;
        currentCost = Math.floor(currentCost * 2);
    }
    if (money >= totalCost) {
        money -= totalCost;
        models.dice.baseIntervalMs *= Math.pow(0.9, quantity);
        models.dice.upgrades.frequency.cost = currentCost;
        updateDisplay();
        updateDiceGameLoop();
        saveGame();
    } else {
        alert('お金が足りません！');
    }
});
upgradeDiceSidesButtonX10.addEventListener('click', () => {
    const quantity = 10;
    let totalCost = 0;
    let currentCost = models.dice.upgrades.sides.cost;
    for (let i = 0; i < quantity; i++) {
        totalCost += currentCost;
        currentCost = Math.floor(currentCost * 3);
    }
    if (money >= totalCost) {
        money -= totalCost;
        models.dice.sides += 2 * quantity;
        models.dice.upgrades.sides.cost = currentCost;
        updateDisplay();
        saveGame();
    } else {
        alert('お金が足りません！');
    }
});
// --- メインゲームループ ---
setInterval(() => {
    if (!isPaused) {
        updateDisplay();
    }
}, 200);
setInterval(checkMissions, 2000);
// --- ゲーム起動処理 ---
loadGame();
calculatePrestigeBonuses();
updateDisplay();
renderMissions();
updateCoinGameLoop();
updateDiceGameLoop();
