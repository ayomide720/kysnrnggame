/**
 * ===== SKILL TREE MODULE =====
 * Tree-based upgrade system with branching paths
 */

const SkillTree = (() => {
  // Skill tree configuration
  const TREE = {
    // Luck Branch
    luckStrike: {
      name: 'Luck Strike',
      icon: '⭐',
      description: 'Boost base luck by +10%',
      baseCost: 10000,
      costMultiplier: 1.15,
      stateKey: 'luckUpgradeLevel',
      maxLevel: 20,
      category: 'luck',
      requires: null,
    },
    luckDouble: {
      name: 'Luck Doubled',
      icon: '✨',
      description: 'Double luck bonus effectiveness',
      baseCost: 50000,
      costMultiplier: 1.2,
      stateKey: 'luckDoubledLevel',
      maxLevel: 5,
      category: 'luck',
      requires: { skill: 'luckStrike', level: 5 },
    },
    luckTriple: {
      name: 'Lucky Jackpot',
      icon: '🎰',
      description: 'Triple luck bonus effectiveness',
      baseCost: 200000,
      costMultiplier: 1.25,
      stateKey: 'luckTripleLevel',
      maxLevel: 3,
      category: 'luck',
      requires: { skill: 'luckDouble', level: 3 },
    },

    // Speed Branch
    speedStrike: {
      name: 'Speed Boost',
      icon: '⚡',
      description: 'Reduce spin time by 10%',
      baseCost: 5000,
      costMultiplier: 1.15,
      stateKey: 'speedUpgradeLevel',
      maxLevel: 20,
      category: 'speed',
      requires: null,
    },
    speedHaste: {
      name: 'Haste Mode',
      icon: '🔥',
      description: 'Speed doubled effectiveness',
      baseCost: 40000,
      costMultiplier: 1.2,
      stateKey: 'hasteLevel',
      maxLevel: 5,
      category: 'speed',
      requires: { skill: 'speedStrike', level: 5 },
    },
    speedLightning: {
      name: 'Lightning Fast',
      icon: '⚔️',
      description: 'Triple speed effectiveness',
      baseCost: 180000,
      costMultiplier: 1.25,
      stateKey: 'lightningLevel',
      maxLevel: 3,
      category: 'speed',
      requires: { skill: 'speedHaste', level: 3 },
    },

    // Money Branch
    moneyFind: {
      name: 'Fortune Finder',
      icon: '💰',
      description: '+50% spin rewards',
      baseCost: 15000,
      costMultiplier: 1.15,
      stateKey: 'moneyFindLevel',
      maxLevel: 15,
      category: 'money',
      requires: null,
    },
    moneyMultiplier: {
      name: 'Gold Rush',
      icon: '🏆',
      description: 'Double money rewards',
      baseCost: 60000,
      costMultiplier: 1.2,
      stateKey: 'goldRushLevel',
      maxLevel: 5,
      category: 'money',
      requires: { skill: 'moneyFind', level: 5 },
    },
  };

  /**
   * Calculate upgrade cost
   */
  function calculateCost(skillKey) {
    const skill = TREE[skillKey];
    const level = GameState.get(skill.stateKey) || 0;
    return Math.floor(skill.baseCost * Math.pow(skill.costMultiplier, level));
  }

  /**
   * Check if skill is unlocked
   */
  function isUnlocked(skillKey) {
    const skill = TREE[skillKey];
    if (!skill.requires) return true;

    const requiredLevel = GameState.get(TREE[skill.requires.skill].stateKey) || 0;
    return requiredLevel >= skill.requires.level;
  }

  /**
   * Check if can purchase skill
   */
  function canPurchase(skillKey) {
    const skill = TREE[skillKey];
    const currentLevel = GameState.get(skill.stateKey) || 0;
    const money = GameState.get('money');
    const cost = calculateCost(skillKey);

    return money >= cost && currentLevel < skill.maxLevel;
  }

  /**
   * Purchase a skill
   */
  function purchaseSkill(skillKey) {
    const skill = TREE[skillKey];
    const cost = calculateCost(skillKey);
    const money = GameState.get('money');

    if (!canPurchase(skillKey)) {
      showNotification('Cannot purchase skill!', '#ff6b6b', 1500);
      return false;
    }

    GameState.set('money', money - cost);

    const currentLevel = GameState.get(skill.stateKey) || 0;
    GameState.set(skill.stateKey, currentLevel + 1);

    showNotification(`${skill.name} Upgraded! ${skill.icon}`, '#27ae60', 1500);
    SkillTree.updateTreeDisplay();
    GameLogic.updateUI();

    return true;
  }

  /**
   * Update tree display
   */
  function updateTreeDisplay() {
    const treeContainer = getElement('skill-tree-container');
    if (!treeContainer) return;

    let html = `
      <div class="skill-tree">
        <!-- Luck Branch -->
        <div class="skill-branch">
          <h4>💫 Luck Branch</h4>
          <div class="skill-nodes">
    `;

    // Render luck skills
    ['luckStrike', 'luckDouble', 'luckTriple'].forEach(skillKey => {
      const skill = TREE[skillKey];
      const level = GameState.get(skill.stateKey) || 0;
      const cost = calculateCost(skillKey);
      const unlocked = isUnlocked(skillKey);
      const canBuy = canPurchase(skillKey);

      html += `
        <div class="skill-node ${!unlocked ? 'locked' : ''} ${level >= skill.maxLevel ? 'maxed' : ''}">
          <div class="skill-icon">${skill.icon}</div>
          <div class="skill-name">${skill.name}</div>
          <div class="skill-level">Lvl ${level}/${skill.maxLevel}</div>
          <div class="skill-cost">${!unlocked ? '🔒' : canBuy ? `💰${cost.toLocaleString()}` : 'MAX'}</div>
          <button class="skill-btn ${!canBuy ? 'disabled' : ''}" onclick="SkillTree.purchaseSkill('${skillKey}')" ${!canBuy ? 'disabled' : ''}>
            ${!unlocked ? 'Locked' : level >= skill.maxLevel ? 'Maxed' : 'Unlock'}
          </button>
          <small>${skill.description}</small>
        </div>
      `;
    });

    html += `
          </div>
        </div>

        <!-- Speed Branch -->
        <div class="skill-branch">
          <h4>⚡ Speed Branch</h4>
          <div class="skill-nodes">
    `;

    // Render speed skills
    ['speedStrike', 'speedHaste', 'speedLightning'].forEach(skillKey => {
      const skill = TREE[skillKey];
      const level = GameState.get(skill.stateKey) || 0;
      const cost = calculateCost(skillKey);
      const unlocked = isUnlocked(skillKey);
      const canBuy = canPurchase(skillKey);

      html += `
        <div class="skill-node ${!unlocked ? 'locked' : ''} ${level >= skill.maxLevel ? 'maxed' : ''}">
          <div class="skill-icon">${skill.icon}</div>
          <div class="skill-name">${skill.name}</div>
          <div class="skill-level">Lvl ${level}/${skill.maxLevel}</div>
          <div class="skill-cost">${!unlocked ? '🔒' : canBuy ? `💰${cost.toLocaleString()}` : 'MAX'}</div>
          <button class="skill-btn ${!canBuy ? 'disabled' : ''}" onclick="SkillTree.purchaseSkill('${skillKey}')" ${!canBuy ? 'disabled' : ''}>
            ${!unlocked ? 'Locked' : level >= skill.maxLevel ? 'Maxed' : 'Unlock'}
          </button>
          <small>${skill.description}</small>
        </div>
      `;
    });

    html += `
          </div>
        </div>

        <!-- Money Branch -->
        <div class="skill-branch">
          <h4>💎 Money Branch</h4>
          <div class="skill-nodes">
    `;

    // Render money skills
    ['moneyFind', 'moneyMultiplier'].forEach(skillKey => {
      const skill = TREE[skillKey];
      const level = GameState.get(skill.stateKey) || 0;
      const cost = calculateCost(skillKey);
      const unlocked = isUnlocked(skillKey);
      const canBuy = canPurchase(skillKey);

      html += `
        <div class="skill-node ${!unlocked ? 'locked' : ''} ${level >= skill.maxLevel ? 'maxed' : ''}">
          <div class="skill-icon">${skill.icon}</div>
          <div class="skill-name">${skill.name}</div>
          <div class="skill-level">Lvl ${level}/${skill.maxLevel}</div>
          <div class="skill-cost">${!unlocked ? '🔒' : canBuy ? `💰${cost.toLocaleString()}` : 'MAX'}</div>
          <button class="skill-btn ${!canBuy ? 'disabled' : ''}" onclick="SkillTree.purchaseSkill('${skillKey}')" ${!canBuy ? 'disabled' : ''}>
            ${!unlocked ? 'Locked' : level >= skill.maxLevel ? 'Maxed' : 'Unlock'}
          </button>
          <small>${skill.description}</small>
        </div>
      `;
    });

    html += `
          </div>
        </div>
      </div>
    `;

    treeContainer.innerHTML = html;
  }

  /**
   * Get effective luck multiplier
   */
  function getLuckMultiplier() {
    const base = GameState.get('luckUpgradeLevel') || 0;
    const doubled = GameState.get('luckDoubledLevel') || 0;
    const tripled = GameState.get('luckTripleLevel') || 0;

    let multiplier = 1 + (base * 0.1);
    if (doubled > 0) multiplier *= 2;
    if (tripled > 0) multiplier *= 3;

    return multiplier;
  }

  /**
   * Get effective speed multiplier
   */
  function getSpeedMultiplier() {
    const base = GameState.get('speedUpgradeLevel') || 0;
    const haste = GameState.get('hasteLevel') || 0;
    const lightning = GameState.get('lightningLevel') || 0;

    let multiplier = 1 - (base * 0.1);
    if (haste > 0) multiplier *= 0.5;
    if (lightning > 0) multiplier *= 0.33;

    return Math.max(0.1, multiplier);
  }

  /**
   * Get effective money multiplier
   */
  function getMoneyMultiplier() {
    const find = GameState.get('moneyFindLevel') || 0;
    const gold = GameState.get('goldRushLevel') || 0;

    let multiplier = 1 + (find * 0.05);
    if (gold > 0) multiplier *= (1 + gold * 0.2);

    return multiplier;
  }

  return {
    TREE,
    calculateCost,
    isUnlocked,
    canPurchase,
    purchaseSkill,
    updateTreeDisplay,
    getLuckMultiplier,
    getSpeedMultiplier,
    getMoneyMultiplier,
  };
})();
