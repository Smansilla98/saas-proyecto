'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { yearsApi, type Year } from '@/lib/api/years';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const [years, setYears] = useState<Year[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    yearsApi
      .getAll()
      .then((data) => {
        const ordered = [...data].sort((a, b) => a.order - b.order);
        setYears(ordered);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Error al cargar los años');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Años</h1>
        <p className="text-muted-foreground">
          Elige un año para ver sus ritmos y contenido.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {years.map((year) => (
          <Link key={year.id} href={`/dashboard/years/${year.id}`}>
            <Card className="h-full transition-colors hover:bg-muted/50">
              <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-lg">{year.name}</CardTitle>
                  <CardDescription>
                    {year.rhythms?.length ?? 0} ritmo
                    {(year.rhythms?.length ?? 0) !== 1 ? 's' : ''}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" className="w-full">
                  Ver ritmos
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      {years.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <BookOpen className="h-12 w-12 mb-4 opacity-50" />
            <p>No hay años cargados todavía.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
