// Validações e formatação de documentos
class DocumentValidator {
    static formatCNPJ(input) {
        let value = input.value.replace(/\D/g, '');
        const originalLength = value.length;
        
        // Aplicar máscara progressiva
        if (value.length >= 2) value = value.replace(/(\d{2})/, '$1.');
        if (value.length >= 5) value = value.replace(/(\d{2})\.(\d{3})/, '$1.$2.');
        if (value.length >= 8) value = value.replace(/(\d{2})\.(\d{3})\.(\d{3})/, '$1.$2.$3/');
        if (value.length >= 12) value = value.replace(/(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})/, '$1.$2.$3/$4-');
        
        input.value = value;
        
        // Manter cursor na posição correta
        const newLength = value.length;
        const cursorPosition = input.selectionStart;
        const addedChars = newLength - originalLength;
        
        if (addedChars > 0 && cursorPosition < newLength) {
            input.setSelectionRange(cursorPosition + addedChars, cursorPosition + addedChars);
        }
    }

    static formatCPF(input) {
        let value = input.value.replace(/\D/g, '');
        const originalLength = value.length;
        
        // Aplicar máscara progressiva
        if (value.length >= 3) value = value.replace(/(\d{3})/, '$1.');
        if (value.length >= 6) value = value.replace(/(\d{3})\.(\d{3})/, '$1.$2.');
        if (value.length >= 9) value = value.replace(/(\d{3})\.(\d{3})\.(\d{3})/, '$1.$2.$3-');
        
        input.value = value;
        
        // Manter cursor na posição correta
        const newLength = value.length;
        const cursorPosition = input.selectionStart;
        const addedChars = newLength - originalLength;
        
        if (addedChars > 0 && cursorPosition < newLength) {
            input.setSelectionRange(cursorPosition + addedChars, cursorPosition + addedChars);
        }
    }

    static formatSearchDocumento(input) {
        let value = input.value.replace(/\D/g, '');
        const originalLength = value.length;
        
        // Aplicar máscara baseada no número de caracteres
        if (value.length <= 11) {
            // Formato CPF
            if (value.length >= 3) value = value.replace(/(\d{3})/, '$1.');
            if (value.length >= 6) value = value.replace(/(\d{3})\.(\d{3})/, '$1.$2.');
            if (value.length >= 9) value = value.replace(/(\d{3})\.(\d{3})\.(\d{3})/, '$1.$2.$3-');
        } else if (value.length <= 14) {
            // Formato CNPJ
            if (value.length >= 2) value = value.replace(/(\d{2})/, '$1.');
            if (value.length >= 5) value = value.replace(/(\d{2})\.(\d{3})/, '$1.$2.');
            if (value.length >= 8) value = value.replace(/(\d{2})\.(\d{3})\.(\d{3})/, '$1.$2.$3/');
            if (value.length >= 12) value = value.replace(/(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})/, '$1.$2.$3/$4-');
        }
        
        input.value = value;
        
        // Manter o cursor na posição correta
        const newLength = value.length;
        const cursorPosition = input.selectionStart;
        const addedChars = newLength - originalLength;
        
        if (addedChars > 0 && cursorPosition < newLength) {
            input.setSelectionRange(cursorPosition + addedChars, cursorPosition + addedChars);
        }
    }

    static validateCNPJ(cnpj) {
        const cleanCNPJ = cnpj.replace(/\D/g, '');
        
        if (cleanCNPJ.length !== 14) return false;
        if (/(\d)\1{13}/.test(cleanCNPJ)) return false;
        
        // Validação dos dígitos verificadores
        const weights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        let sum = 0;
        
        for (let i = 0; i < 12; i++) {
            sum += cleanCNPJ[i] * weights[i];
        }
        
        let digit1 = sum % 11 < 2 ? 0 : 11 - sum % 11;
        if (cleanCNPJ[12] != digit1) return false;
        
        weights.unshift(6);
        sum = 0;
        
        for (let i = 0; i < 13; i++) {
            sum += cleanCNPJ[i] * weights[i];
        }
        
        let digit2 = sum % 11 < 2 ? 0 : 11 - sum % 11;
        return cleanCNPJ[13] == digit2;
    }

    static validateCPF(cpf) {
        const cleanCPF = cpf.replace(/\D/g, '');
        
        if (cleanCPF.length !== 11) return false;
        if (/(\d)\1{10}/.test(cleanCPF)) return false;
        
        // Validação dos dígitos verificadores
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += cleanCPF[i] * (10 - i);
        }
        
        let digit1 = sum % 11 < 2 ? 0 : 11 - sum % 11;
        if (cleanCPF[9] != digit1) return false;
        
        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += cleanCPF[i] * (11 - i);
        }
        
        let digit2 = sum % 11 < 2 ? 0 : 11 - sum % 11;
        return cleanCPF[10] == digit2;
    }

    static validateDocumento(tipo, documento) {
        const documentoLimpo = documento.replace(/\D/g, '');
        
        if (tipo === 'CNPJ') {
            if (documentoLimpo.length !== 14) {
                return { valid: false, message: 'CNPJ deve ter 14 dígitos' };
            }
            if (!this.validateCNPJ(documento)) {
                return { valid: false, message: 'CNPJ inválido' };
            }
        } else if (tipo === 'CPF') {
            if (documentoLimpo.length !== 11) {
                return { valid: false, message: 'CPF deve ter 11 dígitos' };
            }
            if (!this.validateCPF(documento)) {
                return { valid: false, message: 'CPF inválido' };
            }
        }
        
        return { valid: true };
    }

    static getDocumentoTipo(documento) {
        const documentoLimpo = documento.replace(/\D/g, '');
        
        if (documentoLimpo.length === 11) {
            return 'CPF';
        } else if (documentoLimpo.length === 14) {
            return 'CNPJ';
        }
        
        return null;
    }
}

// Exportar para uso global
window.DocumentValidator = DocumentValidator; 