<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourseVideo extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'title',
        'url',
        'duration',
        'sequence',
        'description',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function completions()
    {
        return $this->hasMany(VideoCompletion::class);
    }

    public function isCompletedBy($userId)
    {
        return $this->completions()
            ->where('user_id', $userId)
            ->exists();
    }
}
