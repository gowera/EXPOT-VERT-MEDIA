import React from 'react';
import { RUBRIQUES } from '@/lib/articles';

const APropos = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-rtct-green-dark to-rtct-green-light text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">À PROPOS D’EXPO VERT MÉDIA</h1>
          <p className="text-xl opacity-90">Un œil sur le monde</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">Notre Identité</h2>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Expo Vert Média</strong> est un média numérique indépendant basé à Kinshasa, en République démocratique du Congo. Il collecte, traite et diffuse des informations vérifiées en RDC et à l’international.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">Notre Mission</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Notre mission est d’informer avec rigueur et proximité :
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Collecter les faits sur le terrain et auprès de sources fiables</li>
              <li>Produire des analyses indépendantes pour les publics congolais et internationaux</li>
              <li>Rendre compte des enjeux environnementaux, démocratiques et sociaux</li>
              <li>Donner de la visibilité aux initiatives citoyennes et aux territoires</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">Nos 9 rubriques éditoriales</h2>
            <ol className="grid grid-cols-1 md:grid-cols-2 gap-3 list-decimal pl-6">
              {RUBRIQUES.map((rubrique) => (
                <li key={rubrique} className="bg-card p-4 rounded-lg border font-semibold text-rtct-green">{rubrique}</li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
};

export default APropos;
