'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { rhythmsApi, Rhythm, Media } from '@/lib/api/years';
import { VideoPlayer } from '@/components/media/video-player';
import { AudioPlayer } from '@/components/media/audio-player';
import { PdfViewer } from '@/components/media/pdf-viewer';

export default function RhythmDetailPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const rhythmId = Number(params.rhythmId);
  
  const [rhythm, setRhythm] = useState<Rhythm | null>(null);
  const [videos, setVideos] = useState<Media[]>([]);
  const [audios, setAudios] = useState<Media[]>([]);
  const [pdfs, setPdfs] = useState<Media[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user && rhythmId) {
      loadRhythm();
    }
  }, [user, loading, rhythmId, router]);

  const loadRhythm = async () => {
    try {
      const data = await rhythmsApi.getById(rhythmId);
      setRhythm(data.rhythm);
      setVideos(data.videos || []);
      setAudios(data.audios || []);
      setPdfs(data.pdfs || []);
    } catch (error) {
      console.error('Error loading rhythm:', error);
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

  if (!rhythm) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Ritmo no encontrado</p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.push(`/years/${rhythm.year_id}/rhythms`)}
          className="mb-6"
        >
          ← Volver a Ritmos
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">{rhythm.name}</CardTitle>
                {rhythm.optional && (
                  <Badge variant="secondary" className="mb-2">Opcional</Badge>
                )}
              </div>
            </div>
            {rhythm.description && (
              <CardDescription className="text-base mt-2">
                {rhythm.description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {rhythm.author && (
                <p className="text-sm">
                  <strong>Autor:</strong> {rhythm.author}
                </p>
              )}
              {rhythm.adaptation && (
                <p className="text-sm">
                  <strong>Adaptación:</strong> {rhythm.adaptation}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Videos */}
        {videos.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Videos</h2>
            <div className="space-y-4">
              {videos.map((video) => (
                <Card key={video.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{video.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <VideoPlayer url={video.url} />
                  </CardContent>
                </Card>
              ))}
            </div>
            <Separator className="my-6" />
          </div>
        )}

        {/* Audios */}
        {audios.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Audios</h2>
            <div className="space-y-4">
              {audios.map((audio) => (
                <Card key={audio.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{audio.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AudioPlayer url={audio.url} />
                  </CardContent>
                </Card>
              ))}
            </div>
            <Separator className="my-6" />
          </div>
        )}

        {/* PDFs */}
        {pdfs.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Partituras (PDF)</h2>
            <div className="space-y-4">
              {pdfs.map((pdf) => (
                <Card key={pdf.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{pdf.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PdfViewer url={pdf.url} />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {videos.length === 0 && audios.length === 0 && pdfs.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                No hay contenido multimedia disponible para este ritmo.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

