import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MentionsLegales = () => {
  return (
    <div className="min-h-screen pt-20 pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Mentions Légales</h1>
          <p className="text-lg text-muted-foreground">Informations légales et éditoriales</p>
        </div>

        <Card>
          <CardContent className="p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Informations sur l'éditeur</h2>
              <div className="text-muted-foreground space-y-2">
                <p><strong>Nom de l'organisation :</strong> Radio Télévision Communautaire Tayna (RTCT/GOMA)</p>
                <p><strong>Statut :</strong> Radio communautaire</p>
                <p><strong>Fréquence :</strong> 88.1 MHz</p>
                <p><strong>Adresse :</strong> Ville de Goma, Nord-Kivu, RDC</p>
                <p><strong>Pays :</strong> République Démocratique du Congo</p>
                <p><strong>Email :</strong> contact@radiotayna.com</p>
                <p><strong>Site web :</strong> www.radiotayna.com</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Directeur de la publication</h2>
              <div className="text-muted-foreground space-y-2">
                <p><strong>Responsable éditorial :</strong> Direction de RTCT Goma</p>
                <p><strong>Email :</strong> contact@radiotayna.com</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Hébergement et développement du site</h2>
              <div className="text-muted-foreground space-y-2">
                <p><strong>Développement :</strong> Site créé avec Lovable (https://lovable.dev)</p>
                <p><strong>APIs utilisées :</strong> WordPress (articles), YouTube (vidéos)</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Propriété intellectuelle</h2>
              <p className="text-muted-foreground leading-relaxed">
                L'ensemble du contenu présent sur ce site web est la propriété exclusive de RTCT Goma, sauf mention contraire. Toute reproduction est interdite sans autorisation écrite préalable.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Conditions d'utilisation</h2>
              <p className="text-muted-foreground leading-relaxed">
                L'utilisation du site www.radiotayna.com implique l'acceptation pleine et entière des conditions générales d'utilisation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Protection des données personnelles</h2>
              <p className="text-muted-foreground leading-relaxed">
                RTCT Goma s'engage à protéger la vie privée des utilisateurs de son site. Aucune information personnelle n'est collectée à l'insu des utilisateurs, ni cédée à des tiers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Droit applicable</h2>
              <p className="text-muted-foreground leading-relaxed">
                Tout litige est soumis au droit de la République Démocratique du Congo. Juridiction compétente : tribunaux de Goma, Nord-Kivu.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Contact</h2>
              <div className="text-muted-foreground space-y-2">
                <p><strong>Par email :</strong> contact@radiotayna.com</p>
                <p><strong>Par courrier :</strong> RTCT Goma, Ville de Goma, Nord-Kivu, RDC</p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MentionsLegales;
