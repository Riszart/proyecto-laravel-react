<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('categorias')->insert([
            ['id' => 1, 'nombre' => 'Computadoras'],
            ['id' => 2, 'nombre' => 'Accesorios'],
        ]);

        DB::table('productos')->insert([
            ['nombre' => 'Laptop', 'precio' => 2500, 'stock' => 5, 'categoria_id' => 1],
            ['nombre' => 'Mouse', 'precio' => 80, 'stock' => 15, 'categoria_id' => 2],
            ['nombre' => 'Teclado Mecánico', 'precio' => 220, 'stock' => 8, 'categoria_id' => 2],
        ]);
    }
}