<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MockInterviewTurn extends Model
{
    protected $fillable = [
        'user_id',
        'topic',
        'turn_number',
        'question',
        'answer',
        'feedback',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}