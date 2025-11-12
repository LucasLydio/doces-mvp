document.addEventListener('DOMContentLoaded', () => {
  const API = '/.netlify/functions/get-products-metrics';
  const container = document.getElementById('products-container');
  const searchInput = document.querySelector('.search input');
  const categorySelect = document.getElementById('categoria');

  let allProducts = [];

  // Carrega todos os produtos ao iniciar
  async function load() {
    try {
      const res = await fetch(API);
      const result = await res.json();
      allProducts = result.data || [];
      renderProducts(allProducts);
    } catch (err) {
      console.error('Erro ao carregar doces:', err);
    }
  }

  // Renderiza produtos com base em uma lista recebida
  function renderProducts(products) {
    if (!products.length) {
      container.innerHTML = `<div class="text-center text-muted py-3 w-100">Nenhum produto encontrado.</div>`;
      return;
    }
    container.innerHTML = products.map(c => `
      <div class="">
        <div class="card h-100 shadow">
          <div class="card-body">
              <img src=${c.img_url} alt="donana" width="250" class="mb-3"> 
              <h5 class="card-title">${c.name}</h5>
              <p class="card-text">${c.description}</p>
              <p class="mb-0 price">
                 R$ ${c.price}
              </p>
              <p class="m-2">
                 Obs: ${c.obs || 'Sem observações'}
              </p>
              <div class="d-flex justify-content-start gap-2 w-100">
                  <button class="btn btn-cart btn-buy"
                    data-product='${JSON.stringify(c)}'>
                      Comprar
                      <i class="bi bi-cart-fill"></i>
                  </button>
                  <button class="btn btn-heart">
                      <i class="bi bi-heart"></i>
                  </button>
              </div>
          </div>
        </div>
      </div>
    `).join('');

    // --- ADICIONE ISSO AQUI ---
    // Após inserir os produtos no DOM, adicione os listeners nos botões de comprar
    document.querySelectorAll('.btn-buy').forEach(btn => {
      btn.addEventListener('click', function () {
        const product = JSON.parse(this.getAttribute('data-product'));
        if (window.addToCart) {
          window.addToCart(product);
        } else {
          document.dispatchEvent(new CustomEvent('add-to-cart', { detail: product }));
        }
      });
    });
  }

  // Função para filtrar produtos
  function applyFilters() {
    let filtered = allProducts;

    // Filtro por nome
    const search = searchInput.value.trim().toLowerCase();
    if (search) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(search) ||
        (p.description && p.description.toLowerCase().includes(search))
      );
    }

    // Filtro por categoria
    const selectedCategory = categorySelect.value;
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    renderProducts(filtered);
  }

  // Listeners de busca e filtro
  searchInput.addEventListener('input', applyFilters);
  categorySelect.addEventListener('change', applyFilters);

  // Função scrollToTop
  const scrollToTopBtn = document.getElementById('scrollToTopBtn');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
      scrollToTopBtn.classList.add('show');
    } else {
      scrollToTopBtn.classList.remove('show');
    }
  });
  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  load();
});
