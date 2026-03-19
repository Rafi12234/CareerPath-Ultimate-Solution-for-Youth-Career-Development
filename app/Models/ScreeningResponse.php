<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ScreeningResponse extends Model
{
    use HasFactory;

    protected $fillable = [
        'job_application_id',
        'screening_question_id',
        'response_text',
    ];

    public function application()
    {
        return $this->belongsTo(JobApplication::class, 'job_application_id');
    }

    public function screeningQuestion()
    {
        return $this->belongsTo(ScreeningQuestion::class);
    }
}
