import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Youtube, Mail, Phone, MapPin, Send, Twitter, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import logoRtct from '@/assets/logo-evm.png';
import { SITE } from '@/lib/identity';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('newsletters')
        .insert([{ email }]);

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Email déjà inscrit",
            description: "Cet email est déjà inscrit à notre newsletter.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Inscription réussie !",
          description: "Vous recevrez nos dernières actualités par email.",
        });
        setEmail('');
      }
    } catch (error) {
      console.error('Erreur inscription newsletter:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return <footer className="bg-gray-900 text-white mb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo et Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="rounded-md bg-white p-2">
                <img src={logoRtct} alt="Expo Vert Média" className="h-10 w-auto" />
              </div>
              <span className="text-xl font-bold">Expo Vert Média</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Média numérique indépendant dédié à l'information, aux enquêtes et à la démocratie en RDC et dans le monde.
            </p>
            <div className="flex space-x-4">
              <a href={SITE.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-400 hover:text-green-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href={SITE.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-gray-400 hover:text-green-400 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
              <a href={SITE.twitter} target="_blank" rel="noopener noreferrer" aria-label="X" className="text-gray-400 hover:text-green-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-gray-400 hover:text-green-400 transition-colors">
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Navigation</h3>
            <nav className="space-y-2">
              <Link to="/" className="block text-gray-300 hover:text-white transition-colors text-sm">Accueil</Link>
              <Link to="/articles" className="block text-gray-300 hover:text-white transition-colors text-sm">Articles</Link>
              <Link to="/videos" className="block text-gray-300 hover:text-white transition-colors text-sm">Vidéos</Link>
              <Link to="/equipe" className="block text-gray-300 hover:text-white transition-colors text-sm">Équipe</Link>
            </nav>
          </div>

          {/* Informations légales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informations légales</h3>
            <nav className="space-y-2">
              <Link to="/mentions-legales" className="block text-gray-300 hover:text-white transition-colors text-sm">Mentions légales</Link>
              <Link to="/politique-confidentialite" className="block text-gray-300 hover:text-white transition-colors text-sm">Politique de confidentialité</Link>
              <Link to="/conditions-utilisation" className="block text-gray-300 hover:text-white transition-colors text-sm">Conditions d'utilisation</Link>
              <Link to="/contact" className="block text-gray-300 hover:text-white transition-colors text-sm">Contact</Link>
              <Link to="/soutenir" className="block text-gray-300 hover:text-white transition-colors text-sm">Soutenir</Link>
              <Link to="/a-propos" className="block text-gray-300 hover:text-white transition-colors text-sm">À propos</Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 mt-1 text-gray-400 flex-shrink-0" />
                <p className="text-gray-300 text-sm">
                  {SITE.address}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <a href="tel:+243970716002" className="text-gray-300 hover:text-white text-sm">{SITE.phone}</a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <a href={`mailto:${SITE.email}`} className="text-gray-300 hover:text-white transition-colors text-sm">
                  {SITE.email}
                </a>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Newsletter</h3>
            <p className="text-gray-300 text-sm">
              Recevez nos enquêtes, actualités et récapitulatifs directement par email.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <Input
                type="email"
                placeholder="Votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-rtct-green"
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                size="sm"
                className="w-full gradient-rtct text-white"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                    Inscription...
                  </>
                ) : (
                  <>
                    <Send className="h-3 w-3 mr-2" />
                    S'inscrire
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2026 Expo Vert Média. Tous droits réservés. Fierement concus par <a href="https://oredytech.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-green-400 transition-colors">Oredy TECHNOLOGIES</a>.
            </p>
            <p className="text-gray-400 text-sm">Kinshasa • RDC</p>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;
