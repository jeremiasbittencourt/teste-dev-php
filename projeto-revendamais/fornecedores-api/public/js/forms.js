// Gerenciamento de formulários
class FormManager {
    static initAddForm() {
        const form = document.getElementById('fornecedorForm');
        if (form) {
            form.addEventListener('submit', this.handleSubmit.bind(this));
        }
    }

    static toggleDocumentoField() {
        const tipo = document.getElementById('tipo');
        const documento = document.getElementById('documento');
        
        if (!tipo || !documento) return;
        
        // Remover listeners anteriores
        documento.removeEventListener('input', DocumentValidator.formatCNPJ);
        documento.removeEventListener('input', DocumentValidator.formatCPF);
        
        if (tipo.value === 'CNPJ') {
            documento.placeholder = '00.000.000/0000-00';
            documento.addEventListener('input', DocumentValidator.formatCNPJ);
        } else if (tipo.value === 'CPF') {
            documento.placeholder = '000.000.000-00';
            documento.addEventListener('input', DocumentValidator.formatCPF);
        } else {
            documento.placeholder = 'Digite apenas números';
        }
    }

    static async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const formDataObj = Object.fromEntries(formData);
        
        // Validar documento
        const validation = DocumentValidator.validateDocumento(formDataObj.tipo, formDataObj.documento);
        if (!validation.valid) {
            Utils.showAlert(validation.message, 'error');
            return;
        }
        
        // Remover máscaras antes de enviar
        if (formDataObj.documento) {
            formDataObj.documento = formDataObj.documento.replace(/\D/g, '');
        }
        
        // Consultar BrasilAPI se for CNPJ
        if (formDataObj.tipo === 'CNPJ' && formDataObj.documento) {
            const brasilAPIResult = await FornecedorAPI.consultarBrasilAPI(formDataObj.documento);
            if (brasilAPIResult.success) {
                const data = brasilAPIResult.data;
                formDataObj.nome = data.razao_social || formDataObj.nome;
                formDataObj.rua = (data.descricao_tipo_logradouro + ' ' + data.logradouro) || formDataObj.rua;
                formDataObj.numero = data.numero || formDataObj.numero;
                formDataObj.bairro = data.bairro || formDataObj.bairro;
                formDataObj.cidade = data.municipio || formDataObj.cidade;
                formDataObj.estado = data.uf || formDataObj.estado;
                formDataObj.cep = data.cep || formDataObj.cep;
                
                // Preencher campos automaticamente
                this.fillFormFields(formDataObj);
            }
        }
        
        // Salvar fornecedor
        const result = await FornecedorAPI.createFornecedor(formDataObj);
        
        if (result.success) {
            Utils.showAlert('Fornecedor cadastrado com sucesso!', 'success');
            e.target.reset();
            // Voltar para listagem
            Utils.loadPage('list');
        } else {
            Utils.showAlert(result.error, 'error');
        }
    }

    static fillFormFields(data) {
        const fields = ['nome', 'rua', 'numero', 'bairro', 'cidade', 'estado', 'cep'];
        fields.forEach(field => {
            const element = document.getElementById(field);
            if (element && data[field]) {
                element.value = data[field];
            }
        });
    }

    static initEditForm(fornecedor) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'editModal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="Utils.closeModal('editModal')">&times;</span>
                <h2>Editar Fornecedor</h2>
                <form id="editForm">
                    <input type="hidden" id="editId" name="editId" value="${fornecedor.id}">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="editTipo">Tipo de Documento *</label>
                            <select id="editTipo" name="tipo" required onchange="FormManager.toggleEditDocumentoField()">
                                <option value="CNPJ" ${fornecedor.tipo === 'CNPJ' ? 'selected' : ''}>CNPJ</option>
                                <option value="CPF" ${fornecedor.tipo === 'CPF' ? 'selected' : ''}>CPF</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="editDocumento">CNPJ/CPF *</label>
                            <input type="text" id="editDocumento" name="documento" required value="${Utils.formatDocumento(fornecedor.documento, fornecedor.tipo)}">
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="editNome">Nome/Razão Social</label>
                            <input type="text" id="editNome" name="nome" value="${fornecedor.nome || ''}">
                        </div>
                        <div class="form-group">
                            <label for="editTelefone">Telefone</label>
                            <input type="text" id="editTelefone" name="telefone" value="${fornecedor.telefone || ''}">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="editEmail">E-mail</label>
                        <input type="email" id="editEmail" name="email" value="${fornecedor.email || ''}">
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="editCep">CEP</label>
                            <input type="text" id="editCep" name="cep" value="${Utils.formatCEP(fornecedor.cep || '')}">
                        </div>
                        <div class="form-group">
                            <label for="editEstado">Estado</label>
                            <input type="text" id="editEstado" name="estado" maxlength="2" value="${fornecedor.estado || ''}">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="editCidade">Cidade</label>
                        <input type="text" id="editCidade" name="cidade" value="${fornecedor.cidade || ''}">
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="editBairro">Bairro</label>
                            <input type="text" id="editBairro" name="bairro" value="${fornecedor.bairro || ''}">
                        </div>
                        <div class="form-group">
                            <label for="editRua">Rua</label>
                            <input type="text" id="editRua" name="rua" value="${fornecedor.rua || ''}">
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="editNumero">Número</label>
                            <input type="text" id="editNumero" name="numero" value="${fornecedor.numero || ''}">
                        </div>
                        <div class="form-group">
                            <label for="editComplemento">Complemento</label>
                            <input type="text" id="editComplemento" name="complemento" value="${fornecedor.complemento || ''}">
                        </div>
                    </div>

                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i> Atualizar Fornecedor
                    </button>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Adicionar event listeners
        const editForm = document.getElementById('editForm');
        editForm.addEventListener('submit', this.handleEditSubmit.bind(this));
        
        // Configurar formatação do documento
        this.toggleEditDocumentoField();
        
        Utils.openModal('editModal');
    }

    static toggleEditDocumentoField() {
        const tipo = document.getElementById('editTipo');
        const documento = document.getElementById('editDocumento');
        
        if (!tipo || !documento) return;
        
        documento.removeEventListener('input', DocumentValidator.formatCNPJ);
        documento.removeEventListener('input', DocumentValidator.formatCPF);
        
        if (tipo.value === 'CNPJ') {
            documento.placeholder = '00.000.000/0000-00';
            documento.addEventListener('input', DocumentValidator.formatCNPJ);
        } else if (tipo.value === 'CPF') {
            documento.placeholder = '000.000.000-00';
            documento.addEventListener('input', DocumentValidator.formatCPF);
        }
    }

    static async handleEditSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const formDataObj = Object.fromEntries(formData);
        const id = document.getElementById('editId').value;
        
        // Remover campo editId dos dados se existir
        delete formDataObj.editId;
        
        // Validar documento
        const validation = DocumentValidator.validateDocumento(formDataObj.tipo, formDataObj.documento);
        if (!validation.valid) {
            Utils.showAlert(validation.message, 'error');
            return;
        }
        
        // Remover máscaras antes de enviar
        if (formDataObj.documento) {
            formDataObj.documento = formDataObj.documento.replace(/\D/g, '');
        }
        
        const result = await FornecedorAPI.updateFornecedor(id, formDataObj);
        
        if (result.success) {
            Utils.showAlert('Fornecedor atualizado com sucesso!', 'success');
            Utils.closeModal('editModal');
            // Recarregar listagem
            SearchManager.loadFornecedores();
        } else {
            Utils.showAlert(result.error, 'error');
        }
    }
}

// Exportar para uso global
window.FormManager = FormManager; 