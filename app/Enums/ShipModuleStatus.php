<?php

namespace App\Enums;

enum ShipModuleStatus: string
{
    case Active = 'active';
    case Damaged = 'damaged';
    case Offline = 'offline';
}
