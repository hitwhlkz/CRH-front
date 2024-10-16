<?php

use App\Http\Controllers\TechnicianController;
use Illuminate\Support\Facades\Route;

Route::get('/technician/approval', [TechnicianController::class, 'approval'])->name('technician.approval');

