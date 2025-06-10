<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    protected $fillable = [
        'name', 'email', 'password',
        'role_id', 'department_id',
    ];

    // ROLE
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    // DEPARTMENT
    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    // REVIEWS OF THIS EMPLOYEE
    public function performanceReviews()
    {
        return $this->hasMany(PerformanceReview::class, 'employee_id');
    }

    // LEAVE REQUESTS BY THIS EMPLOYEE
    public function leaveRequests()
    {
        return $this->hasMany(LeaveRequest::class, 'employee_id');
    }
}

