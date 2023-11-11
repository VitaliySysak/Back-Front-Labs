document.addEventListener("DOMContentLoaded", function () {
  const sourceText = document.getElementById("source-text");
  const resultText = document.getElementById("result-text");
  const alphabetImagePath = "staff/";

  document.getElementById("go").addEventListener("click", function () {
      const inputText = sourceText.value;
      resultText.innerHTML = "";

      let delay = 0;

      for (const char of inputText) {
          if (char == " ") {
              resultText.appendChild(document.createTextNode(" "));
          } else if (/[a-zA-Z]/.test(char)) {
              const isLowerCase = char == char.toLowerCase();
              const imageChar = isLowerCase ? `small_${char}` : char;
              const image = document.createElement("img");
              image.src = `${alphabetImagePath}${imageChar}.png`;
              image.alt = char;
              image.style.animation = `appears 0.5s ${delay}s both`;
              resultText.appendChild(image);
          }
          delay += 0.1;
      }
  });
});
