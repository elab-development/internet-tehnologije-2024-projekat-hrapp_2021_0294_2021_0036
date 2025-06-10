<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\Role;
use App\Models\Department;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition()
    {
        // assume you’ve seeded some roles & departments
        return [
            'name'              => $this->faker->name(),
            'email'             => $this->faker->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password'          => bcrypt('password'), // or Hash::make(...)
            'remember_token'    => Str::random(10),
            'role_id'           => Role::inRandomOrder()->first()->id,
            'department_id'     => Department::inRandomOrder()->first()->id,
        ];
    }
}
