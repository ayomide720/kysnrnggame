// ===== AUTO SPIN SYSTEM =====
let autoSpinActive = false;
let autoSpinInterval = null;
let autoSpinSpeed = 1000; // milliseconds between spins

function toggleAutoSpin() {
  const btn = document.getElementById("auto-spin-btn");
  const rateDisplay = document.getElementById("auto-spin-rate");
  
  autoSpinActive = !autoSpinActive;
  
  if (autoSpinActive) {
    // Start auto spinning
    btn.textContent = "Auto Spin: ON";
    btn.style.backgroundColor = "#27ae60";
    rateDisplay.textContent = `Auto Spin Rate: ${(1000 / autoSpinSpeed).toFixed(1)} spins/sec`;
    
    autoSpinInterval = setInterval(() => {
      const spinBtn = document.getElementById("spin-btn");
      if (spinBtn) {
        // Trigger multiple ways to ensure click works
        spinBtn.click();
        spinBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      }
    }, autoSpinSpeed);
    
    showNotification("Auto Spin Started!", "#27ae60", 1500);
  } else {
    // Stop auto spinning
    btn.textContent = "Auto Spin: OFF";
    btn.style.backgroundColor = "#111";
    rateDisplay.textContent = "Auto Spin Rate: OFF";
    clearInterval(autoSpinInterval);
    autoSpinInterval = null;
    
    showNotification("Auto Spin Stopped!", "#ff6b6b", 1500);
  }
  
  saveGame();
}

function updateAutoSpinSpeed(newSpeed) {
  autoSpinSpeed = newSpeed;
  
  // Restart interval with new speed if active
  if (autoSpinActive) {
    clearInterval(autoSpinInterval);
    autoSpinInterval = setInterval(() => {
      const spinBtn = document.getElementById("spin-btn");
      if (spinBtn) {
        spinBtn.click();
        spinBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      }
    }, autoSpinSpeed);
    
    const rateDisplay = document.getElementById("auto-spin-rate");
    rateDisplay.textContent = `Auto Spin Rate: ${(1000 / autoSpinSpeed).toFixed(1)} spins/sec`;
  }
  
  saveGame();
}

// Attach event listener to auto spin button
document.getElementById("auto-spin-btn").addEventListener("click", toggleAutoSpin);
