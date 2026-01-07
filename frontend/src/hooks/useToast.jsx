import { useCallback } from "react";

export function useToast() {
  const toast = useCallback(({ title, duration = 3000 }) => {
    const toastDiv = document.createElement("div");

    toastDiv.innerText = title;
    toastDiv.style.position = "fixed";
    toastDiv.style.bottom = "20px";
    toastDiv.style.left = "50%";
    toastDiv.style.transform = "translateX(-50%)";
    toastDiv.style.background = "#111827";
    toastDiv.style.color = "#ffffff";
    toastDiv.style.padding = "12px 20px";
    toastDiv.style.borderRadius = "12px";
    toastDiv.style.fontSize = "14px";
    toastDiv.style.zIndex = "9999";
    toastDiv.style.boxShadow = "0 10px 25px rgba(0,0,0,0.2)";
    toastDiv.style.opacity = "0";
    toastDiv.style.transition = "opacity 0.3s ease";

    document.body.appendChild(toastDiv);

    requestAnimationFrame(() => {
      toastDiv.style.opacity = "1";
    });

    setTimeout(() => {
      toastDiv.style.opacity = "0";
      setTimeout(() => {
        document.body.removeChild(toastDiv);
      }, 300);
    }, duration);
  }, []);

  return { toast };
}
