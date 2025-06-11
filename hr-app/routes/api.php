<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\LeaveRequestController;

Route::post('/register',[AuthController::class,'register']);
Route::post('/login', [AuthController::class, 'login']);

//zasticena grupna ruta
Route::group(['middleware' => ['auth:sanctum']], function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);

    // Leave Requests
    Route::get('/leave-requests',                     [LeaveRequestController::class, 'index']);
    Route::get('/leave-requests/{id}',                [LeaveRequestController::class, 'show']);
    Route::post('/leave-requests',                    [LeaveRequestController::class, 'store']);
    Route::put('/leave-requests/{id}',                [LeaveRequestController::class, 'update']);
    Route::patch('/leave-requests/{id}/status',       [LeaveRequestController::class, 'updateStatus']);
    Route::delete('/leave-requests/{id}',             [LeaveRequestController::class, 'destroy']);
});