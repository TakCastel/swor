import { Button } from '@/components/ui/button';
import { Head } from '@inertiajs/react';

export default function Welcome() {
    return (
        <>
            <Head title="Accueil" />
            <div className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
                <div className="w-full max-w-2xl space-y-8 text-center">
                    <div className="space-y-3">
                        <p className="text-xs font-bold uppercase tracking-[0.35em] text-yellow-500">
                            Migration Laravel
                        </p>
                        <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
                            Swor
                        </h1>
                        <p className="mx-auto max-w-lg text-zinc-400">
                            Portail vers vos aventures Star Wars Roleplay — monolithe Laravel + Inertia +
                            React.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Button variant="era-yellow">Entrer dans la galaxie</Button>
                        <Button variant="secondary">Documentation ADR</Button>
                    </div>

                    <p className="text-xs text-zinc-600">
                        Composant <code className="text-yellow-500/80">Button</code> porté depuis{' '}
                        <code className="text-zinc-500">front/src/shared/components/ui/Button.tsx</code>
                    </p>
                </div>
            </div>
        </>
    );
}
