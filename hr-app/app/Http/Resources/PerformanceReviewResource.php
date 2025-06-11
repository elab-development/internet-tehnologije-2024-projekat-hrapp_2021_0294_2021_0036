<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PerformanceReviewResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,

            'employee' => [
                'id'   => $this->employee->id,
                'name' => $this->employee->name,
            ],

            'reviewer' => [
                'id'   => $this->reviewer->id,
                'name' => $this->reviewer->name,
            ],

            'score'      => $this->score,
            'feedback'   => $this->feedback,
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),
        ];
    }
}
