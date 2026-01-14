(function () {
  console.log("✅ Coinbase Helper Loaded");
  const WAIT = 100;

  // prevent loading buttons twice
  if (document.getElementById("coinbaseQuickSetContainer")) return;

  // Container for all buttons
  const container = document.createElement("div");
  container.id = "coinbaseQuickSetContainer";
  document.body.appendChild(container);

  // Button factory
  function createButton(amount, type) {
    const btn = document.createElement("button");
    btn.textContent = `${amount}`;
    btn.setAttribute("data-type", type);

    btn.addEventListener("click", async () => {
      selectTypeAndMarketTabs(type);
      await window.cbt_setCurrency(type == "buy" ? "USDC" : "notUSDC");

      if (amount == "max") document.querySelector('[data-testid="shortcut-button-max"]').click();
      else setAmountValue(String(amount));
    });

    container.append(btn);
  }

  // Add buttons
  [1, 500, 1000].forEach(amount => createButton(amount, "buy"));
  [1, "max"].forEach(amount => createButton(amount, "sell"));

  function setAmountValue(value) {
    console.log(`setAmountValue(${value})`);

    // Delay setting value to let React finish updates
    setTimeout(() => {
      const amountInput = document.getElementById('amount');
      window.cbt_setReactInputValue(amountInput, value);
    }, WAIT);
  }

  function selectTypeAndMarketTabs(type) {
    console.log(`selectTypeAndMarketTabs(${type})`);

    const marketTab = document.querySelector('[data-testid="order-type-market-tab"]');
    window.cbt_openTab(type);
    marketTab.click();

    return true;
  }
})();
