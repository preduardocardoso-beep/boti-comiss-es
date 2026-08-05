import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { LogIn, UserPlus, Loader2, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import loginLuxe from '@/assets/login-luxe.jpg';

const Auth = () => {
  const [email, setEmail] = useState(() => localStorage.getItem('rv_saved_email') || '');
  const [password, setPassword] = useState(() => localStorage.getItem('rv_saved_password') || '');
  const [rememberMe, setRememberMe] = useState(() => localStorage.getItem('rv_remember_me') === 'true');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha email e senha.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: 'Erro ao entrar',
        description: error.message === 'Invalid login credentials'
          ? 'Email ou senha incorretos.'
          : error.message,
        variant: 'destructive',
      });
    } else {
      if (rememberMe) {
        localStorage.setItem('rv_saved_email', email);
        localStorage.setItem('rv_saved_password', password);
        localStorage.setItem('rv_remember_me', 'true');
      } else {
        localStorage.removeItem('rv_saved_email');
        localStorage.removeItem('rv_saved_password');
        localStorage.removeItem('rv_remember_me');
      }
      toast({
        title: 'Bem-vindo!',
        description: 'Login realizado com sucesso.',
      });
      navigate('/');
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha email e senha.',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Senha muito curta',
        description: 'A senha deve ter pelo menos 6 caracteres.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      toast({
        title: 'Erro ao cadastrar',
        description: error.message === 'User already registered'
          ? 'Este email já está cadastrado. Tente fazer login.'
          : error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Cadastro realizado!',
        description: 'Você já pode começar a usar o sistema.',
      });
      navigate('/');
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Fundo ultrarrealista */}
      <img
        src={loginLuxe}
        alt="Textura de seda em tom ameixa com detalhes dourados"
        width={1280}
        height={1600}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 luxe-overlay" />
      <div className="luxe-grain absolute inset-0" />

      {/* Filete tricolor superior */}
      <div className="absolute inset-x-0 top-0 h-[3px] brand-strip" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center gap-10 px-5 py-10 lg:flex-row lg:gap-16 lg:py-16">
        {/* Lado editorial */}
        <div className="w-full max-w-lg space-y-7 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
            <Sparkles className="h-3.5 w-3.5" />
            Edição Premium
          </div>

          <h1 className="text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-6xl">
            <span className="text-luxe">Painel de Resultados</span>
          </h1>

          <div className="gold-hairline mx-auto h-px w-40 lg:mx-0" />

          <p className="text-base leading-relaxed text-white/70 sm:text-lg">
            Controle de comissões de Inícios e Reinícios com precisão, ciclos organizados
            e projeções em tempo real.
          </p>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { icon: TrendingUp, label: 'Comissões em tempo real' },
              { icon: ShieldCheck, label: 'Dados protegidos' },
              { icon: Sparkles, label: 'Metas e projeções' },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="rounded-xl border border-white/10 bg-white/5 p-3 text-left backdrop-blur-sm"
              >
                <Icon className="mb-2 h-4 w-4 text-gold" />
                <p className="text-xs font-medium leading-snug text-white/80">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Card de login */}
        <div className="w-full max-w-md rounded-[1.75rem] p-7 luxe-glass sm:p-9">
          <div className="mb-7 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/40 bg-gradient-to-br from-white/15 to-white/5 shadow-gold">
              <span className="text-xl font-bold text-gold">RV</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Acesso do Promotor</h2>
              <p className="text-xs text-white/60">Entre para continuar seu ciclo</p>
            </div>
          </div>

          <Tabs defaultValue="login" className="space-y-6">
            <TabsList className="grid h-12 w-full grid-cols-2 border border-white/10 bg-white/5 p-1">
              <TabsTrigger
                value="login"
                className="h-full font-medium text-white/70 data-[state=active]:bg-gold data-[state=active]:text-plum-deep"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Entrar
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="h-full font-medium text-white/70 data-[state=active]:bg-gold data-[state=active]:text-plum-deep"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Cadastrar
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-xs uppercase tracking-wider text-white/60">
                    Email
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="h-12 luxe-field"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-xs uppercase tracking-wider text-white/60">
                    Senha
                  </Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="h-12 luxe-field"
                  />
                </div>
                <Button type="submit" className="h-12 w-full btn-luxe" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Entrar
                    </>
                  )}
                </Button>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember-me"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                    className="border-white/30 data-[state=checked]:bg-gold data-[state=checked]:text-plum-deep"
                  />
                  <Label htmlFor="remember-me" className="cursor-pointer text-sm text-white/70">
                    Lembrar minha senha
                  </Label>
                </div>
                <Link to="/reset-password-direct" className="block">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-gold/40 bg-transparent text-gold hover:bg-gold/10 hover:text-gold"
                  >
                    Redefinir senha
                  </Button>
                </Link>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-xs uppercase tracking-wider text-white/60">
                    Email
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="h-12 luxe-field"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-xs uppercase tracking-wider text-white/60">
                    Senha
                  </Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="h-12 luxe-field"
                  />
                </div>
                <Button type="submit" className="h-12 w-full btn-luxe" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cadastrando...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Criar conta
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <p className="mt-7 text-center text-[11px] leading-relaxed text-white/45">
            Uso exclusivamente informativo — não substitui validação oficial de RV ou faturamento.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
