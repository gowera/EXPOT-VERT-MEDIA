import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SITE } from '@/lib/identity';

const ConditionsUtilisation = () => (
  <div className="min-h-screen pt-20 pb-8">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Conditions d'utilisation</h1>
        <p className="text-lg text-muted-foreground">Dernière mise à jour : novembre 2026</p>
      </div>
      <Card><CardContent className="p-8 space-y-6">
        <section><h2 className="text-2xl font-semibold mb-4">1. Acceptation</h2><p className="text-muted-foreground">En accédant à {SITE.url}, vous acceptez ces conditions d'utilisation.</p></section>
        <section><h2 className="text-2xl font-semibold mb-4">2. Service éditorial</h2><p className="text-muted-foreground">Expo Vert Média publie des actualités, reportages, analyses et contenus multimédias indépendants relatifs à la RDC et au monde.</p></section>
        <section><h2 className="text-2xl font-semibold mb-4">3. Propriété intellectuelle</h2><p className="text-muted-foreground">Les contenus originaux sont protégés. Toute réutilisation substantielle nécessite une autorisation écrite.</p></section>
        <section><h2 className="text-2xl font-semibold mb-4">4. Commentaires</h2><p className="text-muted-foreground">Les contributions doivent être respectueuses, pertinentes et conformes aux lois applicables. Expo Vert Média peut modérer les contenus abusifs.</p></section>
        <section><h2 className="text-2xl font-semibold mb-4">5. Responsabilité</h2><p className="text-muted-foreground">Le site est fourni avec diligence, sans garantie absolue de disponibilité continue ou d'exactitude des services tiers intégrés.</p></section>
        <section><h2 className="text-2xl font-semibold mb-4">6. Contact</h2><p className="text-muted-foreground">Email : {SITE.email}<br />Adresse : {SITE.address}</p></section>
      </CardContent></Card>
    </div>
  </div>
);

export default ConditionsUtilisation;
