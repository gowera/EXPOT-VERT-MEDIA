import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ShieldCheck, Newspaper, Users, Mail } from 'lucide-react';
import { SITE } from '@/lib/identity';

const Soutenir = () => (
  <div className="min-h-screen pt-16 pb-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Soutenir Expo Vert Média</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">Une presse indépendante exige du temps, des déplacements et des moyens. Votre soutien protège l'information libre.</p>
      </div>
      <Card className="mb-12 gradient-rtct text-white"><CardContent className="p-8 md:p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Financez une information utile</h2>
        <p className="text-lg opacity-90 max-w-3xl mx-auto mb-8">Contribuez à des enquêtes locales, à des reportages environnementaux et à une couverture équilibrée de la RDC et du monde.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-white text-gray-900"><a href={`mailto:${SITE.email}?subject=Soutien à Expo Vert Média`}>Faire un don ou devenir partenaire</a></Button>
          <Button asChild size="lg" variant="outline" className="border-white bg-transparent text-white hover:bg-white hover:text-gray-900"><a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer">Nous écrire sur WhatsApp</a></Button>
        </div>
      </CardContent></Card>
      <div className="grid md:grid-cols-4 gap-6">
        {[
          [Heart, 'Don ponctuel', 'Aidez à financer un reportage ou une enquête.'],
          [Newspaper, 'Abonnement solidaire', 'Accompagnez la production éditoriale chaque mois.'],
          [ShieldCheck, 'Partenariat', 'Appuyez un projet indépendant avec transparence.'],
          [Users, 'Communauté', 'Partagez nos informations et proposez des sujets de terrain.'],
        ].map(([Icon, title, text]) => {
          const SupportIcon = Icon as React.ElementType;
          return <Card key={String(title)}><CardContent className="p-7 text-center"><SupportIcon className="h-9 w-9 mx-auto mb-4 text-rtct-green" /><h3 className="text-xl font-bold mb-2">{String(title)}</h3><p className="text-gray-600 text-sm">{String(text)}</p></CardContent></Card>;
        })}
      </div>
      <div className="mt-12 text-center">
        <Button asChild variant="outline"><a href={`mailto:${SITE.email}`}><Mail className="h-4 w-4 mr-2" />{SITE.email}</a></Button>
      </div>
    </div>
  </div>
);

export default Soutenir;
