<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        "id",
        'name',
        'email',
        'password',
        'avatar',
        'phone',
        'date_of_birth',
        'gender',
        'marital_status',
        'nationality',
        'location',
        'bio',
        'headline',
        'present_address',
        'permanent_address',
        'highest_education',
        'institution_name',
        'field_of_study',
        'graduation_year',
        'result_grade',
        'years_of_experience',
        'current_job_title',
        'current_company',
        'previous_job_title',
        'previous_company',
        'previous_job_start',
        'previous_job_end',
        'previous_job_description',
        'school_name',
        'ssc_year',
        'ssc_result',
        'ssc_group',
        'ssc_board',
        'education_board',
        'education_group',
        'college_name',
        'hsc_year',
        'hsc_result',
        'hsc_group',
        'hsc_board',
        'university_name',
        'university_status',
        'current_study_year',
        'current_study_semester',
        'university_graduation_year',
        'university_cgpa',
        'is_fresher',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'previous_job_start' => 'date',
        'previous_job_end' => 'date',
        'graduation_year' => 'integer',
        'years_of_experience' => 'integer',
        'ssc_year' => 'integer',
        'hsc_year' => 'integer',
        'current_study_year' => 'integer',
        'current_study_semester' => 'integer',
        'university_graduation_year' => 'integer',
        'is_fresher' => 'boolean',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function posts()
    {
        return $this->hasMany(Post::class); // One user has many posts
    }

    public function skills()
    {
        return $this->hasMany(UserSkill::class);
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    public function applications()
    {
        return $this->hasMany(JobApplication::class);
    }

    public function mockInterviewTurns()
    {
        return $this->hasMany(MockInterviewTurn::class);
    }
}