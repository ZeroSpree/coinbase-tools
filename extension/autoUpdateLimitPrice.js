/**
 * Updates the limitPrice to -0.01 of the stop price,
 * however the stop price is set (by typing, or selecting from CB interface)
 */

(function () {
  const STOP_ID = 'stopPrice';
  const LIMIT_ID = 'limitPrice';

  function computeLimitPrice(stopValue) {
    const stopStr = stopValue.toString();

    const stopDecimals = stopStr.includes('.')
      ? stopStr.split('.')[1].length
      : 0;

    const decimals = Math.max(2, stopDecimals);
    const unit = Math.pow(10, -decimals);

    const limit = stopValue - unit;
    if (limit <= 0) return null;

    return limit.toFixed(decimals);
  }

  function syncLimitPrice() {
    const stopInput = document.getElementById(STOP_ID);
    const limitInput = document.getElementById(LIMIT_ID);

    if (!stopInput || !limitInput) return;

    const stopValue = parseFloat(stopInput.value);
    if (Number.isNaN(stopValue)) return;

    const limitValue = computeLimitPrice(stopValue);
    if (!limitValue) return;

    if (limitInput.value !== limitValue) {
      window.cbt_setReactInputValue(limitInput, limitValue);
      refocusStop(stopInput);
    }
  }

  function refocusStop(stopInput) {
    // Defer to avoid React clobbering focus
    setTimeout(() => {
      stopInput.focus();
      stopInput.setSelectionRange(
        stopInput.value.length,
        stopInput.value.length
      );
    }, 0);
  }

  function observeStopInput(stopInput) {
    let lastValue = stopInput.value;

    setInterval(() => {
      if (stopInput.value !== lastValue) {
        lastValue = stopInput.value;
        syncLimitPrice();
      }
    }, 150);
  }

  function attach() {
    const stopInput = document.getElementById(STOP_ID);
    if (!stopInput) return false;

    observeStopInput(stopInput);
    stopInput.addEventListener('input', syncLimitPrice);
    return true;
  }

  const interval = setInterval(() => {
    if (attach()) {
      clearInterval(interval);
    }
  }, 300);
})();
