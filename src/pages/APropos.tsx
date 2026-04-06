import React from 'react';

const APropos = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-rtct-green-dark to-rtct-green-light text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">À PROPOS DE RTCT GOMA</h1>
          <p className="text-xl opacity-90">Radio Télévision Communautaire Tayna - Pour la conservation de l'environnement</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">Notre Identité</h2>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Radio Télévision Communautaire Tayna (RTCT/GOMA)</strong> est une radio communautaire basée à Goma, dans l'est de la République démocratique du Congo. Elle sensibilise les communautés réservoirs des aires protégées de l'Est du Congo et du monde à contribuer à la conservation de l'environnement.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">Notre Mission</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Notre mission principale est de sensibiliser et mobiliser les communautés pour la protection de l'environnement et la conservation de la biodiversité :
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Sensibiliser les communautés à la conservation de l'environnement</li>
              <li>Promouvoir la protection des aires protégées de l'Est du Congo</li>
              <li>Favoriser l'accès à l'information fiable sur l'environnement</li>
              <li>Développer des liens entre les communautés locales et les acteurs de la conservation</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">Nos Valeurs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Conservation de l\'environnement', 'Engagement communautaire', 'Éducation et sensibilisation', 'Solidarité et résilience', 'Développement durable'].map((valeur, index) => (
                <div key={index} className="bg-card p-4 rounded-lg border">
                  <p className="font-semibold text-rtct-green">• {valeur}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">Nos Activités</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li><strong>Émissions de sensibilisation</strong> : programmes sur la conservation, la biodiversité et le développement durable</li>
              <li><strong>Campagnes communautaires</strong> pour la protection des aires protégées</li>
              <li><strong>Formation des communautés</strong> aux bonnes pratiques environnementales</li>
              <li><strong>Couverture médiatique</strong> des initiatives de conservation dans la région</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">Écouter RTCT</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nous diffusons sur la fréquence <strong>88.1 MHz</strong> à Goma et en direct sur :{' '}
              <a href="https://radiotayna.com" target="_blank" rel="noopener noreferrer" className="text-rtct-green hover:underline font-medium">
                www.radiotayna.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default APropos;
