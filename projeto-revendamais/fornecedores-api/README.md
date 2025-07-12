# Sistema de Gerenciamento de Fornecedores

API Laravel para gerenciamento de fornecedores com validação de CNPJ/CPF e integração com BrasilAPI.

## 🚀 Instalação e Configuração

### Pré-requisitos
- PHP 8.1+
- Composer
- MySQL/MariaDB

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd fornecedores-api
```

### 2. Instale as dependências
```bash
composer install
```

### 3. Configure o banco de dados
Copie o arquivo `.env.example` para `.env` e configure:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=fornecedores_db
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha
```

### 4. Gere a chave da aplicação
```bash
php artisan key:generate
```

### 5. Execute as migrations
```bash
php artisan migrate
```

### 6. Inicie o servidor
```bash
php artisan serve --host=127.0.0.1 --port=8000
```

## 📱 Frontend

O frontend está localizado em `public/index.html` e pode ser acessado diretamente:
```
http://127.0.0.1:8000
```

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
- ✅ Cadastro de fornecedores (CNPJ/CPF)
- ✅ Validação automática de documentos
- ✅ Integração com BrasilAPI para CNPJ
- ✅ Listagem com filtros e ordenação
- ✅ Edição de fornecedores
- ✅ Desativação (soft delete)
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

## 🚨 Troubleshooting

### Erro de conexão com banco
- Verifique as configurações no `.env`
- Certifique-se de que o MySQL está rodando

### Erro 500 na API
- Verifique os logs em `storage/logs/laravel.log`
- Certifique-se de que todas as migrations foram executadas

### Problemas com BrasilAPI
- A integração pode falhar por problemas de SSL
- Os dados são salvos mesmo sem consulta à API externa

## 📋 Comandos Úteis

### Desenvolvimento
```bash
# Iniciar servidor
php artisan serve --host=127.0.0.1 --port=8000

# Ver logs em tempo real
tail -f storage/logs/laravel.log

# Limpar cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

### Banco de Dados
```bash
# Executar migrations
php artisan migrate

# Reverter migrations
php artisan migrate:rollback

# Resetar banco
php artisan migrate:fresh

# Ver status das migrations
php artisan migrate:status
```

### Debug
```bash
# Abrir Tinker (console Laravel)
php artisan tinker

# Ver rotas
php artisan route:list

# Ver configurações
php artisan config:show
```

## 🧪 Testes

### Testar API
```bash
# Testar endpoint de listagem
curl http://127.0.0.1:8000/api/fornecedores

# Testar criação de fornecedor
curl -X POST http://127.0.0.1:8000/api/fornecedores \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste","tipo":"CNPJ","documento":"00000000000191"}'
```

### Testar Frontend
1. Abra `http://127.0.0.1:8000` no navegador
2. Teste todas as funcionalidades:
   - Cadastro de fornecedor
   - Listagem e filtros
   - Edição de fornecedor
   - Desativação de fornecedor
   - Busca por CNPJ

## 🔧 Configurações Avançadas

### Configurar SSL para BrasilAPI
Se houver problemas com SSL, adicione no `.env`:
```env
CURL_VERIFY_SSL=false
```

### Configurar Timezone
```env
APP_TIMEZONE=America/Sao_Paulo
```

### Configurar Logs
```env
LOG_CHANNEL=daily
LOG_LEVEL=debug
```

## 📞 Suporte

Para problemas ou dúvidas:
1. Verifique os logs em `storage/logs/laravel.log`
2. Teste os endpoints da API diretamente
3. Verifique se todas as migrations foram executadas
4. Confirme se o banco de dados está configurado corretamente
