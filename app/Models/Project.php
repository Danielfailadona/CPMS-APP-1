<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'manager_id',
        'start_date',
        'end_date',
        'status'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function manager()
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'project_users');
    }

    public function milestones()
    {
        return $this->hasMany(ProjectMilestone::class);
    }

    public function uploads()
    {
        return $this->hasMany(Upload::class);
    }

    public function getProgressPercentageAttribute()
    {
        $totalMilestones = $this->milestones()->count();
        if ($totalMilestones === 0) return 0;
        
        $completedMilestones = $this->milestones()->where('is_completed', true)->count();
        return round(($completedMilestones / $totalMilestones) * 100, 2);
    }
}