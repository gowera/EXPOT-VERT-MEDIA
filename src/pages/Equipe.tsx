
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Twitter, Instagram, Linkedin, Mic, Headphones, Camera, Settings } from 'lucide-react';
import logoRtct from '@/assets/logo-evm.png';

const Equipe = () => {
  const direction = [
    { id: 1, name: "Direction éditoriale", role: "Direction générale", image: logoRtct },
  ];

  const animateurs = [
    { name: "Animateur 1", role: "Animateur et Chroniqueur" },
    { name: "Animateur 2", role: "Animateur et Chroniqueur" },
  ];

  const journalistes = [
    { name: "Journaliste 1", role: "Rédacteur en chef" },
    { name: "Journaliste 2", role: "Journaliste" },
  ];

  const techniciens = [
    { name: "Technicien 1", role: "Technicien", icon: Settings },
    { name: "Technicien 2", role: "Caméra", icon: Camera }
  ];

  return (
    <div className="min-h-screen pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Notre Équipe</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Rencontrez les voix et les talents qui donnent vie à Expo Vert Média chaque jour
          </p>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Direction</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {direction.map((member) => (
              <Card key={member.id} className="hover-lift overflow-hidden">
                <div className="relative">
                  <img src={member.image} alt={member.name} className="w-full h-64 object-cover" />
                  <div className="absolute top-4 right-4 bg-rtct-green text-white p-2 rounded-full">
                    <Mic className="h-5 w-5" />
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                  <p className="text-rtct-green font-medium">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Animateurs et Chroniqueurs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {animateurs.map((member, index) => (
              <Card key={index} className="hover-lift text-center">
                <CardContent className="p-6">
                  <div className="bg-gradient-to-r from-rtct-green-dark to-rtct-green p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Headphones className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{member.name}</h3>
                  <p className="text-rtct-green font-medium text-sm">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Journalistes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {journalistes.map((member, index) => (
              <Card key={index} className="hover-lift text-center">
                <CardContent className="p-6">
                  <div className="bg-gradient-to-r from-rtct-green-dark to-rtct-green p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Mic className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{member.name}</h3>
                  <p className="text-rtct-green font-medium text-sm">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Techniciens</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {techniciens.map((member, index) => (
              <Card key={index} className="hover-lift text-center">
                <CardContent className="p-8">
                  <div className="bg-gradient-to-r from-rtct-green-dark to-rtct-green p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <member.icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                  <p className="text-rtct-green font-medium mb-3">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="gradient-rtct">
          <CardContent className="p-8 text-center text-white">
            <h3 className="text-3xl font-bold mb-4">Un message à l'Équipe ?</h3>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Vous avez un mot à dire à notre Equipe ? Nous vous écouterons attentivement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">Contacter la technique</Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">Contacter la Rédaction</Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Nos Valeurs</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { title: "Conservation", desc: "Nous protégeons l'environnement et la biodiversité", emoji: "🌿" },
              { title: "Communauté", desc: "Nous travaillons avec et pour les communautés locales", emoji: "🤝" },
              { title: "Éducation", desc: "Nous sensibilisons à travers l'information", emoji: "📚" },
              { title: "Proximité", desc: "Nous restons proches de nos auditeurs", emoji: "❤️" }
            ].map((value, index) => (
              <Card key={index} className="text-center gradient-rtct-soft">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{value.emoji}</div>
                  <h4 className="font-bold text-lg mb-2">{value.title}</h4>
                  <p className="text-gray-600 text-sm">{value.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Equipe;
