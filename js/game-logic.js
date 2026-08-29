/**
 * ===== GAME LOGIC MODULE =====
 * Core spin mechanics, upgrades, and game logic
 */

const GameLogic = (() => {
  // Game configuration
  const CONFIG = {
    rarities: [
      'Common',
      'Uncommon',
      'Rare',
      'Epic',
      'Legendary',
      'Mythic',
      'Steelbone',
      'Ancient',
      'Celestial',
      'Astral',
      'Glitched',
      'Primordial',
      'Ethereal',
      'Reality-Bound',
      'Genesis',
      'Entity-Beyond-Time',
    ],
    baseProbabilities: {
      Common: 0.4,
      Uncommon: 0.25,
      Rare: 0.15,
      Epic: 0.1,
      Legendary: 0.06,
      Mythic: 0.03,
      Steelbone: 0.008,
      Ancient: 0.002,
      Celestial: 0.001,
      Astral: 0.0005,
      Glitched: 0.0003,
      Primordial: 0.0002,
      Ethereal: 0.0001,
      'Reality-Bound': 0.00005,
      Genesis: 0.00001,
      'Entity-Beyond-Time': 0.000001,
    },
  };

  /**
 * Calculate total luck bonus including skill tree multipliers
 */
function getLuckBonus() {
  const baseBonus = GameState.get('luckUpgradeLevel') * 10;
  const treeMultiplier = SkillTree.getLuckMultiplier(); //[cite: 1]
  
  return baseBonus * treeMultiplier;
}
/**
   * Perform a single spin calculation based on probability and luck
   */
  function performSpin() {
    const luckBonus = getLuckBonus() / 100;
    const rarities = CONFIG.rarities;
    const probabilities = CONFIG.baseProbabilities;

    // Calculate total weight with luck factor
    let totalWeight = 0;
    const weightedProbabilities = {};

    for (const rarity of rarities) {
      let weight = probabilities[rarity];
      if (rarity !== 'Common') {
        weight *= (1 + luckBonus);
      }
      weightedProbabilities[rarity] = weight;
      totalWeight += weight;
    }

    // Roll a random number
    let roll = Math.random() * totalWeight;

    // Determine pulled rarity
    for (const rarity of rarities) {
      roll -= weightedProbabilities[rarity];
      if (roll <= 0) {
        return rarity;
      }
    }

    return rarities[0];
  }
/**
 * Execute a spin and update game state
 */
function spin() {
  const result = performSpin();

  GameState.incrementSpins();
  GameState.addToInventory(result);
  
  // Apply money multiplier from SkillTree[cite: 1]
  const baseReward = Math.floor(Math.random() * 100) + 10;
  const finalReward = Math.floor(baseReward * SkillTree.getMoneyMultiplier()); //[cite: 1]
  GameState.addMoney(finalReward);

  // Update rarest pull
  const currentRarest = GameState.get('rarest');
  if (
    currentRarest === 'N/A' ||
    CONFIG.rarities.indexOf(result) > CONFIG.rarities.indexOf(currentRarest)
  ) {
    GameState.setRarest(result);
  }

  updateUI();
  return result;
}

  /**
   * Update UI elements with current game state
   */
  function updateUI() {
    const state = GameState.getAll();

    // Update stats
    const resultEl = getElement('result');
    if (resultEl) {
      const inventory = state.inventory;
      const lastRarity = Object.keys(inventory).sort(
        (a, b) => (inventory[b] || 0) - (inventory[a] || 0)
      )[0];
      resultEl.innerHTML = `<span class="rarity-${lastRarity?.replace(/ /g, '-')}">${lastRarity || 'No pull yet'}</span>`;
    }

    const moneyEl = getElement('money');
    if (moneyEl) moneyEl.textContent = `Money: ${state.money.toLocaleString()}`;

    const statsEl = getElement('stats');
    if (statsEl) {
      statsEl.innerHTML = `Total Spins: ${state.totalSpins}<br />Rarest Pull: <span class="rarity-${state.rarest?.replace(/ /g, '-')}">${state.rarest}</span>`;
    }

    const luckEl = getElement('luck');
    if (luckEl) {
      luckEl.textContent = `Luck Bonus from Gears: ${getLuckBonus()}%`;
    }

    // Update upgrade UI
    const luckLevelEl = getElement('luck-upgrade-level');
    if (luckLevelEl) luckLevelEl.textContent = state.luckUpgradeLevel;

    const spinSpeedLevelEl = getElement('spin-speed-upgrade-level');
    if (spinSpeedLevelEl) spinSpeedLevelEl.textContent = state.spinSpeedUpgradeLevel;

    // Update inventory display
    updateInventoryDisplay();
  }

  /**
   * Update the rarity inventory display
   */
  function updateInventoryDisplay() {
    const inventory = GameState.get('inventory');
    const rarityCountsEl = getElement('rarity-counts');

    if (!rarityCountsEl) return;

    if (Object.keys(inventory).length === 0) {
      rarityCountsEl.textContent = 'Nothing pulled yet.';
      return;
    }

    let html = '';
    for (const [rarity, count] of Object.entries(inventory).sort(
      (a, b) => b[1] - a[1]
    )) {
      html += `<div><span class="rarity-${rarity.replace(/ /g, '-')}">${rarity}</span>: ${count}</div>`;
    }

    rarityCountsEl.innerHTML = html;
  }

  /**
   * Buy luck upgrade
   * @returns {boolean} Whether purchase was successful
   */
  function buyLuckUpgrade() {
    const cost = 10000 * Math.pow(1.15, GameState.get('luckUpgradeLevel'));
    const money = GameState.get('money');

    if (money < cost) {
      showNotification('Not enough money!', '#ff6b6b', 1500);
      return false;
    }

    GameState.set('money', money - cost);
    GameState.upgradeLuck();
    showNotification('Luck Upgrade Purchased!', '#27ae60', 1500);
    updateUI();
    return true;
  }

  /**
   * Buy spin speed upgrade
   * @returns {boolean} Whether purchase was successful
   */
  function buySpinSpeedUpgrade() {
    const cost = 5000 * Math.pow(1.15, GameState.get('spinSpeedUpgradeLevel'));
    const money = GameState.get('money');

    if (money < cost) {
      showNotification('Not enough money!', '#ff6b6b', 1500);
      return false;
    }

    GameState.set('money', money - cost);
    GameState.upgradeSpinSpeed();

    // Reduce auto spin speed by 10%
    const currentSpeed = GameState.get('autoSpinSpeed');
    const newSpeed = Math.max(100, currentSpeed * 0.9);
    GameState.setAutoSpinSpeed(newSpeed);

    showNotification('Spin Speed Upgrade Purchased!', '#27ae60', 1500);
    updateUI();
    return true;
  }

  return {
    spin,
    performSpin,
    getLuckBonus,
    updateUI,
    updateInventoryDisplay,
    buyLuckUpgrade,
    buySpinSpeedUpgrade,
    CONFIG,
  };
})();
