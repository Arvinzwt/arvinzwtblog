import { useEffect } from "react";

export default function CopyButton() {
  useEffect(() => {
    const buttons = document.querySelectorAll(".wmm-copy-btn");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const code = btn.getAttribute("data-code");
        navigator.clipboard.writeText(code).then(() => {
          btn.textContent = "Copied!";
          setTimeout(() => (btn.textContent = "Copy"), 2000);
        });
      });
    });
  }, []);

  return null;
}
