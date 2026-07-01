import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Card, CardContent } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { PiggyBank } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const email = `${username}@ahorro.com`;
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      console.error(err);
      setError('Credenciales incorrectas');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-md relative z-10">
        <Card className="border-0 shadow-2xl shadow-brand-900/10">
          <CardContent className="space-y-8 pt-12 px-8 pb-10">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-brand-100 to-brand-50 mb-6 shadow-inner">
                <PiggyBank className="w-10 h-10 text-brand-500" />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Nuestro Ahorro</h2>
              <p className="mt-2 text-sm text-slate-500 font-medium">Inicia sesión para entrar a nuestro espacio</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-5">
              <Input
                label="Usuario"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ej: usuario"
                error={error ? " " : undefined}
              />
              
              <Input
                label="Contraseña"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                error={error}
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full text-lg shadow-brand-500/20"
                  isLoading={loading}
                >
                  Entrar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}