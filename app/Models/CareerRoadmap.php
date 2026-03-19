<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CareerRoadmap extends Model
{
    protected $fillable = [
        'user_id',
        'target_job_title',
        'skills_snapshot',
        'guidance_text',
        'ai_response',
        'roadmap_json',
    ];

    protected $casts = [
        'skills_snapshot' => 'array',
        'roadmap_json' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
