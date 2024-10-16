<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

class TechnicianController extends Controller
{
    public function approval()
    {
        return Inertia::render('Technician/Approval/Index');
    }
}
