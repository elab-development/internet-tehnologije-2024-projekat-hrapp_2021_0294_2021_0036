<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PerformanceReview extends Model
{
    protected $fillable = [
        'employee_id', 'reviewer_id',
        'score', 'feedback'
    ];

    // WHO’S BEING REVIEWED
    public function employee()
    {
        return $this->belongsTo(User::class, 'employee_id');
    }

    // WHO REVIEWED (an HR or admin user)
    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }
}

