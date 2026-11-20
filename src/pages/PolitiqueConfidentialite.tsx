import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PolitiqueConfidentialite = () => {
  return (
    <div className="min-h-screen pt-20 pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Politique de Confidentialité</h1>
          <p className="text-lg text-muted-foreground">Dernière mise à jour : Avril 2026</p>
        </div>

        <Card>
          <CardContent className="p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                Expo Vert Média (Radio Télévision Communautaire Tayna) s'engage à protéger votre vie privée. Cette politique explique comment nous collectons, utilisons et protégeons vos informations personnelles.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Informations collectées</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Nom, adresse e-mail lors de l'abonnement à notre newsletter</li>
                <li>Messages et commentaires soumis</li>
                <li>Données de navigation via Google Analytics</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Utilisation des informations</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Fournir et améliorer nos services</li>
                <li>Envoyer des newsletters et communications</li>
                <li>Analyser l'utilisation du site</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Vos droits</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Accéder à vos données personnelles</li>
                <li>Corriger ou supprimer vos données</li>
                <li>Vous désabonner de nos communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Contact</h2>
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

export default PolitiqueConfidentialite;
