<?php

namespace App\Enums;

enum ShipModuleType: string
{
    case Engine = 'engine';
    case Shield = 'shield';
    case Weapon = 'weapon';
    case Utility = 'utility';
}
