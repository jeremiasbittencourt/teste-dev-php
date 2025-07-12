// Funções utilitárias
class Utils {
    static showAlert(message, type = 'info') {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        
        const content = document.querySelector('.content');
        const nav = document.querySelector('.nav');
        content.insertBefore(alert, nav.nextSibling);
        
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }

    static showLoading(container, message = 'Carregando...') {
        container.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i> ${message}
            </div>
        `;
    }

    static formatDocumento(documento, tipo) {
        if (!documento) return '';
        
        const clean = documento.replace(/\D/g, '');
        
        if (tipo === 'CNPJ' && clean.length === 14) {
            return clean.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        } else if (tipo === 'CPF' && clean.length === 11) {
            return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        }
        
        return documento;
    }

    static formatPhone(phone) {
        if (!phone) return '';
        
        const clean = phone.replace(/\D/g, '');
        
        if (clean.length === 11) {
            return clean.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (clean.length === 10) {
            return clean.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        }
        
        return phone;
    }

    static formatCEP(cep) {
        if (!cep) return '';
        
        const clean = cep.replace(/\D/g, '');
        
        if (clean.length === 8) {
            return clean.replace(/(\d{5})(\d{3})/, '$1-$2');
        }
        
        return cep;
    }

    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static confirm(message) {
        return confirm(message);
    }

    static closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }

    static openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
        }
    }

    static setActiveNav(page) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeItem = document.querySelector(`[data-page="${page}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }

    static loadPage(page) {
        const contentDiv = document.getElementById('page-content');
        
        switch (page) {
            case 'list':
                this.loadListPage(contentDiv);
                break;
            case 'add':
                this.loadAddPage(contentDiv);
                break;
            case 'search':
                this.loadSearchPage(contentDiv);
                break;
            default:
                this.loadListPage(contentDiv);
        }
        
        this.setActiveNav(page);
    }

    static loadListPage(container) {
        container.innerHTML = `
            <div class="filters">
                <h3>Filtros de Busca</h3>
                <div class="search-bar">
                    <div class="form-group">
                        <label for="searchNome">Nome</label>
                        <input type="text" id="searchNome" placeholder="Buscar por nome...">
                    </div>
                    <div class="form-group">
                        <label for="searchDocumento">CNPJ/CPF</label>
                        <input type="text" id="searchDocumento" placeholder="Buscar por documento..." oninput="DocumentValidator.formatSearchDocumento(this)">
                    </div>
                    <div class="form-group">
                        <label for="searchTipo">Tipo</label>
                        <select id="searchTipo">
                            <option value="">Todos</option>
                            <option value="CNPJ">CNPJ</option>
                            <option value="CPF">CPF</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="searchSort">Ordenar por</label>
                        <select id="searchSort">
                            <option value="id">ID</option>
                            <option value="nome">Nome</option>
                            <option value="documento">Documento</option>
                            <option value="cidade">Cidade</option>
                            <option value="created_at">Data de Cadastro</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="searchOrder">Ordem</label>
                        <select id="searchOrder">
                            <option value="desc">Decrescente</option>
                            <option value="asc">Crescente</option>
                        </select>
                    </div>
                    <button class="btn btn-primary" onclick="SearchManager.searchFornecedores()">
                        <i class="fas fa-search"></i> Buscar
                    </button>
                    <button class="btn btn-secondary" onclick="SearchManager.clearFilters()">
                        <i class="fas fa-times"></i> Limpar
                    </button>
                </div>
            </div>
            <div id="fornecedoresList" class="loading">
                <i class="fas fa-spinner fa-spin"></i> Carregando fornecedores...
            </div>
        `;
        
        // Carregar fornecedores automaticamente
        SearchManager.loadFornecedores();
    }

    static loadAddPage(container) {
        container.innerHTML = `
            <h2>Adicionar Fornecedor</h2>
            <form id="fornecedorForm">
                <div class="form-row">
                    <div class="form-group">
                        <label for="tipo">Tipo de Documento *</label>
                        <select id="tipo" name="tipo" required onchange="FormManager.toggleDocumentoField()">
                            <option value="">Selecione...</option>
                            <option value="CNPJ">CNPJ</option>
                            <option value="CPF">CPF</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="documento">CNPJ/CPF *</label>
                        <input type="text" id="documento" name="documento" required placeholder="Digite apenas números">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="nome">Nome/Razão Social</label>
                        <input type="text" id="nome" name="nome" placeholder="Nome ou razão social">
                    </div>
                    <div class="form-group">
                        <label for="telefone">Telefone</label>
                        <input type="text" id="telefone" name="telefone" placeholder="(11) 99999-9999">
                    </div>
                </div>

                <div class="form-group">
                    <label for="email">E-mail</label>
                    <input type="email" id="email" name="email" placeholder="email@exemplo.com">
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="cep">CEP</label>
                        <input type="text" id="cep" name="cep" placeholder="00000-000">
                    </div>
                    <div class="form-group">
                        <label for="estado">Estado</label>
                        <input type="text" id="estado" name="estado" placeholder="SP" maxlength="2">
                    </div>
                </div>

                <div class="form-group">
                    <label for="cidade">Cidade</label>
                    <input type="text" id="cidade" name="cidade" placeholder="São Paulo">
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="bairro">Bairro</label>
                        <input type="text" id="bairro" name="bairro" placeholder="Centro">
                    </div>
                    <div class="form-group">
                        <label for="rua">Rua</label>
                        <input type="text" id="rua" name="rua" placeholder="Rua das Flores">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="numero">Número</label>
                        <input type="text" id="numero" name="numero" placeholder="123">
                    </div>
                    <div class="form-group">
                        <label for="complemento">Complemento</label>
                        <input type="text" id="complemento" name="complemento" placeholder="Apto 45">
                    </div>
                </div>

                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save"></i> Salvar Fornecedor
                </button>
            </form>
        `;
        
        // Adicionar event listeners
        FormManager.initAddForm();
    }

    static loadSearchPage(container) {
        container.innerHTML = `
            <h2>Buscar CNPJ na BrasilAPI</h2>
            <div class="form-group">
                <label for="searchCNPJInput">CNPJ</label>
                <div style="display: flex; gap: 10px;">
                    <input type="text" id="searchCNPJInput" placeholder="Digite o CNPJ (apenas números)" 
                           oninput="DocumentValidator.formatCNPJ(this)" 
                           onkeypress="if(event.key==='Enter') SearchManager.buscarCNPJBrasilAPI()">
                    <button class="btn btn-primary" onclick="SearchManager.buscarCNPJBrasilAPI()">
                        <i class="fas fa-search"></i> Buscar
                    </button>
                </div>
                <small style="color: #666; margin-top: 5px; display: block;">
                    💡 Digite apenas números - a formatação será aplicada automaticamente
                </small>
            </div>

            <div id="searchResult"></div>
        `;
    }
}

// Exportar para uso global
window.Utils = Utils; 