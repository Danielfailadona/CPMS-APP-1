<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectMilestone;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::with(['manager', 'milestones', 'users'])
            ->where('manager_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'projects' => $projects->map(function ($project) {
                return [
                    'id' => $project->id,
                    'name' => $project->name,
                    'description' => $project->description,
                    'start_date' => $project->start_date->format('Y-m-d'),
                    'end_date' => $project->end_date->format('Y-m-d'),
                    'status' => $project->status,
                    'progress_percentage' => $project->progress_percentage,
                    'milestones_count' => $project->milestones->count(),
                    'completed_milestones' => $project->milestones->where('is_completed', true)->count(),
                    'assigned_users' => $project->users->count(),
                    'created_at' => $project->created_at->format('Y-m-d H:i:s'),
                    'debug_user_ids' => $project->users->pluck('id')->toArray()
                ];
            })
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'milestones' => 'required|array|min:1',
            'milestones.*.name' => 'required|string|max:255',
            'milestones.*.description' => 'nullable|string',
            'milestones.*.due_date' => 'nullable|date',
            'assigned_users' => 'nullable|array',
            'assigned_users.*' => 'exists:users,id'
        ]);

        $project = Project::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'manager_id' => Auth::id(),
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date']
        ]);

        // Create milestones
        foreach ($validated['milestones'] as $milestone) {
            $project->milestones()->create($milestone);
        }

        // Assign users
        if (!empty($validated['assigned_users'])) {
            $project->users()->attach($validated['assigned_users']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Project created successfully!',
            'project' => $project->load(['milestones', 'users'])
        ]);
    }

    public function getUsers()
    {
        $users = User::whereIn('user_type', ['client', 'foreman', 'staff']) // foreman displays as constructor
            ->where('is_active', true)
            ->select('id', 'name', 'email', 'user_type')
            ->get();

        return response()->json([
            'success' => true,
            'users' => $users
        ]);
    }

    public function updateMilestone(Request $request, $milestoneId)
    {
        $milestone = ProjectMilestone::whereHas('project', function ($query) {
            $query->where('manager_id', Auth::id());
        })->findOrFail($milestoneId);

        $validated = $request->validate([
            'is_completed' => 'required|boolean'
        ]);

        $milestone->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Milestone updated successfully!',
            'progress_percentage' => $milestone->project->progress_percentage
        ]);
    }

    // Admin methods
    public function getAllProjects()
    {
        $projects = Project::with(['manager', 'milestones', 'users'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'projects' => $projects->map(function ($project) {
                return [
                    'id' => $project->id,
                    'name' => $project->name,
                    'description' => $project->description,
                    'manager_name' => $project->manager ? $project->manager->name : 'No Manager',
                    'start_date' => $project->start_date->format('Y-m-d'),
                    'end_date' => $project->end_date->format('Y-m-d'),
                    'status' => $project->status,
                    'progress_percentage' => $project->progress_percentage,
                    'milestones_count' => $project->milestones->count(),
                    'completed_milestones' => $project->milestones->where('is_completed', true)->count(),
                    'assigned_users' => $project->users->count(),
                    'created_at' => $project->created_at->format('Y-m-d H:i:s')
                ];
            })
        ]);
    }

    public function getProject($id)
    {
        $project = Project::with(['manager', 'milestones', 'users'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'project' => [
                'id' => $project->id,
                'name' => $project->name,
                'description' => $project->description,
                'manager_name' => $project->manager ? $project->manager->name : 'No Manager',
                'start_date' => $project->start_date->format('Y-m-d'),
                'end_date' => $project->end_date->format('Y-m-d'),
                'status' => $project->status,
                'progress_percentage' => $project->progress_percentage,
                'assigned_users' => $project->users->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'user_type' => $user->user_type
                    ];
                })
            ]
        ]);
    }

    public function updateProjectUsers(Request $request, $id)
    {
        $project = Project::findOrFail($id);
        
        $validated = $request->validate([
            'assigned_users' => 'nullable|array',
            'assigned_users.*' => 'exists:users,id'
        ]);

        // Sync users (this will add new ones and remove old ones)
        $project->users()->sync($validated['assigned_users'] ?? []);

        return response()->json([
            'success' => true,
            'message' => 'Project users updated successfully!'
        ]);
    }
}