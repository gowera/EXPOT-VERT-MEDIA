import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ConditionsUtilisation = () => {
  return (
    <div className="min-h-screen pt-20 pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Conditions d'Utilisation</h1>
          <p className="text-lg text-muted-foreground">Dernière mise à jour : Avril 2026</p>
        </div>

        <Card>
          <CardContent className="p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Acceptation des conditions</h2>
              <p className="text-muted-foreground leading-relaxed">
                En accédant et en utilisant le site web www.radiotayna.com, vous acceptez d'être lié par ces conditions d'utilisation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Description du service</h2>
              <p className="text-muted-foreground leading-relaxed">
                RTCT Goma (Radio Télévision Communautaire Tayna) est une radio communautaire émettant sur 88.1 MHz à Goma. Notre site web fournit des informations sur nos programmes, articles et services de diffusion en direct.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Propriété intellectuelle</h2>
              <p className="text-muted-foreground leading-relaxed">
                Tout le contenu présent sur ce site est la propriété de RTCT Goma ou de ses partenaires et est protégé par les lois sur le droit d'auteur.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Limitation de responsabilité</h2>
              <p className="text-muted-foreground leading-relaxed">
                RTCT Goma ne saurait être tenu responsable des dommages résultant de l'utilisation ou de l'impossibilité d'utiliser notre site ou nos services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Droit applicable</h2>
              <p className="text-muted-foreground leading-relaxed">
                Ces conditions sont régies par les lois de la République Démocratique du Congo. Tout litige sera soumis à la juridiction compétente de Goma, Nord-Kivu.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Contact</h2>
              <div className="text-muted-foreground space-y-2">
                <p><strong>Email :</strong> contact@radiotayna.com</p>
                <p><strong>Adresse :</strong> Ville de Goma, Nord-Kivu, RDC</p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConditionsUtilisation;
