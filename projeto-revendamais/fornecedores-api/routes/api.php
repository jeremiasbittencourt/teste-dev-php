<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::apiResource('fornecedores', \App\Http\Controllers\FornecedorController::class);
Route::get('fornecedores/buscar/documento', [\App\Http\Controllers\FornecedorController::class, 'buscarPorDocumento']);
Route::patch('fornecedores/{id}/reativar', [\App\Http\Controllers\FornecedorController::class, 'reativar']);
