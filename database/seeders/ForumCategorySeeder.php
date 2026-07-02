<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\ForumCategory;
use Illuminate\Database\Seeder;

class ForumCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['id' => 1, 'name' => 'Holonews', 'description' => 'Communications officielles et informations vitales.', 'era' => null, 'required_role' => null, 'display_order' => 1],
            ['id' => 2, 'name' => 'Guerre des Clones', 'description' => 'Un conflit galactique total opposant la République Galactique à la Confédération des Systèmes Indépendants (CSI).', 'era' => 'Old Republic', 'required_role' => null, 'display_order' => 10],
            ['id' => 3, 'name' => 'Guerre Civile Galactique', 'description' => "L'ombre de l'Empire Galactique s'étend sur la galaxie, étouffant toute velléité de liberté sous une poigne de fer.", 'era' => 'Galactic Empire', 'required_role' => null, 'display_order' => 20],
            ['id' => 4, 'name' => 'Nouvelle République', 'description' => "La galaxie respire à nouveau, mais son souffle est encore court. Sur les ruines de l'Empire Galactique, la Nouvelle République tente de tisser une toile d'espoir et de justice.", 'era' => 'New Republic', 'required_role' => null, 'display_order' => 30],
            ['id' => 5, 'name' => 'Social', 'description' => 'Echanges entre joueurs et support.', 'era' => null, 'required_role' => null, 'display_order' => 40],
            ['id' => 6, 'name' => 'Administratif', 'description' => "Espaces réservés à l'équipe du forum.", 'era' => null, 'required_role' => UserRole::Moderator, 'display_order' => 100],
            ['id' => 7, 'name' => 'Archives', 'description' => 'Anciens messages et archives de la galaxie.', 'era' => null, 'required_role' => null, 'display_order' => 150],
        ];

        foreach ($categories as $category) {
            ForumCategory::query()->updateOrCreate(
                ['id' => $category['id']],
                $category,
            );
        }
    }
}
