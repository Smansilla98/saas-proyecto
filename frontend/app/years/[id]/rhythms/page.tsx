'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { rhythmsApi, yearsApi, Rhythm, Year } from '@/lib/api/years';

export default function RhythmsPage() {
  const { user, loading, isAdmin, isDocente } = useAuth();
  const router = useRouter();
  const params = useParams();
  const yearId = Number(params.id);
  
  const [year, setYear] = useState<Year | null>(null);
  const [rhythms, setRhythms] = useState<Rhythm[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user && yearId) {
      loadData();
    }
  }, [user, loading, yearId, router]);

  const loadData = async () => {
    try {
      const [yearData, rhythmsData] = await Promise.all([
        yearsApi.getById(yearId),
        rhythmsApi.getByYear(yearId),
      ]);
      setYear(yearData);
      setRhythms(rhythmsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              onClick={() => router.push('/years')}
              className="mb-4"
            >
              ← Volver a Años
            </Button>
            <h1 className="text-3xl font-bold mb-2">
              Ritmos - {year?.name}
            </h1>
            <p className="text-muted-foreground">
              {rhythms.length} ritmos disponibles
            </p>
          </div>
          {(isAdmin() || isDocente()) && (
            <Button onClick={() => router.push(`/years/${yearId}/rhythms/new`)}>
              + Nuevo Ritmo
            </Button>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rhythms.map((rhythm) => (
            <Card
              key={rhythm.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => router.push(`/rhythms/${rhythm.id}`)}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {rhythm.name}
                  {rhythm.optional && (
                    <Badge variant="secondary">Opcional</Badge>
                  )}
                </CardTitle>
                {rhythm.description && (
                  <CardDescription className="line-clamp-2">
                    {rhythm.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  {rhythm.author && (
                    <p className="text-sm text-muted-foreground">
                      <strong>Autor:</strong> {rhythm.author}
                    </p>
                  )}
                  {rhythm.adaptation && (
                    <p className="text-sm text-muted-foreground">
                      <strong>Adaptación:</strong> {rhythm.adaptation}
                    </p>
                  )}
                </div>
                <Button variant="outline" className="w-full">
                  Ver Detalle →
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {rhythms.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                No hay ritmos disponibles para este año.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

