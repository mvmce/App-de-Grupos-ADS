document.addEventListener('DOMContentLoaded', function() {
  // Elementos DOM
  const groupList = document.querySelector('.group-list');
  const searchInput = document.querySelector('.search-input');
  const searchContainer = document.querySelector('.search-container');
  const searchBtn = document.querySelector('.nav-btn:nth-child(2)');
  const criarGrupoBtn = document.querySelector('.nav-btn:nth-child(1)'); // Botão Criar Grupo
  const modalCriarGrupo = document.getElementById('modalCriarGrupo');
  const btnCancelar = document.getElementById('btnCancelar');
  const originalGroups = Array.from(groupList.children).map(li => ({
    element: li,
    text: li.textContent.toLowerCase()
  }));

  let searchVisible = false;

  // Função para mostrar/ocultar busca
  function toggleSearch() {
    searchVisible = !searchVisible;
    
    if (searchVisible) {
      searchContainer.classList.add('active');
      setTimeout(() => {
        searchInput.focus();
      }, 300);
    } else {
      searchContainer.classList.remove('active');
      searchInput.value = '';
      filterGroups('');
    }
  }

  // Função para mostrar modal Criar Grupo
  function showCriarGrupoModal() {
    modalCriarGrupo.classList.add('active');
    // Prevenir rolagem do body quando modal estiver aberto
    document.body.style.overflow = 'hidden';
  }

  // Função para ocultar modal Criar Grupo
  function hideCriarGrupoModal() {
    modalCriarGrupo.classList.remove('active');
    // Restaurar rolagem do body
    document.body.style.overflow = '';
  }

  // Função para filtrar grupos
  function filterGroups(searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    
    groupList.innerHTML = '';

    if (term === '') {
      originalGroups.forEach(item => {
        groupList.appendChild(item.element);
      });
      return;
    }

    const filteredGroups = originalGroups.filter(item => 
      item.text.includes(term)
    );

    if (filteredGroups.length === 0) {
      const noResults = document.createElement('li');
      noResults.className = 'no-results';
      noResults.textContent = 'Nenhum grupo encontrado';
      groupList.appendChild(noResults);
    } else {
      filteredGroups.forEach(item => {
        groupList.appendChild(item.element);
      });
    }
  }

  // Event Listeners
  searchBtn.addEventListener('click', toggleSearch);
  criarGrupoBtn.addEventListener('click', showCriarGrupoModal);
  btnCancelar.addEventListener('click', hideCriarGrupoModal);

  // Fechar modal clicando fora do conteúdo
  modalCriarGrupo.addEventListener('click', function(e) {
    if (e.target === modalCriarGrupo) {
      hideCriarGrupoModal();
    }
  });

  searchInput.addEventListener('input', function(e) {
    filterGroups(e.target.value);
  });

  document.getElementById('btnVoltar').addEventListener('click', function() {
    window.history.back();
  });

  // Prevenir rolagem global
  document.addEventListener('wheel', function(e) {
    const groupListContainer = document.querySelector('.group-list-container');
    if (!groupListContainer.contains(e.target) && !modalCriarGrupo.classList.contains('active')) {
      e.preventDefault();
    }
  }, { passive: false });

  document.addEventListener('touchmove', function(e) {
    const groupListContainer = document.querySelector('.group-list-container');
    if (!groupListContainer.contains(e.target) && !modalCriarGrupo.classList.contains('active')) {
      e.preventDefault();
    }
  }, { passive: false });
});