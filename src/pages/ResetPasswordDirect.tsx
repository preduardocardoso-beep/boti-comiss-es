import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { KeyRound, Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react';

const ResetPasswordDirect = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailTrim = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailTrim || !emailRegex.test(emailTrim)) {
      toast({ title: 'E-mail inválido', description: 'Informe um e-mail válido.', variant: 'destructive' });
      return;
    }
    if (password.length < 8) {
      toast({ title: 'Senha muito curta', description: 'A senha deve ter no mínimo 8 caracteres.', variant: 'destructive' });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: 'Senhas diferentes', description: 'A confirmação não confere.', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('reset-password-direct', {
        body: { email: emailTrim, password },
      });

      if (error || (data && (data as any).error)) {
        const msg = (data as any)?.error || error?.message || 'Erro ao redefinir senha.';
        const friendly = msg.includes('não encontrado') ? 'E-mail não encontrado.' : msg;
        toast({ title: 'Não foi possível redefinir', description: friendly, variant: 'destructive' });
        return;
      }

      toast({ title: 'Senha alterada com sucesso.', description: 'Redirecionando para o login...' });
      setTimeout(() => navigate('/auth'), 1500);
    } catch (err: any) {
      toast({ title: 'Erro inesperado', description: err.message || 'Tente novamente.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md card-premium">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-xl gradient-primary flex items-center justify-center">
            <KeyRound className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">Redefinir Senha</CardTitle>
            <CardDescription className="text-muted-foreground">
              Informe seu e-mail e defina uma nova senha
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">E-mail</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reset-password">Nova senha</Label>
              <div className="relative">
                <Input
                  id="reset-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 8 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="pr-10"
                  autoComplete="new-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reset-confirm">Confirmar nova senha</Label>
              <Input
                id="reset-confirm"
                type={showPassword ? 'text' : 'password'}
                placeholder="Digite novamente"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                autoComplete="new-password"
              />
            </div>

            <Button type="submit" className="w-full h-12" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <KeyRound className="h-4 w-4 mr-2" />
                  Salvar nova senha
                </>
              )}
            </Button>

            <Link to="/auth" className="block">
              <Button type="button" variant="link" className="w-full text-muted-foreground hover:text-primary">
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

export default ResetPasswordDirect;
