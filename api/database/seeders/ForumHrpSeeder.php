<?php

namespace Database\Seeders;

use App\Enums\ForumType;
use App\Enums\UserRole;
use App\Models\Forum;
use Illuminate\Database\Seeder;

class ForumHrpSeeder extends Seeder
{
    public function run(): void
    {
        $forums = [
            ['category_id' => 1, 'name' => 'Annonces', 'description' => 'Les dernières nouvelles du front et du projet.', 'type' => ForumType::Forum, 'display_order' => 1],
            ['category_id' => 1, 'name' => 'Présentations', 'description' => 'Faites-vous connaître de la galaxie.', 'type' => ForumType::Forum, 'display_order' => 2],
            ['category_id' => 1, 'name' => 'Création de personnage', 'description' => 'Lieu de naissance des futures légendes.', 'type' => ForumType::Forum, 'display_order' => 3],
            ['category_id' => 5, 'name' => 'Discussions', 'description' => 'Parler de tout et de rien (HRP).', 'type' => ForumType::Forum, 'display_order' => 1],
            ['category_id' => 5, 'name' => 'Suggestions', 'description' => 'Aidez-nous à améliorer votre expérience.', 'type' => ForumType::Forum, 'display_order' => 2],
            ['category_id' => 5, 'name' => 'Signaler un bug', 'description' => 'Rapportez les anomalies techniques ici.', 'type' => ForumType::Forum, 'display_order' => 3],
            ['category_id' => 6, 'name' => 'Modérateurs', 'description' => 'Coordination de la modération et des Smodos.', 'type' => ForumType::Forum, 'required_role' => UserRole::Moderator, 'display_order' => 1],
            ['category_id' => 6, 'name' => 'Administrateurs', 'description' => 'Décisions de haut niveau et gestion technique.', 'type' => ForumType::Forum, 'required_role' => UserRole::Admin, 'display_order' => 2],
            ['category_id' => 7, 'name' => 'Archives Galactiques', 'description' => "Le passé de la galaxie, préservé pour l'éternité.", 'type' => ForumType::Forum, 'display_order' => 1],
        ];

        foreach ($forums as $forum) {
            Forum::query()->firstOrCreate(
                [
                    'category_id' => $forum['category_id'],
                    'name' => $forum['name'],
                ],
                $forum,
            );
        }
    }
}
