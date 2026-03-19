<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'job_id',
        'status',
        'applied_at',
        'personal_info',
        'resume_path',
        'work_experience',
        'education_info',
        'skills',
        'cover_letter',
        'additional_documents',
        'work_eligibility',
        'references',
        'online_profiles',
        'application_notes',
        'submitted_at',
    ];

    protected $casts = [
        'applied_at' => 'datetime',
        'submitted_at' => 'datetime',
        'personal_info' => 'array',
        'work_experience' => 'array',
        'education_info' => 'array',
        'skills' => 'array',
        'additional_documents' => 'array',
        'work_eligibility' => 'array',
        'references' => 'array',
        'online_profiles' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function job()
    {
        return $this->belongsTo(Job::class);
    }

    public function screeningResponses()
    {
        return $this->hasMany(ScreeningResponse::class);
    }
}
