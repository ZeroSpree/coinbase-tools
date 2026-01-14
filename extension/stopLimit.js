(function () {
  const btn = document.createElement("button");
  btn.textContent = `StopLimit`;
  btn.setAttribute("data-type", "stopLimit");

  document.getElementById('coinbaseQuickSetContainer').append(btn);

  btn.addEventListener("click", setStopLimit);

  async function setStopLimit() {
    console.log(`setStopLimit()`);

    await window.cbt_cancelOrders();
    await window.cbt_openStopLimitTab();

    const stopInput = document.getElementById('stopPrice');
    const limitInput = document.getElementById('limitPrice');

    window.cbt_setReactInputValue(stopInput, 0.1);
    window.cbt_setReactInputValue(limitInput, 0.09);

    await window.cbt_setCurrency('notUSDC');
    document.querySelector('[data-testid="shortcut-button-max"]').click();
  }
})();
