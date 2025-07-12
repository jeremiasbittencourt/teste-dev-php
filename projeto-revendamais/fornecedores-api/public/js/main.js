// Arquivo principal da aplicação
class App {
    static init() {
        this.setupNavigation();
        this.loadInitialPage();
    }

    static setupNavigation() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.getAttribute('data-page');
                Utils.loadPage(page);
            });
        });
    }

    static loadInitialPage() {
        // Carregar página de listagem por padrão
        Utils.loadPage('list');
    }
}

// Inicializar aplicação quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Fechar modal ao clicar fora
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            Utils.closeModal(modal.id);
        }
    });
} 