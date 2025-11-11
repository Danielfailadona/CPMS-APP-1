<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class CrudController extends Controller
{
    /**
     * Generic method to handle CRUD for any table
     */
    
    // READ ALL - Get all records from any table
    public function index($table)
    {
        try {
            $records = DB::table($table)->get();
            return response()->json([
                'success' => true,
                'data' => $records,
                'message' => 'All records retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving records: ' . $e->getMessage()
            ], 500);
        }
    }

    // READ ONE - Get single record from any table
    public function show($table, $id)
    {
        try {
            $record = DB::table($table)->where('id', $id)->first();
            
            if (!$record) {
                return response()->json([
                    'success' => false,
                    'message' => 'Record not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $record
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving record: ' . $e->getMessage()
            ], 500);
        }
    }

    // CREATE - Insert new record into any table with model validation
    public function store(Request $request, $table)
    {
        try {
            // Try to use model validation if model exists
            $modelClass = 'App\\Models\\' . ucfirst($table === 'products' ? 'Product' : $table);
            
            if (class_exists($modelClass) && method_exists($modelClass, 'rules')) {
                $request->validate($modelClass::rules());
                
                // Use Eloquent model
                $model = new $modelClass();
                $record = $model->create($request->all());
                
                return response()->json([
                    'success' => true,
                    'message' => 'Record created successfully with validation',
                    'id' => $record->id,
                    'data' => $record
                ]);
            }
            
            // Fallback to original DB method
            $data = $request->all();
            
            // Get actual table columns
            $tableColumns = DB::getSchemaBuilder()->getColumnListing($table);
            
            // Filter data to only include existing columns
            $filteredData = array_filter($data, function($key) use ($tableColumns) {
                return in_array($key, $tableColumns);
            }, ARRAY_FILTER_USE_KEY);
            
            // Auto-hash password fields if they exist and are in the table
            if (isset($filteredData['password']) && in_array('password', $tableColumns)) {
                $filteredData['password'] = Hash::make($filteredData['password']);
            }
            
            // Set timestamps if they exist in the table
            if (in_array('created_at', $tableColumns) && in_array('updated_at', $tableColumns)) {
                $filteredData['created_at'] = now();
                $filteredData['updated_at'] = now();
            }

            $id = DB::table($table)->insertGetId($filteredData);

            return response()->json([
                'success' => true,
                'message' => 'Record created successfully',
                'id' => $id,
                'data' => $filteredData
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating record: ' . $e->getMessage()
            ], 500);
        }
    }

    // UPDATE - Update record in any table with model validation
    public function update(Request $request, $table, $id)
    {
        try {
            // Try to use model validation if model exists
            $modelClass = 'App\\Models\\' . ucfirst($table === 'products' ? 'Product' : $table);
            
            if (class_exists($modelClass) && method_exists($modelClass, 'updateRules')) {
                $request->validate($modelClass::updateRules());
                
                // Use Eloquent model
                $record = $modelClass::findOrFail($id);
                $record->update($request->all());
                
                return response()->json([
                    'success' => true,
                    'message' => 'Record updated successfully with validation',
                    'id' => $id,
                    'data' => $record
                ]);
            }
            
            // Fallback to original DB method
            $data = $request->all();
            
            // Check if record exists
            $existing = DB::table($table)->where('id', $id)->first();
            if (!$existing) {
                return response()->json([
                    'success' => false,
                    'message' => 'Record not found'
                ], 404);
            }

            // Get actual table columns
            $tableColumns = DB::getSchemaBuilder()->getColumnListing($table);
            
            // Filter data to only include existing columns
            $filteredData = array_filter($data, function($key) use ($tableColumns) {
                return in_array($key, $tableColumns);
            }, ARRAY_FILTER_USE_KEY);

            // Auto-hash password fields if they exist and are being updated
            if (isset($filteredData['password']) && in_array('password', $tableColumns)) {
                $filteredData['password'] = Hash::make($filteredData['password']);
            }
            
            // Update timestamp if it exists
            if (in_array('updated_at', $tableColumns)) {
                $filteredData['updated_at'] = now();
            }

            DB::table($table)->where('id', $id)->update($filteredData);

            return response()->json([
                'success' => true,
                'message' => 'Record updated successfully',
                'id' => $id
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating record: ' . $e->getMessage()
            ], 500);
        }
    }

    // DELETE - Delete record from any table
    public function destroy($table, $id)
    {
        try {
            $existing = DB::table($table)->where('id', $id)->first();
            if (!$existing) {
                return response()->json([
                    'success' => false,
                    'message' => 'Record not found'
                ], 404);
            }

            DB::table($table)->where('id', $id)->delete();

            return response()->json([
                'success' => true,
                'message' => 'Record deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting record: ' . $e->getMessage()
            ], 500);
        }
    }

    // GET TABLE COLUMNS - Useful for dynamic forms
    public function getColumns($table)
    {
        try {
            $columns = DB::getSchemaBuilder()->getColumnListing($table);
            return response()->json([
                'success' => true,
                'columns' => $columns
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error getting table columns: ' . $e->getMessage()
            ], 500);
        }
    }
}