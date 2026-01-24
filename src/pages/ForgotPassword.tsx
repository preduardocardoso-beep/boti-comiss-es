import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Mail, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { z } from 'zod';

const emailSchema = z.string().email('Por favor, insira um email válido.');

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const validateEmail = (email: string): boolean => {
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      toast({
        title: 'Email inválido',
        description: result.error.errors[0].message,
        variant: 'destructive',
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast({
        title: 'Campo obrigatório',
        description: 'Por favor, informe seu email.',
        variant: 'destructive',
      });
      return;
    }

    if (!validateEmail(email)) {
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) {
        let errorMessage = error.message;
        
        // Friendly error messages
        if (error.message.includes('rate limit')) {
          errorMessage = 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
        } else if (error.message.includes('not found')) {
          errorMessage = 'Email não encontrado em nossa base de dados.';
        }
        
        toast({
          title: 'Erro ao enviar email',
          description: errorMessage,
          variant: 'destructive',
        });
      } else {
        setEmailSent(true);
        toast({
          title: 'Email enviado!',
          description: 'Verifique seu e-mail para redefinir a senha.',
        });
      }
    } catch (err) {
      toast({
        title: 'Erro inesperado',
        description: 'Ocorreu um erro. Tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Success state - Email sent
  if (emailSent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md card-premium">
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Email Enviado!</h2>
            <p className="text-muted-foreground">
              Enviamos um link de recuperação para <strong className="text-foreground">{email}</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              Verifique sua caixa de entrada e spam. O link expira em 1 hora.
            </p>
            <div className="pt-4 space-y-2">
              <Button
                variant="outline"
                onClick={() => {
                  setEmailSent(false);
                  setEmail('');
                }}
                className="w-full"
              >
                Enviar novamente
              </Button>
              <Link to="/auth" className="block">
                <Button variant="ghost" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar ao login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md card-premium">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-xl gradient-primary flex items-center justify-center">
            <Mail className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">Recuperar Senha</CardTitle>
            <CardDescription className="text-muted-foreground">
              Digite seu email para receber o link de recuperação
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                autoComplete="email"
                autoFocus
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12" 
              disabled={loading || !email.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar Link de Recuperação
                </>
              )}
            </Button>
            <Link to="/auth" className="block">
              <Button
                type="button"
                variant="ghost"
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao login
              </Button>
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
