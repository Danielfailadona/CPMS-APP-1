<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'description',
        'price',
        'category',
        'stock_quantity',
        'is_active'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'stock_quantity' => 'integer',
        'is_active' => 'boolean'
    ];

    public static function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'price' => 'required|numeric|min:0',
            'category' => 'required|string|max:100',
            'stock_quantity' => 'required|integer|min:0',
            'is_active' => 'boolean'
        ];
    }

    public static function updateRules()
    {
        return [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'price' => 'sometimes|required|numeric|min:0',
            'category' => 'sometimes|required|string|max:100',
            'stock_quantity' => 'sometimes|required|integer|min:0',
            'is_active' => 'boolean'
        ];
    }
}
