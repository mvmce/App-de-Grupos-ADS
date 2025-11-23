document.addEventListener('DOMContentLoaded', function() {
  // Elementos DOM
  const groupList = document.querySelector('.group-list');
  const searchInput = document.querySelector('.search-input');
  const searchContainer = document.querySelector('.search-container');
  const searchBtn = document.querySelector('.nav-btn:nth-child(2)');
  const criarGrupoBtn = document.querySelector('.nav-btn:nth-child(1)'); // Botão Criar Grupo
  const modalCriarGrupo = document.getElementById('modalCriarGrupo');
  const btnCancelar = document.getElementById('btnCancelar');
  // Função para criar grupo a partir do modal e inserir em ordem alfabética
  const btnCriarModal = document.getElementById('btnCriarGrupoModal');
  const inputNome = document.getElementById('inputNome');
  const inputDescricao = document.getElementById('inputDescricao');
  const inputCriadoPor = document.getElementById('inputCriadoPor');
  const inputLink = document.getElementById('inputLink');

  function criarGrupoDoModal() {
    const nome = inputNome.value.trim();
    const descricao = inputDescricao.value.trim();
    const criadoPor = inputCriadoPor.value.trim();
    const link = inputLink.value.trim();

    if (!nome || !descricao || !criadoPor || !link) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    // Criar <li> com dados (dados extras em data-attributes)
    const li = document.createElement('li');
    li.textContent = nome;
    li.dataset.descricao = descricao;
    li.dataset.criadoPor = criadoPor;
    li.dataset.link = link;

    // Adiciona ao array originalGroups e ordena alfabeticamente (case-insensitive, pt-br)
    originalGroups.push({ element: li, text: nome.toLowerCase() });
    originalGroups.sort((a, b) => a.text.localeCompare(b.text, 'pt', { sensitivity: 'base' }));

    // Atualiza a exibição (respeita termo de busca atual)
    filterGroups(searchInput.value || '');

    // Mensagem simples
    alert('Grupo Criado com Sucesso!');

    // Limpa campos e fecha modal
    inputNome.value = inputDescricao.value = inputCriadoPor.value = inputLink.value = '';
    hideCriarGrupoModal();
  }

  btnCriarModal.addEventListener('click', function(e) {
    e.preventDefault();
    criarGrupoDoModal();
  });
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

  // --- Início: visualização de grupo em modal (acrescentar) ---
  // Função para copiar link para a área de transferência (com fallback)
  function copyLinkToClipboard(text) {
    if (!text) {
      alert('Link inválido.');
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        alert('Link copiado para a área de transferência.');
      }).catch(() => {
        // fallback
        const t = document.createElement('textarea');
        t.value = text;
        document.body.appendChild(t);
        t.select();
        try {
          document.execCommand('copy');
          alert('Link copiado para a área de transferência.');
        } catch {
          alert('Não foi possível copiar o link.');
        }
        t.remove();
      });
    } else {
      const t = document.createElement('textarea');
      t.value = text;
      document.body.appendChild(t);
      t.select();
      try {
        document.execCommand('copy');
        alert('Link copiado para a área de transferência.');
      } catch {
        alert('Não foi possível copiar o link.');
      }
      t.remove();
    }
  }

  // Função para anexar clique a um <li> para abrir modal de visualização
  function attachLiClick(li) {
    if (!li) return;
    // prevenir múltiplos listeners
    li.removeEventListener('click', li._viewHandler);
    li._viewHandler = function () {
      openViewModalFromLi(li);
    };
    li.addEventListener('click', li._viewHandler);
    // opcional: cursor pointer
    li.style.cursor = 'pointer';
  }

  // Criar modal de visualização reutilizando o modal existente (modo "view")
  function openViewModalFromLi(li) {
    const nome = li.textContent || '';
    const descricao = li.dataset.descricao || '';
    const criadoPor = li.dataset.criadoPor || '';
    const link = li.dataset.link || '';

    // Preencher campos
    inputNome.value = nome;
    inputDescricao.value = descricao;
    inputCriadoPor.value = criadoPor;
    inputLink.value = link;

    // Tornar campos apenas leitura
    inputNome.readOnly = true;
    inputDescricao.readOnly = true;
    inputCriadoPor.readOnly = true;
    inputLink.readOnly = true;

    // Esconder botão de criar (modo view)
    if (btnCriarModal) btnCriarModal.style.display = 'none';

    // Criar/atualizar botões de ação somente no modo view
    const footer = modalCriarGrupo.querySelector('.modal-footer');
    if (!footer) {
      console.warn('modal-footer não encontrado.');
      showCriarGrupoModal();
      return;
    }

    // Botão copiar link
    let btnCopiar = document.getElementById('btnCopiarLinkModal');
    if (!btnCopiar) {
      btnCopiar = document.createElement('button');
      btnCopiar.id = 'btnCopiarLinkModal';
      btnCopiar.className = 'btn btn-secondary';
      btnCopiar.innerHTML = '<span class="material-icons-outlined">content_copy</span>Copiar link';
      btnCopiar.addEventListener('click', function (e) {
        e.preventDefault();
        copyLinkToClipboard(link);
      });
      footer.insertBefore(btnCopiar, footer.firstChild);
    } else {
      btnCopiar.onclick = function (e) { e.preventDefault(); copyLinkToClipboard(link); };
      btnCopiar.style.display = '';
    }

    // Botão abrir link
    let btnAbrir = document.getElementById('btnAbrirLinkModal');
    if (!btnAbrir) {
      btnAbrir = document.createElement('button');
      btnAbrir.id = 'btnAbrirLinkModal';
      btnAbrir.className = 'btn btn-primary';
      btnAbrir.innerHTML = '<span class="material-icons-outlined">open_in_new</span>Abrir link';
      btnAbrir.addEventListener('click', function (e) {
        e.preventDefault();
        if (link) window.open(link, '_blank');
        else alert('Link inválido.');
      });
      footer.insertBefore(btnAbrir, btnCopiar.nextSibling);
    } else {
      btnAbrir.onclick = function (e) { e.preventDefault(); if (link) window.open(link, '_blank'); else alert('Link inválido.'); };
      btnAbrir.style.display = '';
    }

    // Também permitir clicar no campo de link para copiar
    inputLink.style.cursor = 'pointer';
    inputLink.removeEventListener('click', inputLink._copyHandler);
    inputLink._copyHandler = function () { copyLinkToClipboard(link); };
    inputLink.addEventListener('click', inputLink._copyHandler);

    // Abrir modal
    showCriarGrupoModal();
  }

  // Resetar modal para estado de criação quando modal for fechado
  function resetModalToCreateMode() {
    try {
      // Restaurar inputs editáveis
      inputNome.readOnly = false;
      inputDescricao.readOnly = false;
      inputCriadoPor.readOnly = false;
      inputLink.readOnly = false;

      inputLink.style.cursor = '';
      if (inputLink._copyHandler) {
        inputLink.removeEventListener('click', inputLink._copyHandler);
        inputLink._copyHandler = null;
      }

      // Restaurar botão criar
      if (btnCriarModal) btnCriarModal.style.display = '';

      // Remover botões do modo view, se existirem
      const btnCopiar = document.getElementById('btnCopiarLinkModal');
      const btnAbrir = document.getElementById('btnAbrirLinkModal');
      if (btnCopiar) btnCopiar.remove();
      if (btnAbrir) btnAbrir.remove();

      // Opcional: não limpar os campos aqui (mantém comportamento atual do seu botão criar)
    } catch (err) {
      console.warn('Erro ao resetar modal:', err);
    }
  }

  // Observar fechamento do modal (remoção da classe 'active') para resetar estado
  const modalClassObserver = new MutationObserver(() => {
    if (!modalCriarGrupo.classList.contains('active')) {
      resetModalToCreateMode();
    }
  });
  modalClassObserver.observe(modalCriarGrupo, { attributes: true, attributeFilter: ['class'] });

  // Anexar listeners aos <li> já existentes
  originalGroups.forEach(item => {
    attachLiClick(item.element);
  });

  // Observar inserção de novos <li> no DOM para anexar listener automaticamente
  const listObserver = new MutationObserver(mutations => {
    for (const m of mutations) {
      if (m.type === 'childList' && m.addedNodes.length) {
        m.addedNodes.forEach(node => {
          if (node.nodeType === 1 && node.tagName.toLowerCase() === 'li') {
            attachLiClick(node);
          }
        });
      }
    }
  });
  listObserver.observe(groupList, { childList: true });

  // --- Fim: visualização de grupo em modal (acrescentar) ---

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