# Sistema de Gerenciamento de Fornecedores

API Laravel para gerenciamento de fornecedores com validação de CNPJ/CPF e integração com BrasilAPI.

## 🚀 Instalação e Configuração

### Pré-requisitos
- PHP 8.1+
- Composer
- MySQL/MariaDB


composer install

Configure o banco de dados
Copie o arquivo `.env.example` para `.env` e configure:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=fornecedores_db
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha
```

### Gere a chave da aplicação
```bash
php artisan key:generate
```

### Execute as migrations
```bash
php artisan migrate
```

### Inicie o servidor
```bash
php artisan serve 
```

## 📱 Frontend

O frontend está localizado em `public/index.html` e pode ser acessado diretamente clicando:

## 🔧 Funcionalidades

### API Endpoints
- `GET /api/fornecedores` - Listar fornecedores
- `POST /api/fornecedores` - Criar fornecedor
- `GET /api/fornecedores/{id}` - Buscar fornecedor
- `PUT /api/fornecedores/{id}` - Atualizar fornecedor
- `DELETE /api/fornecedores/{id}` - Desativar fornecedor
- `GET /api/fornecedores/buscar/documento` - Buscar por CNPJ/CPF
- `PATCH /api/fornecedores/{id}/reativar` - Reativar fornecedor

### Funcionalidades do Frontend
- ✅ Carregar info de cnpj da api
- ✅ Cadastro de fornecedores (CNPJ/CPF)
- ✅ Validação automática de documentos
- ✅ Integração com BrasilAPI para CNPJ
- ✅ Listagem com filtros e ordenação
- ✅ Edição de fornecedores
- ✅ Desativação 
- ✅ Busca por CNPJ na BrasilAPI
- ✅ Interface responsiva e moderna

## 🛠️ Tecnologias

- **Backend**: Laravel 10
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Banco**: MySQL
- **API Externa**: BrasilAPI

## 📝 Estrutura do Projeto

```
fornecedores-api/
├── app/
│   ├── Http/Controllers/FornecedorController.php
│   └── Models/Fornecedor.php
├── database/migrations/
├── public/
│   ├── index.html
│   ├── css/
│   └── js/
└── routes/api.php
```

## 🎯 Como Usar

1. **Acesse**: `http://127.0.0.1:8000`
2. **Cadastre fornecedores** com CNPJ ou CPF
3. **Use os filtros** para buscar fornecedores
4. **Edite ou desative** fornecedores conforme necessário
5. **Consulte CNPJ** na página de busca

## 🔍 Validações

- CNPJ: Validação completa com dígitos verificadores
- CPF: Validação completa com dígitos verificadores
- Documentos únicos por fornecedor ativo
- Formatação automática de entrada

## 📊 Soft Delete

Os fornecedores não são removidos do banco, apenas desativados (campo `ativo = false`). Para reativar, use o endpoint de reativação.


Para problemas ou dúvidas:
1. Verifique os logs em `storage/logs/laravel.log`
2. Teste os endpoints da API diretamente
3. Verifique se todas as migrations foram executadas
4. Confirme se o banco de dados está configurado corretamente
