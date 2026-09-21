<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'industry',
        'website',
        'phone',
        'email',
        'location',
        'company_size',
        'description',
        'logo_url',
        'founded_year',
        'status',
    ];

    protected $casts = [
        'founded_year' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function jobs()
    {
        return $this->hasMany(Job::class);
    }

    public function applications()
    {
        return $this->hasManyThrough(JobApplication::class, Job::class);
    }
}
