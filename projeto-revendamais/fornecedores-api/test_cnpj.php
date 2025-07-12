<?php

require_once 'vendor/autoload.php';

// Simular a função de validação CNPJ
function validaCNPJ($cnpj)
{
    $cnpj = preg_replace('/\D/', '', $cnpj);
    if (strlen($cnpj) != 14) return false;
    if (preg_match('/(\d)\1{13}/', $cnpj)) return false;
    
    // Primeiro dígito verificador
    $t = [5,4,3,2,9,8,7,6,5,4,3,2];
    for ($i = 0, $s = 0; $i < 12; $i++) {
        $s += $cnpj[$i] * $t[$i];
    }
    $d1 = ($s % 11 < 2) ? 0 : 11 - $s % 11;
    if ($cnpj[12] != $d1) return false;
    
    // Segundo dígito verificador
    $t = [6,5,4,3,2,9,8,7,6,5,4,3,2];
    for ($i = 0, $s = 0; $i < 13; $i++) {
        $s += $cnpj[$i] * $t[$i];
    }
    $d2 = ($s % 11 < 2) ? 0 : 11 - $s % 11;
    return $cnpj[13] == $d2;
}

// Testar
echo "Testando validação CNPJ...\n";
echo "CNPJ válido: " . (validaCNPJ('00000000000191') ? 'SIM' : 'NÃO') . "\n";
echo "CNPJ inválido: " . (validaCNPJ('00000000000190') ? 'SIM' : 'NÃO') . "\n"; 