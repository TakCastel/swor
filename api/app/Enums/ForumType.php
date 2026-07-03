<?php

namespace App\Enums;

enum ForumType: string
{
    case Category = 'category';
    case Region = 'region';
    case Sector = 'sector';
    case Planet = 'planet';
    case Location = 'location';
    case Forum = 'forum';
}
