 'use client';
 
 import { useEffect, useMemo, useState } from 'react';
 import Link from 'next/link';
 import { useRouter } from 'next/navigation';
 import { toast } from 'sonner';
 import { ArrowLeft, Loader2 } from 'lucide-react';
 import { supabase } from '@/lib/supabase/client';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
 } from '@/components/ui/card';
 
 type ResetMode = 'request' | 'reset';
 
 export default function ResetPasswordPage() {
   const router = useRouter();
   const [mode, setMode] = useState<ResetMode>('request');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState('');
   const [successMessage, setSuccessMessage] = useState('');
 
  const redirectTo = useMemo(() => {
    // Usar window.location.origin no browser para evitar dependência de env no build
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/reset`;
    }
    // Fallback para SSR (não será usado neste client component, mas mantém compatibilidade)
    return 'http://localhost:3000/reset';
  }, []);
 
   useEffect(() => {
     if (typeof window !== 'undefined') {
       const hash = window.location.hash;
       if (hash.includes('type=recovery')) {
         setMode('reset');
       }
     }
 
     const { data } = supabase.auth.onAuthStateChange((event) => {
       if (event === 'PASSWORD_RECOVERY') {
         setMode('reset');
       }
     });
 
     return () => {
       data.subscription.unsubscribe();
     };
   }, []);
 
   const handleRequestReset = async (e: React.FormEvent) => {
     e.preventDefault();
     setError('');
     setSuccessMessage('');
 
     if (!email) {
       setError('Informe seu email');
       return;
     }
 
     setLoading(true);
     try {
       const { error } = await supabase.auth.resetPasswordForEmail(email, {
         redirectTo,
       });
 
       if (error) {
         throw error;
       }
 
       setSuccessMessage('Enviamos um link de recuperação para o seu email.');
       toast.success('Verifique seu email para continuar');
     } catch (err: any) {
       setError(err.message || 'Erro ao enviar link de recuperação');
       toast.error('Falha ao solicitar recuperação');
     } finally {
       setLoading(false);
     }
   };
 
   const handleUpdatePassword = async (e: React.FormEvent) => {
     e.preventDefault();
     setError('');
     setSuccessMessage('');
 
     if (!password || !confirmPassword) {
       setError('Preencha todos os campos');
       return;
     }
 
     if (password.length < 8) {
       setError('A senha deve ter pelo menos 8 caracteres');
       return;
     }
 
     if (password !== confirmPassword) {
       setError('As senhas não conferem');
       return;
     }
 
     setLoading(true);
     try {
       const { error } = await supabase.auth.updateUser({ password });
       if (error) {
         throw error;
       }
 
       toast.success('Senha atualizada com sucesso');
       router.push('/dashboard');
     } catch (err: any) {
       setError(err.message || 'Erro ao atualizar senha');
       toast.error('Falha ao atualizar senha');
     } finally {
       setLoading(false);
     }
   };
 
   return (
     <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary via-secondary to-primary p-4">
       <Card className="w-full max-w-md shadow-2xl">
         <CardHeader className="space-y-1 text-center">
           <div className="flex justify-center mb-4">
             <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
               <span className="text-2xl font-bold text-white">A</span>
             </div>
           </div>
           <CardTitle className="text-2xl font-bold">
             {mode === 'reset' ? 'Definir nova senha' : 'Recuperar senha'}
           </CardTitle>
           <CardDescription>
             {mode === 'reset'
               ? 'Crie uma nova senha para sua conta.'
               : 'Enviaremos um link para redefinir sua senha.'}
           </CardDescription>
         </CardHeader>
         <CardContent>
           {mode === 'reset' ? (
             <form onSubmit={handleUpdatePassword} className="space-y-4">
               <div className="space-y-2">
                 <Label htmlFor="password">Nova senha</Label>
                 <Input
                   id="password"
                   type="password"
                   placeholder="••••••••"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   disabled={loading}
                   autoComplete="new-password"
                 />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="confirm-password">Confirmar senha</Label>
                 <Input
                   id="confirm-password"
                   type="password"
                   placeholder="••••••••"
                   value={confirmPassword}
                   onChange={(e) => setConfirmPassword(e.target.value)}
                   disabled={loading}
                   autoComplete="new-password"
                 />
               </div>
               {error && (
                 <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                   {error}
                 </div>
               )}
               <Button type="submit" className="w-full" disabled={loading}>
                 {loading ? (
                   <>
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                     Salvando...
                   </>
                 ) : (
                   'Atualizar senha'
                 )}
               </Button>
             </form>
           ) : (
             <form onSubmit={handleRequestReset} className="space-y-4">
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
                 />
               </div>
               {error && (
                 <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                   {error}
                 </div>
               )}
               {successMessage && (
                 <div className="text-sm text-emerald-700 bg-emerald-100/70 p-3 rounded-md">
                   {successMessage}
                 </div>
               )}
               <Button type="submit" className="w-full" disabled={loading}>
                 {loading ? (
                   <>
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                     Enviando...
                   </>
                 ) : (
                   'Enviar link'
                 )}
               </Button>
             </form>
           )}
         </CardContent>
         <CardFooter className="flex justify-center">
           <Link
             href="/login"
             className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
           >
             <ArrowLeft className="mr-2 h-4 w-4" />
             Voltar para login
           </Link>
         </CardFooter>
       </Card>
     </div>
   );
 }
