import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, MessageCircle, Send, Facebook, Youtube, Twitter } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { SITE } from '@/lib/identity';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    const subject = encodeURIComponent(formData.subject);
    const body = encodeURIComponent(`${formData.message}\n\n${formData.name}\n${formData.email}`);
    window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
    toast({ title: 'Votre messagerie va s’ouvrir', description: 'Vérifiez puis envoyez votre message depuis votre boîte mail.' });
    setIsSubmitting(false);
  };
  return (
    <div className="min-h-screen pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10"><h1 className="text-4xl font-bold mb-4">Contactez la rédaction</h1><p className="text-xl text-gray-600">Proposez un sujet, une enquête ou envoyez une information vérifiable.</p></div>
        <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
          <Card><CardHeader><CardTitle className="flex items-center"><MessageCircle className="h-5 w-5 mr-2 text-rtct-green" />Envoyer un message</CardTitle></CardHeader><CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <Input required aria-label="Nom" placeholder="Nom complet" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                <Input required type="email" aria-label="Email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <Input required aria-label="Sujet" placeholder="Sujet" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} />
              <Textarea required aria-label="Message" placeholder="Votre message..." rows={7} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
              <Button type="submit" disabled={isSubmitting} className="gradient-rtct text-white w-full"><Send className="h-4 w-4 mr-2" />Envoyer</Button>
            </form>
          </CardContent></Card>
          <div className="space-y-5">
            <Card><CardContent className="p-6 space-y-5">
              <div className="flex gap-3"><Mail className="h-5 w-5 text-rtct-green" /><div><h3 className="font-bold">Email</h3><a className="text-sm text-gray-600" href={`mailto:${SITE.email}`}>{SITE.email}</a></div></div>
              <div className="flex gap-3"><Phone className="h-5 w-5 text-rtct-green" /><div><h3 className="font-bold">Téléphone</h3><p className="text-sm text-gray-600">{SITE.phone}</p></div></div>
              <div className="flex gap-3"><MapPin className="h-5 w-5 text-rtct-green" /><div><h3 className="font-bold">Adresse</h3><p className="text-sm text-gray-600">{SITE.address}</p></div></div>
            </CardContent></Card>
            <Card><CardContent className="p-6"><h3 className="font-bold mb-4">Suivez-nous</h3><div className="grid grid-cols-2 gap-3">
              <Button asChild variant="outline"><a href={SITE.facebook} target="_blank" rel="noopener noreferrer"><Facebook className="h-4 w-4 mr-2" />Facebook</a></Button>
              <Button asChild variant="outline"><a href={SITE.youtube} target="_blank" rel="noopener noreferrer"><Youtube className="h-4 w-4 mr-2" />YouTube</a></Button>
              <Button asChild variant="outline"><a href={SITE.twitter} target="_blank" rel="noopener noreferrer"><Twitter className="h-4 w-4 mr-2" />X / Twitter</a></Button>
              <Button asChild variant="outline"><a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle className="h-4 w-4 mr-2" />WhatsApp</a></Button>
            </div></CardContent></Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
