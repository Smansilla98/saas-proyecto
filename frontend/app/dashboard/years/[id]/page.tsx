'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { yearsApi, rhythmsApi, type Year, type Rhythm } from '@/lib/api/years';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Drum, Loader2 } from 'lucide-react';

export default function YearDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const [year, setYear] = useState<Year | null>(null);
  const [rhythms, setRhythms] = useState<Rhythm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || Number.isNaN(id)) {
      setLoading(false);
      setError('Año no válido');
      return;
    }
    Promise.all([
      yearsApi.getById(id).then((y) => {
        setYear(y);
        return y;
      }),
      rhythmsApi.getByYear(id),
    ])
      .then(([y, list]) => {
        setRhythms(list);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Error al cargar el año');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  if (error || !year) {
    return (
      <div className="space-y-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver al dashboard
          </Button>
        </Link>
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          {error ?? 'Año no encontrado'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{year.name}</h1>
          <p className="text-muted-foreground">
            Ritmos de este año. Haz clic en uno para ver videos, audios y partituras.
          </p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rhythms.map((rhythm) => (
          <Link key={rhythm.id} href={`/dashboard/rhythms/${rhythm.id}`}>
            <Card className="h-full transition-colors hover:bg-muted/50">
              <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                  <Drum className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-lg">{rhythm.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {rhythm.description || 'Sin descripción'}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" className="w-full">
                  Ver contenido
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      {rhythms.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <Drum className="h-12 w-12 mb-4 opacity-50" />
            <p>No hay ritmos en este año.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
