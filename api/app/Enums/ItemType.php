<?php

namespace App\Enums;

enum ItemType: string
{
    case Weapon = 'weapon';
    case Armor = 'armor';
    case Consumable = 'consumable';
    case Tool = 'tool';
    case Misc = 'misc';
}
