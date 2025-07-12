// Configuração da API
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Funções da API
class FornecedorAPI {
    static async getFornecedores(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = `${API_BASE_URL}/fornecedores${queryString ? '?' + queryString : ''}`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            
            if (response.ok) {
                return { success: true, data };
            } else {
                return { success: false, error: data.error || 'Erro ao carregar fornecedores' };
            }
        } catch (error) {
            return { success: false, error: 'Erro de conexão: ' + error.message };
        }
    }

    static async getFornecedor(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/fornecedores/${id}`);
            const data = await response.json();
            
            if (response.ok) {
                return { success: true, data };
            } else {
                return { success: false, error: data.error || 'Erro ao carregar fornecedor' };
            }
        } catch (error) {
            return { success: false, error: 'Erro de conexão: ' + error.message };
        }
    }

    static async createFornecedor(fornecedorData) {
        try {
            const response = await fetch(`${API_BASE_URL}/fornecedores`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(fornecedorData)
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, data };
            } else {
                return { success: false, error: data.error || 'Erro ao criar fornecedor' };
            }
        } catch (error) {
            return { success: false, error: 'Erro de conexão: ' + error.message };
        }
    }

    static async updateFornecedor(id, fornecedorData) {
        try {
            const response = await fetch(`${API_BASE_URL}/fornecedores/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(fornecedorData)
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, data };
            } else {
                return { success: false, error: data.error || 'Erro ao atualizar fornecedor' };
            }
        } catch (error) {
            return { success: false, error: 'Erro de conexão: ' + error.message };
        }
    }

    static async deleteFornecedor(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/fornecedores/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                return { success: true };
            } else {
                const data = await response.json();
                return { success: false, error: data.error || 'Erro ao desativar fornecedor' };
            }
        } catch (error) {
            return { success: false, error: 'Erro de conexão: ' + error.message };
        }
    }

    static async reativarFornecedor(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/fornecedores/${id}/reativar`, {
                method: 'PATCH'
            });

            if (response.ok) {
                return { success: true };
            } else {
                const data = await response.json();
                return { success: false, error: data.error || 'Erro ao reativar fornecedor' };
            }
        } catch (error) {
            return { success: false, error: 'Erro de conexão: ' + error.message };
        }
    }

    static async buscarPorDocumento(documento) {
        try {
            const response = await fetch(`${API_BASE_URL}/fornecedores/buscar/documento?documento=${documento}`);
            const data = await response.json();

            if (response.ok) {
                return { success: true, data };
            } else {
                return { success: false, error: 'Fornecedor não encontrado' };
            }
        } catch (error) {
            return { success: false, error: 'Erro de conexão: ' + error.message };
        }
    }

    static async consultarBrasilAPI(cnpj) {
        try {
            const cnpjLimpo = cnpj.replace(/\D/g, '');
            const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`);
            
            if (response.ok) {
                const data = await response.json();
                return { success: true, data };
            } else {
                return { success: false, error: 'CNPJ não encontrado na BrasilAPI' };
            }
        } catch (error) {
            return { success: false, error: 'Erro ao consultar BrasilAPI: ' + error.message };
        }
    }
}

// Exportar para uso global
window.FornecedorAPI = FornecedorAPI; 