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
import { Loader2, RefreshCcw } from 'lucide-react';

export default function Page() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastInserted, setLastInserted] = useState<any | null>(null);
  const [recent, setRecent] = useState<any[]>([]);

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
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-white p-6">
      <Card className="w-full max-w-md shadow-xl border-slate-200">
        <CardHeader>
          <CardTitle className="text-xl">Registro rápido</CardTitle>
          <CardDescription>Introduce tu email para registrarlo en Supabase</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="tu@ejemplo.com"
              value={email}
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="flex gap-2">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
                Registrar
              </Button>
              <Button type="button" variant="outline" onClick={fetchRecent}>
                <RefreshCcw className="w-4 h-4 mr-1" /> Refrescar
              </Button>
            </div>
          </form>
        </CardContent>
        {lastInserted && (
          <CardFooter className="flex flex-col items-start space-y-1 text-sm text-left border-t pt-3">
            <p><strong>UUID:</strong> {lastInserted.id}</p>
            <p><strong>Timestamp:</strong> {new Date(lastInserted.created_at).toLocaleString()}</p>
            <p><strong>Email:</strong> {lastInserted.email}</p>
          </CardFooter>
        )}
      </Card>

      <div className="w-full max-w-md mt-6 space-y-2">
        <h2 className="text-lg font-medium">Últimos registros</h2>
        <Card className="p-4">
          {recent.length === 0 ? (
            <p className="text-sm text-slate-500">Sin registros</p>
          ) : (
            <ul className="text-sm space-y-1">
              {recent.map((r) => (
                <li key={r.id} className="flex justify-between border-b last:border-0 py-1">
                  <span>{r.email}</span>
                  <span className="text-slate-400 text-xs">{new Date(r.created_at).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </main>
  );
}