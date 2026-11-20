import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Users, Target, Gift, Star, ArrowRight, CheckCircle, Lightbulb, Phone, Mail } from 'lucide-react';

const Soutenir = () => {
  const handleDonation = (type: string) => {
    window.open('https://www.paypal.com/donate', '_blank');
  };
  const handleContact = () => {
    window.location.href = 'mailto:contact@radiotayna.com?subject=Soutien Expo Vert Média';
  };

  const supportWays = [{
    icon: Heart, title: "Don ponctuel", description: "Soutenez nos projets avec un don unique",
    amount: "À partir de 5€", color: "bg-rtct-green-dark text-white",
    benefits: ["Soutien direct aux émissions", "Reconnaissance publique", "Newsletter exclusive"]
  }, {
    icon: Users, title: "Membre mensuel", description: "Devenez membre supporter avec un don mensuel",
    amount: "10€/mois", color: "bg-rtct-green text-white",
    benefits: ["Accès à du contenu exclusif", "Invitations aux événements", "Badge membre sur les réseaux"]
  }, {
    icon: Star, title: "Parrain Premium", description: "Parrainez une émission ou un projet spécifique",
    amount: "50€/mois", color: "bg-rtct-green-light text-white",
    benefits: ["Mention à l'antenne", "Rencontre avec l'équipe", "Rapport d'impact trimestriel"]
  }];

  const impact = [
    { number: "Monde entier", label: "Écoutés via notre site web", icon: Users },
    { number: "88.1 MHz", label: "Fréquence FM à Goma", icon: Target },
    { number: "25", label: "Émissions produites par semaine", icon: Star },
    { number: "100+", label: "Communautés sensibilisées", icon: Lightbulb }
  ];

  return <div className="min-h-screen pt-16 pb-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Soutenir Expo Vert Média</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Aidez-nous à sensibiliser les communautés à la conservation de l'environnement
        </p>
      </div>

      <Card className="mb-12 gradient-rtct overflow-hidden">
        <CardContent className="p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">🌿 Ensemble pour la conservation</h2>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            Expo Vert Média sensibilise les communautés réservoirs des aires protégées de l'Est du Congo à contribuer à la conservation de l'environnement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => handleDonation('hero')} className="bg-white text-gray-900 hover:bg-gray-100 px-8">💳 Faire un don maintenant</Button>
            <Button size="lg" variant="outline" onClick={handleContact} className="border-white text-white hover:text-gray-900 px-8 bg-white/0">📋 En savoir plus</Button>
          </div>
        </CardContent>
      </Card>

      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Comment nous soutenir</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {supportWays.map((way, index) => <Card key={index} className="hover-lift text-center">
            <CardContent className="p-8">
              <div className={`${way.color} p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center`}>
                <way.icon className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{way.title}</h3>
              <p className="text-gray-600 mb-4">{way.description}</p>
              <div className="text-2xl font-bold text-rtct-green mb-6">{way.amount}</div>
              <div className="space-y-2 mb-6">
                {way.benefits.map((benefit, idx) => <div key={idx} className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />{benefit}
                </div>)}
              </div>
              <Button onClick={() => handleDonation(way.title)} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Choisir cette option</Button>
            </CardContent>
          </Card>)}
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Notre Impact</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {impact.map((stat, index) => <Card key={index} className="text-center gradient-rtct-soft">
            <CardContent className="p-6">
              <stat.icon className="h-8 w-8 mx-auto mb-3 text-rtct-green" />
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </CardContent>
          </Card>)}
        </div>
      </div>

      <Card className="gradient-rtct-soft text-center">
        <CardContent className="p-8">
          <h3 className="text-3xl font-bold mb-6">Prêt à nous rejoindre ?</h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Chaque contribution nous aide à sensibiliser davantage de communautés à la conservation de l'environnement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => handleDonation('final')} className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">🌿 Faire un don</Button>
            <Button size="lg" variant="outline" onClick={handleContact} className="px-8">
              <Mail className="h-4 w-4 mr-2" />Nous contacter
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>;
};
export default Soutenir;
