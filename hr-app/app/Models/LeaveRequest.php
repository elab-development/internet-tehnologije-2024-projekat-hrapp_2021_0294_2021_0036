<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeaveRequest extends Model
{
    protected $fillable = [
        'employee_id', 'hr_worker_id',
        'start_date', 'end_date', 'status'
    ];

    // REQUESTOR
    public function employee()
    {
        return $this->belongsTo(User::class, 'employee_id');
    }

    // WHO WILL PROCESS/APPROVE
    public function hrWorker()
    {
        return $this->belongsTo(User::class, 'hr_worker_id');
    }
}
