const initTextCount = () => {
  const counter = document.getElementById("js-text-count");
  if (!counter) return;

  const textarea = counter.closest(".p-form__dd")?.querySelector("textarea");
  if (!textarea) return;

  const updateCount = () => {
    counter.textContent = String(textarea.value.length);
  };

  textarea.addEventListener("input", updateCount);
  updateCount();
};

initTextCount();
