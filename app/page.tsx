// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, RefreshCcw, CheckCircle } from 'lucide-react';
// import SimpleToast from '@/components/ui/SimpleToast';
import { motion } from 'framer-motion';

export default function Page() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastInserted, setLastInserted] = useState<any | null>(null);
  const [recent, setRecent] = useState<any[]>([]);
  // const { toast } = useToast();

  useEffect(() => {
    fetchRecent();
  }, []);

  async function fetchRecent() {
    const { data, error } = await supabase
      .from('logins')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    if (!error && data) setRecent(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError('Introduce un email válido');
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('logins')
      .insert([{ email }])
      .select()
      .single();

    if (error) setError(error.message);
    else {
      setLastInserted(data);
      setEmail('');
      fetchRecent();
      // toast({
      //   title: '✔ Email registrado correctamente',
      //   description: `${data.email}`,
      // });
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-zinc-950 via-neutral-900 to-black p-6 text-foreground">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <Card className="w-full max-w-md border border-white/10 bg-zinc-900/60 backdrop-blur-xl shadow-xl text-foreground">
          <CardHeader className="text-center space-y-1">
            <CardTitle className="text-3xl font-semibold bg-gradient-to-r from-sky-400 to-purple-500 bg-clip-text text-transparent">
              Registro de Email
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Guarda tu correo en Supabase y visualiza los registros
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                placeholder="tu@ejemplo.com"
                value={email}
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400 focus-visible:ring-sky-500"
              />

              {error && (
                <Alert variant="destructive" className="border-red-500/40 bg-red-950/50">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-sky-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 text-white shadow-md transition-all duration-150"
                >
                  {loading ? (
                    <Loader2 className="animate-spin w-4 h-4 mr-2" />
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  {loading ? 'Registrando...' : 'Registrar email'}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={fetchRecent}
                  className="flex items-center border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                >
                  <RefreshCcw className="w-4 h-4 mr-1" /> Refrescar
                </Button>
              </div>
            </form>
          </CardContent>

          {lastInserted && (
            <CardFooter className="flex flex-col items-start space-y-1 text-sm border-t border-zinc-800 pt-3 text-white">
              <p><strong className="text-sky-400">UUID:</strong> {lastInserted.id}</p>
              <p><strong className="text-sky-400">Timestamp:</strong> {new Date(lastInserted.created_at).toLocaleString()}</p>
              <p><strong className="text-sky-400">Email:</strong> {lastInserted.email}</p>
            </CardFooter>
          )}
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="w-full max-w-md mt-10"
      >
        <h2 className="text-lg font-medium text-zinc-200 mb-2">Últimos registros</h2>
        <Card className="p-4 border border-zinc-800 bg-zinc-900/70 backdrop-blur-md shadow-md">
          {recent.length === 0 ? (
            <p className="text-sm text-zinc-500">Sin registros</p>
          ) : (
            <ul className="text-sm space-y-1 divide-y divide-zinc-800">
              {recent.map((r) => (
                <li key={r.id} className="flex justify-between py-2 text-zinc-300">
                <span>{r.email}</span>
                <span className="text-zinc-500 text-xs">{new Date(r.created_at).toLocaleString()}</span>
              </li>
              
              ))}
            </ul>
          )}
        </Card>
      </motion.div>
    </main>
  );
}