<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Fornecedor;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Http;

class FornecedorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Fornecedor::where('ativo', true);
        // Filtros
        if ($request->filled('nome')) {
            $query->where('nome', 'like', '%' . $request->nome . '%');
        }
        if ($request->filled('documento')) {
            // Limpar documento de formatação antes de buscar
            $documento = preg_replace('/\D/', '', $request->documento);
            $query->where('documento', $documento);
        }
        // Ordenação
        $sort = $request->get('sort', 'id');
        $dir = $request->get('dir', 'desc');
        $query->orderBy($sort, $dir);
        // Paginação
        return response()->json($query->paginate(10));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'nome' => 'nullable|string|max:255',
            'tipo' => ['required', Rule::in(['CNPJ', 'CPF'])],
            'documento' => [
                'required',
                'string',
                'max:20',
                Rule::unique('fornecedors', 'documento')->where('ativo', true)
            ],
            'telefone' => 'nullable|string|max:20',
            'email' => 'nullable|email',
            'rua' => 'nullable|string',
            'numero' => 'nullable|string|max:10',
            'complemento' => 'nullable|string|max:50',
            'bairro' => 'nullable|string|max:50',
            'cidade' => 'nullable|string|max:50',
            'estado' => 'nullable|string|max:2',
            'cep' => 'nullable|string|max:10',
        ]);

        // Limpar documento de formatação antes de salvar
        $data['documento'] = preg_replace('/\D/', '', $data['documento']);
        
        // Definir como ativo por padrão
        $data['ativo'] = true;

        // Validação de formato
        if ($data['tipo'] === 'CNPJ' && !$this->validaCNPJ($data['documento'])) {
            return response()->json(['error' => 'CNPJ inválido'], 422);
        }
        if ($data['tipo'] === 'CPF' && !$this->validaCPF($data['documento'])) {
            return response()->json(['error' => 'CPF inválido'], 422);
        }

        // Consulta BrasilAPI para CNPJ (temporariamente desabilitada para debug)
        // if ($data['tipo'] === 'CNPJ') {
        //     $response = Http::get('https://brasilapi.com.br/api/cnpj/v1/' . $data['documento']);
        //     if ($response->ok()) {
        //         $info = $response->json();
        //         $data['nome'] = $info['razao_social'] ?? $data['nome'];
        //         $data['rua'] = $info['descricao_tipo_logradouro'] . ' ' . $info['logradouro'] ?? $data['rua'];
        //         $data['numero'] = $info['numero'] ?? $data['numero'];
        //         $data['bairro'] = $info['bairro'] ?? $data['bairro'];
        //         $data['cidade'] = $info['municipio'] ?? $data['cidade'];
        //         $data['estado'] = $info['uf'] ?? $data['estado'];
        //         $data['cep'] = $info['cep'] ?? $data['cep'];
        //     }
        // }
        $fornecedor = Fornecedor::create($data);
        return response()->json($fornecedor, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $fornecedor = Fornecedor::where('ativo', true)->findOrFail($id);
        return response()->json($fornecedor);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $fornecedor = Fornecedor::where('ativo', true)->findOrFail($id);
        $data = $request->validate([
            'nome' => 'nullable|string|max:255',
            'tipo' => ['required', Rule::in(['CNPJ', 'CPF'])],
            'documento' => [
                'required',
                'string',
                'max:20',
                Rule::unique('fornecedors', 'documento')->where('ativo', true)->ignore($fornecedor->id),
            ],
            'telefone' => 'nullable|string|max:20',
            'email' => 'nullable|email',
            'rua' => 'nullable|string',
            'numero' => 'nullable|string|max:10',
            'complemento' => 'nullable|string|max:50',
            'bairro' => 'nullable|string|max:50',
            'cidade' => 'nullable|string|max:50',
            'estado' => 'nullable|string|max:2',
            'cep' => 'nullable|string|max:10',
        ]);

        // Limpar documento de formatação antes de salvar
        $data['documento'] = preg_replace('/\D/', '', $data['documento']);

        // Validação de formato
        if ($data['tipo'] === 'CNPJ' && !$this->validaCNPJ($data['documento'])) {
            return response()->json(['error' => 'CNPJ inválido'], 422);
        }
        if ($data['tipo'] === 'CPF' && !$this->validaCPF($data['documento'])) {
            return response()->json(['error' => 'CPF inválido'], 422);
        }
        $fornecedor->update($data);
        return response()->json($fornecedor);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $fornecedor = Fornecedor::where('ativo', true)->findOrFail($id);
        $fornecedor->update(['ativo' => false]);
        return response()->json(['message' => 'Fornecedor desativado com sucesso.']);
    }

    /**
     * Buscar fornecedor por CNPJ/CPF
     */
    public function buscarPorDocumento(Request $request)
    {
        $request->validate([
            'documento' => 'required|string|max:20',
        ]);

        // Limpar documento de formatação antes de buscar
        $documento = preg_replace('/\D/', '', $request->documento);

        $fornecedor = Fornecedor::where('ativo', true)->where('documento', $documento)->first();
        
        if (!$fornecedor) {
            return response()->json(['error' => 'Fornecedor não encontrado'], 404);
        }

        return response()->json($fornecedor);
    }

    /**
     * Reativar fornecedor desativado
     */
    public function reativar(string $id)
    {
        $fornecedor = Fornecedor::findOrFail($id);
        
        if ($fornecedor->ativo) {
            return response()->json(['error' => 'Fornecedor já está ativo'], 400);
        }
        
        $fornecedor->update(['ativo' => true]);
        return response()->json(['message' => 'Fornecedor reativado com sucesso.']);
    }

    // Funções auxiliares para validação de CNPJ/CPF
    private function validaCNPJ($cnpj)
    {
        $cnpj = preg_replace('/\D/', '', $cnpj);
        if (strlen($cnpj) != 14) return false;
        if (preg_match('/(\d)\1{13}/', $cnpj)) return false;
        
        // Primeiro dígito verificador
        $t = [5,4,3,2,9,8,7,6,5,4,3,2];
        $s = 0;
        for ($i = 0; $i < 12; $i++) {
            $s += intval($cnpj[$i]) * $t[$i];
        }
        $d1 = ($s % 11 < 2) ? 0 : 11 - $s % 11;
        if (intval($cnpj[12]) != $d1) return false;
        
        // Segundo dígito verificador
        $t = [6,5,4,3,2,9,8,7,6,5,4,3,2];
        $s = 0;
        for ($i = 0; $i < 13; $i++) {
            $s += intval($cnpj[$i]) * $t[$i];
        }
        $d2 = ($s % 11 < 2) ? 0 : 11 - $s % 11;
        return intval($cnpj[13]) == $d2;
    }
    private function validaCPF($cpf)
    {
        $cpf = preg_replace('/\D/', '', $cpf);
        if (strlen($cpf) != 11) return false;
        if (preg_match('/(\d)\1{10}/', $cpf)) return false;
        for ($t = 9; $t < 11; $t++) {
            for ($d = 0, $c = 0; $c < $t; $c++) $d += $cpf[$c] * (($t + 1) - $c);
            $d = ((10 * $d) % 11) % 10;
            if ($cpf[$c] != $d) return false;
        }
        return true;
    }
}
