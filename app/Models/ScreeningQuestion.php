<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ScreeningQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'job_id',
        'question_text',
        'question_type',
        'options',
        'required',
        'order',
    ];

    protected $casts = [
        'options' => 'array',
        'required' => 'boolean',
    ];

    public function job()
    {
        return $this->belongsTo(Job::class);
    }

    public function responses()
    {
        return $this->hasMany(ScreeningResponse::class);
    }
}
