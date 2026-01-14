// Update natively (for React)

const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
  window.HTMLInputElement.prototype,
  "value"
).set;

/*
// Examples:
const input = document.querySelector('input[id="amount"]');

// Set value to "1"
nativeInputValueSetter.call(input, "1");

// Dispatch input event so React sees the change
input.dispatchEvent(new Event("input", { bubbles: true }));
*/