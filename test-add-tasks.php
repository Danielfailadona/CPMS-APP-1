<?php

// Simple test script to add sample tasks
// Run this from the Laravel project root: php test-add-tasks.php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

try {
    // Check if users exist first
    $users = DB::table('users')->get();
    
    if ($users->count() < 2) {
        echo "Need at least 2 users in database to create tasks.\n";
        exit;
    }
    
    $worker = $users->first();
    $foreman = $users->skip(1)->first();
    
    // Add sample tasks
    $tasks = [
        [
            'title' => 'Install Foundation',
            'description' => 'Install concrete foundation for building A',
            'priority' => 'high',
            'status' => 'pending',
            'due_date' => '2025-02-15',
            'worker_id' => $worker->id,
            'foreman_id' => $foreman->id,
            'foreman_notes' => 'Check concrete quality before pouring',
            'created_at' => now(),
            'updated_at' => now()
        ],
        [
            'title' => 'Safety Inspection',
            'description' => 'Conduct weekly safety inspection of construction site',
            'priority' => 'urgent',
            'status' => 'in_progress',
            'due_date' => '2025-01-20',
            'worker_id' => $worker->id,
            'foreman_id' => $foreman->id,
            'foreman_notes' => 'Focus on scaffolding and electrical safety',
            'created_at' => now(),
            'updated_at' => now()
        ],
        [
            'title' => 'Material Delivery',
            'description' => 'Receive and organize steel beams delivery',
            'priority' => 'medium',
            'status' => 'completed',
            'due_date' => '2025-01-18',
            'worker_id' => $foreman->id,
            'foreman_id' => $worker->id,
            'completed_at' => now(),
            'created_at' => now(),
            'updated_at' => now()
        ]
    ];
    
    foreach ($tasks as $task) {
        DB::table('tasks')->insert($task);
        echo "Added task: {$task['title']}\n";
    }
    
    echo "Successfully added " . count($tasks) . " sample tasks!\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}