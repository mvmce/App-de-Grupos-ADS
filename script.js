// script.js - comportamento do carrossel (versão corrigida)
// Usa scrollIntoView para centralizar cada card de forma robusta.

const carousel = document.getElementById("carousel");
const cards = Array.from(carousel.querySelectorAll(".card"));
const btnNext = document.getElementById("btnProximo");
const btnPrev = document.getElementById("btnAnterior");

let index = 0;

// Centraliza o card com scrollIntoView (mais confiável que cálculos manuais)
function moverPara(indice) {
  if (!cards[indice]) return;
  cards[indice].scrollIntoView({
    behavior: "smooth",
    inline: "center",
    block: "nearest"
  });
}

// Próximo
btnNext.addEventListener("click", () => {
  if (index < cards.length - 1) {
    index++;
    moverPara(index);
  } else {
    // opcional: rebobinar para o início
    // index = 0; moverPara(index);
  }
});

// Anterior
btnPrev.addEventListener("click", () => {
  if (index > 0) {
    index--;
    moverPara(index);
  }
});

// Também atualiza índice se o usuário scrollar manualmente (útil para manter botões consistentes)
let scrollTimeout = null;
carousel.addEventListener("scroll", () => {
  // debounce rápido para evitar execuções contínuas
  if (scrollTimeout) clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    // encontra o card mais próximo do centro do carousel
    const carouselRect = carousel.getBoundingClientRect();
    const centerX = carouselRect.left + carouselRect.width / 2;

    let closestIndex = 0;
    let minDist = Infinity;
    cards.forEach((card, i) => {
      const rect = card.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const dist = Math.abs(cardCenterX - centerX);
      if (dist < minDist) {
        minDist = dist;
        closestIndex = i;
      }
    });

    index = closestIndex;
  }, 80);
});

// Clique no card 2 → abrir outra página (se existir)
const card2 = document.getElementById("card2");
if (card2) {
  card2.addEventListener("click", () => {
    window.location.href = "card2.html";
  });
}
