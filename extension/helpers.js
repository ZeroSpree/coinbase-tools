/**
 * Set input values, the React way
 */

window.cbt_setReactInputValue = function (input, value) {
  console.log('cbt_setReactInputValue observer start');

  function doSet(input, value) {
    const setter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value'
    ).set;

    setter.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }

  // return early if input exists
  if (input) {
    doSet(input, value);
    console.log('cbt_setReactInputValue end (immediate)');
    return;
  }

  // wait for input if it's missing
  const observer = new MutationObserver((mutations, obs) => {
    if (input) { // Element now exists
      obs.disconnect(); // Stop observing
      doSet(input, value)
      console.log('cbt_setReactInputValue observer end')
    }
  });

  // Start observing the body for added nodes anywhere in the subtree
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

/**
 * Open a Buy or Sell tab, only if it isn't open yet
 * type: "buy" or "sell"
 */

window.cbt_openTab = function (type) {
  const tab = document.querySelector(`div[data-testid="order-form-${type}-tab"][data-active="false"]`);
  if (tab) tab.querySelector('button').click();
}

/**
 * Open the Sell Stop Limit tab
 * Async function, waits for MutationObserver
 * 
 * Usage:
 * 
  async function bla() {
    await window.cbt_openStopLimitTab();
    doSomethingNext();
  }
 */
window.cbt_openStopLimitTab = function () {
  return new Promise((resolve, reject) => {
    try {
      const stopInput = document.getElementById('stopPrice');
      const limitInput = document.getElementById('limitPrice');

      if (stopInput && limitInput && document.querySelector('[data-testid="order-form-sell-tab"][data-active="true"]')) {
        resolve();
        return;
      }

      window.cbt_openTab("sell");

      const stopDropdown = document.querySelector('[data-testid="order-type-stop-dropdown"]');
      stopDropdown.click();

      // Observe DOM changes to detect when the element appears
      const observer = new MutationObserver((mutations, obs) => {
        const stopLimitTab = document.querySelector('[data-testid="advanced-dropdown-item-stop_limit"]');

        if (stopLimitTab) { // Element now exists
          obs.disconnect(); // Stop observing
          stopLimitTab.click(); // Click it
          resolve(); // Signal that the function has finished
        }
      });

      // Start observing the body for added nodes anywhere in the subtree
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Set currency (USDC or notUSDC)
 */
window.cbt_setCurrency = function (currency) {
  return new Promise((resolve, reject) => {
    try {
      console.log(`setCurrency(${currency})`);

      const currencyToggleButton = document.querySelector('[data-testid="amount-suffix"]');
      const isCurrentlyUSDC = currencyToggleButton.textContent.toUpperCase().includes("USDC");
      const shouldBeUSDC = currency === "USDC";

      if (isCurrentlyUSDC !== shouldBeUSDC) currencyToggleButton.click();
      setTimeout(resolve, 50);// Signal that the function has finished
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Cancel current pair orders
 */
window.cbt_cancelOrders = function () {
  return new Promise((resolve, reject) => {
    try {
      let ordersDrawer = document.querySelector('[data-testid="orders-tray-toggle-btn"][aria-expanded="false"]');
      if(ordersDrawer) ordersDrawer.click();

      document.querySelector('[data-testid="orders-tray-product-filter-advanced-dropdown"]').click();

      const dropdownButtonInterval = setInterval(() => {
        let dropdownItem = document.querySelector('[data-testid="advanced-dropdown-item-BERA-USDC"]');
        if (dropdownItem) {
          clearInterval(dropdownButtonInterval);
          dropdownItem.click();
      document.querySelector('[data-testid="rat-pill-cancel-all-orders-button"]').click();
        }
      }, 50);


      setTimeout(resolve, 50);// Signal that the function has finished
    } catch (err) {
      reject(err);
    }
  });
}