<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'title',
        'company',
        'location',
        'type',
        'level',
        'description',
        'salary_min',
        'salary_max',
        'track',
        'skills',
        'status',
        'application_deadline',
        'vacancies',
    ];

    protected $casts = [
        'skills' => 'array',
        'application_deadline' => 'date',
        'vacancies' => 'integer',
    ];

public function employerCompany()
{
    return $this->belongsTo(Company::class, 'company_id');
}

    public function screeningQuestions()
    {
        return $this->hasMany(ScreeningQuestion::class)->orderBy('order');
    }

    public function applications()
    {
        return $this->hasMany(JobApplication::class);
    }
}
