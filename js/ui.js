/**
 * ===== NOTIFICATION SYSTEM =====
 * Handles all user-facing notifications
 */

const notificationContainer = (() => {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.bottom = '20px';
  container.style.left = '50%';
  container.style.transform = 'translateX(-50%)';
  container.style.display = 'flex';
  container.style.flexDirection = 'column-reverse';
  container.style.alignItems = 'center';
  container.style.zIndex = '9999';
  document.body.appendChild(container);
  return container;
})();

const notificationTimeouts = new Map();

/**
 * Show a notification message
 * @param {string} message - The message to display
 * @param {string} color - The background color (default: #00c8ff)
 * @param {number} duration - How long to show (default: 2500ms)
 */
function showNotification(message, color = '#00c8ff', duration = 2500) {
  // Check if notification with same message exists
  let existing = [...notificationContainer.children].find(
    note => note.textContent === message
  );

  if (existing) {
    clearTimeout(notificationTimeouts.get(existing));
    resetNotificationTimeout(existing, duration);
    return;
  }

  // Create new notification
  const note = document.createElement('div');
  note.textContent = message;
  note.style.position = 'relative';
  note.style.background = color;
  note.style.color = '#fff';
  note.style.padding = '10px 18px';
  note.style.marginTop = '10px';
  note.style.borderRadius = '10px';
  note.style.fontWeight = 'bold';
  note.style.boxShadow = '0 3px 10px rgba(0,0,0,0.3)';
  note.style.fontSize = '15px';
  note.style.opacity = '0';
  note.style.transform = 'translateY(-40px)';
  note.style.transition = 'all 0.4s ease-out';

  notificationContainer.appendChild(note);

  requestAnimationFrame(() => {
    note.style.opacity = '1';
    note.style.transform = 'translateY(0)';
  });

  resetNotificationTimeout(note, duration);
}

function resetNotificationTimeout(note, duration) {
  const timeoutId = setTimeout(() => {
    note.style.opacity = '0';
    note.style.transform = 'translateY(-30px)';
    setTimeout(() => {
      note.remove();
      notificationTimeouts.delete(note);
    }, 400);
  }, duration);

  notificationTimeouts.set(note, timeoutId);
}

/**
 * ===== DOM HELPER FUNCTIONS =====
 */

function getElement(id) {
  return document.getElementById(id);
}

function safe(fn) {
  return function(...args) {
    try {
      return fn(...args);
    } catch (error) {
      console.error('UI Error:', error);
    }
  };
}
