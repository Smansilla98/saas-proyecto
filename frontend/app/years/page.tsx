'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { yearsApi, Year } from '@/lib/api/years';
import { Badge } from '@/components/ui/badge';

export default function YearsPage() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const [years, setYears] = useState<Year[]>([]);
  const [loadingYears, setLoadingYears] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadYears();
    }
  }, [user, loading, router]);

  const loadYears = async () => {
    try {
      const data = await yearsApi.getAll();
      setYears(data);
    } catch (error) {
      console.error('Error loading years:', error);
    } finally {
      setLoadingYears(false);
    }
  };

  if (loading || loadingYears) {
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
            <h1 className="text-3xl font-bold mb-2">Años</h1>
            <p className="text-muted-foreground">
              Selecciona un año para ver sus ritmos
            </p>
          </div>
          {isAdmin() && (
            <Button onClick={() => router.push('/years/new')}>
              + Nuevo Año
            </Button>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {years.map((year) => (
            <Card
              key={year.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => router.push(`/years/${year.id}/rhythms`)}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {year.name}
                  <Badge variant="outline">#{year.order}</Badge>
                </CardTitle>
                <CardDescription>
                  {year.rhythms?.length || 0} ritmos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Ver Ritmos →
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {years.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                No hay años disponibles aún.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

