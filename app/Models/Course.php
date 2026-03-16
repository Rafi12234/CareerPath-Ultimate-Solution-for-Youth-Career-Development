<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'topic',
        'instructor',
        'duration',
        'level',
    ];

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    public function videos()
    {
        return $this->hasMany(CourseVideo::class)->orderBy('sequence');
    }
}
