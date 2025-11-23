// script.js - comportamento do carrossel (versão melhorada sem mexer na lógica existente)
// Usa scrollIntoView para centralizar cada card de forma robusta.
const carousel = document.getElementById("carousel");
if (!carousel) throw new Error('Elemento #carousel não encontrado.');

let cards;
try {
  // seleciona apenas filhos diretos com a classe .card para evitar duplicações
  cards = Array.from(carousel.querySelectorAll(':scope > .card'));
} catch (e) {
  // fallback para navegadores que não suportam :scope
  cards = Array.from(carousel.children).filter(c => c.classList && c.classList.contains('card'));
}

const btnNext = document.getElementById("btnProximo");
const btnPrev = document.getElementById("btnAnterior");

let index = 0;

function moverPara(indice) {
  if (!cards[indice]) return;
  cards[indice].scrollIntoView({
    behavior: "smooth",
    inline: "center",
    block: "nearest"
  });
}

if (btnNext) {
  btnNext.addEventListener("click", () => {
    if (index < cards.length - 1) {
      index++;
      moverPara(index);
    }
  });
}

if (btnPrev) {
  btnPrev.addEventListener("click", () => {
    if (index > 0) {
      index--;
      moverPara(index);
    }
  });
}

// Atualiza índice se o usuário scrollar manualmente
let scrollTimeout = null;
carousel.addEventListener("scroll", () => {
  if (scrollTimeout) clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
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


// ============================================================
//  HANDLERS DE CLIQUE - MELHORIA SEM ALTERAR A LÓGICA
// ============================================================

// Gera automaticamente card1 → card14
for (let i = 1; i <= 14; i++) {
  const id = `card${i}`;
  const card = document.getElementById(id);

  if (card) {
    card.addEventListener("click", () => {
      window.location.href = `${id}/${id}.html`;
    });
  }
}
