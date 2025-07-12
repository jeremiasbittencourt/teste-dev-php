// Gerenciamento de busca e filtros
class SearchManager {
    static currentPage = 1;
    static totalPages = 1;
    static currentFilters = {};

    static async loadFornecedores(page = 1) {
        const listDiv = document.getElementById('fornecedoresList');
        if (!listDiv) return;

        Utils.showLoading(listDiv, 'Carregando fornecedores...');

        // Construir parâmetros de busca
        const params = { page, ...this.currentFilters };
        
        const result = await FornecedorAPI.getFornecedores(params);
        
        if (result.success) {
            this.displayFornecedores(result.data.data, result.data.current_page, result.data.last_page);
            this.currentPage = result.data.current_page;
            this.totalPages = result.data.last_page;
        } else {
            listDiv.innerHTML = `<div class="alert alert-error">${result.error}</div>`;
        }
    }

    static displayFornecedores(fornecedores, currentPage, lastPage) {
        const listDiv = document.getElementById('fornecedoresList');
        if (!listDiv) return;
        
        if (fornecedores.length === 0) {
            listDiv.innerHTML = '<div class="alert alert-info">Nenhum fornecedor encontrado</div>';
            return;
        }

        let html = `
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th class="sortable" onclick="SearchManager.sortBy('id')">ID</th>
                            <th class="sortable" onclick="SearchManager.sortBy('nome')">Nome</th>
                            <th class="sortable" onclick="SearchManager.sortBy('tipo')">Tipo</th>
                            <th class="sortable" onclick="SearchManager.sortBy('documento')">Documento</th>
                            <th>Contato</th>
                            <th class="sortable" onclick="SearchManager.sortBy('cidade')">Cidade/UF</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        fornecedores.forEach(fornecedor => {
            html += `
                <tr>
                    <td>${fornecedor.id}</td>
                    <td>${fornecedor.nome || '-'}</td>
                    <td>${fornecedor.tipo}</td>
                    <td>${Utils.formatDocumento(fornecedor.documento, fornecedor.tipo)}</td>
                    <td>
                        ${fornecedor.telefone ? Utils.formatPhone(fornecedor.telefone) + '<br>' : ''}
                        ${fornecedor.email || ''}
                    </td>
                    <td>${fornecedor.cidade || ''} ${fornecedor.estado || ''}</td>
                    <td class="actions">
                        <button class="btn btn-secondary" onclick="SearchManager.editFornecedor(${fornecedor.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger" onclick="SearchManager.deleteFornecedor(${fornecedor.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
            </div>
        `;

        // Paginação
        if (lastPage > 1) {
            html += this.generatePagination(currentPage, lastPage);
        }

        listDiv.innerHTML = html;
    }

    static generatePagination(currentPage, lastPage) {
        let html = '<div class="pagination">';
        
        if (currentPage > 1) {
            html += `<button onclick="SearchManager.loadFornecedores(${currentPage - 1})">Anterior</button>`;
        }

        // Mostrar até 5 páginas
        let start = Math.max(1, currentPage - 2);
        let end = Math.min(lastPage, currentPage + 2);

        if (start > 1) {
            html += `<button onclick="SearchManager.loadFornecedores(1)">1</button>`;
            if (start > 2) {
                html += '<button disabled>...</button>';
            }
        }

        for (let i = start; i <= end; i++) {
            if (i === currentPage) {
                html += `<button class="active">${i}</button>`;
            } else {
                html += `<button onclick="SearchManager.loadFornecedores(${i})">${i}</button>`;
            }
        }

        if (end < lastPage) {
            if (end < lastPage - 1) {
                html += '<button disabled>...</button>';
            }
            html += `<button onclick="SearchManager.loadFornecedores(${lastPage})">${lastPage}</button>`;
        }

        if (currentPage < lastPage) {
            html += `<button onclick="SearchManager.loadFornecedores(${currentPage + 1})">Próximo</button>`;
        }

        html += '</div>';
        return html;
    }

    static searchFornecedores() {
        const nome = document.getElementById('searchNome')?.value || '';
        const documento = document.getElementById('searchDocumento')?.value || '';
        const tipo = document.getElementById('searchTipo')?.value || '';
        const sort = document.getElementById('searchSort')?.value || 'id';
        const order = document.getElementById('searchOrder')?.value || 'desc';

        // Limpar documento de máscaras
        const documentoLimpo = documento.replace(/\D/g, '');

        this.currentFilters = {
            nome: nome || undefined,
            documento: documentoLimpo || undefined,
            tipo: tipo || undefined,
            sort: sort,
            dir: order
        };

        // Remover campos undefined
        Object.keys(this.currentFilters).forEach(key => {
            if (this.currentFilters[key] === undefined) {
                delete this.currentFilters[key];
            }
        });

        this.loadFornecedores(1);
    }

    static clearFilters() {
        this.currentFilters = {};
        
        // Limpar campos
        const fields = ['searchNome', 'searchDocumento', 'searchTipo'];
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) field.value = '';
        });

        // Resetar ordenação
        const sortField = document.getElementById('searchSort');
        const orderField = document.getElementById('searchOrder');
        if (sortField) sortField.value = 'id';
        if (orderField) orderField.value = 'desc';

        this.loadFornecedores(1);
    }

    static sortBy(field) {
        const currentSort = this.currentFilters.sort || 'id';
        const currentOrder = this.currentFilters.dir || 'desc';
        
        let newOrder = 'asc';
        if (currentSort === field && currentOrder === 'asc') {
            newOrder = 'desc';
        }
        
        this.currentFilters.sort = field;
        this.currentFilters.dir = newOrder;
        
        this.loadFornecedores(1);
    }

    static async editFornecedor(id) {
        const result = await FornecedorAPI.getFornecedor(id);
        
        if (result.success) {
            FormManager.initEditForm(result.data);
        } else {
            Utils.showAlert(result.error, 'error');
        }
    }

    static async deleteFornecedor(id) {
        if (!Utils.confirm('Tem certeza que deseja desativar este fornecedor?')) {
            return;
        }

        const result = await FornecedorAPI.deleteFornecedor(id);
        
        if (result.success) {
            Utils.showAlert('Fornecedor desativado com sucesso!', 'success');
            this.loadFornecedores(this.currentPage);
        } else {
            Utils.showAlert(result.error, 'error');
        }
    }

    static async buscarCNPJBrasilAPI() {
        const cnpj = document.getElementById('searchCNPJInput')?.value;
        const resultDiv = document.getElementById('searchResult');

        if (!cnpj) {
            resultDiv.innerHTML = '<div class="alert alert-error">Digite um CNPJ</div>';
            return;
        }

        const cnpjLimpo = cnpj.replace(/\D/g, '');
        
        if (cnpjLimpo.length !== 14) {
            resultDiv.innerHTML = '<div class="alert alert-error">CNPJ deve ter 14 dígitos</div>';
            return;
        }

        if (!DocumentValidator.validateCNPJ(cnpj)) {
            resultDiv.innerHTML = '<div class="alert alert-error">CNPJ inválido</div>';
            return;
        }

        Utils.showLoading(resultDiv, 'Consultando BrasilAPI...');

        const result = await FornecedorAPI.consultarBrasilAPI(cnpjLimpo);

        if (result.success) {
            const data = result.data;
            resultDiv.innerHTML = `
                <div class="alert alert-success">
                    <h3>Dados do CNPJ Encontrado</h3>
                    <p><strong>CNPJ:</strong> ${Utils.formatDocumento(data.cnpj, 'CNPJ')}</p>
                    <p><strong>Razão Social:</strong> ${data.razao_social}</p>
                    <p><strong>Nome Fantasia:</strong> ${data.nome_fantasia || '-'}</p>
                    <p><strong>Situação:</strong> ${data.descricao_situacao_cadastral}</p>
                    <p><strong>Data de Abertura:</strong> ${data.data_inicio_atividade}</p>
                    <p><strong>Endereço:</strong> ${data.descricao_tipo_logradouro} ${data.logradouro}, ${data.numero || 'S/N'}, ${data.bairro}, ${data.municipio} - ${data.uf}</p>
                    <p><strong>CEP:</strong> ${data.cep}</p>
                    <p><strong>Telefone:</strong> ${data.ddd_telefone_1 || '-'}</p>
                    <p><strong>E-mail:</strong> ${data.email || '-'}</p>
                    <p><strong>Porte:</strong> ${data.porte.descricao}</p>
                    <p><strong>Natureza Jurídica:</strong> ${data.natureza_juridica.descricao}</p>
                </div>
            `;
        } else {
            resultDiv.innerHTML = `<div class="alert alert-error">${result.error}</div>`;
        }
    }
}

// Exportar para uso global
window.SearchManager = SearchManager; 