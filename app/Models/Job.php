<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    use HasFactory;

    protected $fillable = [
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
    ];

    protected $casts = [
        'skills' => 'array',
    ];

    public function screeningQuestions()
    {
        return $this->hasMany(ScreeningQuestion::class)->orderBy('order');
    }

    public function applications()
    {
        return $this->hasMany(JobApplication::class);
    }
}
