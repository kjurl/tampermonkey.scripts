/* @refresh reload */
let clicked = false;

function clickTempChat(): boolean {
  if (clicked) return true;

  // Exact DOM structure queries matched against Gemini's active tree markup
  const targetButton = document.querySelector(
    '[data-test-id="temp-chat-button"] button, [aria-label="Temporary chat"]'
  ) as HTMLElement | null;

  if (targetButton) {
    console.log("Target button identified successfully.");

    // Check if the temporary mode is already enabled by evaluating state characteristics if present
    // Or just issue a clean click simulation loop if executing toggle behavior
    targetButton.click();

    console.log("🎯 Gemini Temporary Chat activated successfully!");
    clicked = true;
    return true;
  }

  return false;
}

// function clickTempChat(): boolean {
//   if (clicked) return;
//
//   const interactiveElements = document.querySelectorAll(
//     "button, a, [role='button'], [role='menuitem']"
//   );
//   // const buttons = document.querySelectorAll("button");
//
//   // for (const btn of buttons) {
//   //   const text = btn.innerText.toLowerCase();
//   //   const ariaLabel = (btn.getAttribute("aria-label") || "").toLowerCase();
//   //
//   //   if (
//   //     text.includes("temporary") ||
//   //     text.includes("temp chat") ||
//   //     ariaLabel.includes("temporary") ||
//   //     ariaLabel.includes("temp")
//   //   ) {
//   //     console.log("Found temp chat button, clicking...");
//   //     btn.click();
//   //     clicked = true;
//   //     return;
//   //   }
//   // }
//   for (const element of interactiveElements) {
//     const text = (element.textContent || "").toLowerCase();
//     const ariaLabel = (element.getAttribute("aria-label") || "").toLowerCase();
//     const testId = (element.getAttribute("data-testid") || "").toLowerCase();
//
//     if (
//       text.includes("temporary") ||
//       text.includes("temp chat") ||
//       ariaLabel.includes("temporary") ||
//       ariaLabel.includes("temp") ||
//       testId.includes("temp")
//     ) {
//       // Direct clicks can sometimes fail on styled custom elements; dispatch an explicit event
//       console.log(
//         "🎯 Found temporary chat action layer. Initializing simulation trigger..."
//       );
//
//       const targetElement = element as HTMLElement;
//       targetElement.click();
//       clicked = true;
//       return true;
//     }
//   }
//   return false;
// }
//
function initObserver(): void {
  if (clickTempChat()) return;

  const observer = new MutationObserver((_, obs) => {
    if (clickTempChat()) {
      obs.disconnect(); // Terminate observer once clicked to reclaim memory footprint
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Fail-safe teardown after 10 seconds to prevent lingering loop overhead
  setTimeout(() => observer.disconnect(), 10000);
}

function setupHotkeys(): void {
  window.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "o") {
      event.preventDefault();
      console.log("Hotkey Ctrl+Shift+O detected. Retrying in 5ms...");

      clicked = false;
      setTimeout(clickTempChat, 5);
    }
  });
}

function init(): void {
  initObserver();
}

// function init(): void {
//   clickTempChat();
//   setTimeout(clickTempChat, 500);
//   setTimeout(clickTempChat, 1000);
//   setTimeout(clickTempChat, 2000);
// }

if (document.readyState === "loading")
  document.addEventListener("DOMContentLoaded", init);
else init();
setupHotkeys();
