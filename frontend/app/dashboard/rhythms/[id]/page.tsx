'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { rhythmsApi, getMediaUrl, type Rhythm, type Media } from '@/lib/api/years';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Drum, FileAudio, FileVideo, FileText, Loader2 } from 'lucide-react';

function VideoPlayer({ media }: { media: Media }) {
  const url = getMediaUrl(media);
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{media.name || media.file_name}</p>
      <video
        className="w-full max-w-2xl rounded-lg border bg-black"
        controls
        preload="metadata"
        src={url}
      >
        Tu navegador no soporta video. <a href={url}>Descargar</a>
      </video>
    </div>
  );
}

function AudioPlayer({ media }: { media: Media }) {
  const url = getMediaUrl(media);
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{media.name || media.file_name}</p>
      <audio className="w-full max-w-md" controls preload="metadata" src={url}>
        Tu navegador no soporta audio. <a href={url}>Descargar</a>
      </audio>
    </div>
  );
}

function PdfViewer({ media }: { media: Media }) {
  const url = getMediaUrl(media);
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{media.name || media.file_name}</p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" asChild>
          <a href={url} target="_blank" rel="noopener noreferrer">
            Abrir en nueva pestaña
          </a>
        </Button>
      </div>
      <iframe
        title={media.name || 'PDF'}
        src={`${url}#toolbar=1`}
        className="h-[70vh] w-full max-w-4xl rounded-lg border bg-white"
      />
    </div>
  );
}

export default function RhythmDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const [data, setData] = useState<{
    rhythm: Rhythm;
    videos: Media[];
    audios: Media[];
    pdfs: Media[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || Number.isNaN(id)) {
      setLoading(false);
      setError('Ritmo no válido');
      return;
    }
    rhythmsApi
      .getById(id)
      .then(setData)
      .catch((err) => {
        setError(err.response?.data?.message || 'Error al cargar el ritmo');
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

  if (error || !data) {
    const yearId = data?.rhythm?.year_id;
    return (
      <div className="space-y-4">
        <Link href={yearId ? `/dashboard/years/${yearId}` : '/dashboard'}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
        </Link>
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          {error ?? 'Ritmo no encontrado'}
        </div>
      </div>
    );
  }

  const { rhythm, videos, audios, pdfs } = data;
  const yearId = rhythm.year_id;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={yearId ? `/dashboard/years/${yearId}` : '/dashboard'}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
          <Drum className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{rhythm.name}</h1>
          <p className="text-muted-foreground line-clamp-2">
            {rhythm.description || 'Sin descripción'}
          </p>
          {(rhythm.author || rhythm.adaptation) && (
            <p className="text-sm text-muted-foreground mt-1">
              {[rhythm.author, rhythm.adaptation].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
      </div>

      {videos.length === 0 && audios.length === 0 && pdfs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <FileVideo className="h-12 w-12 mb-4 opacity-50" />
            <p>Aún no hay contenido multimedia para este ritmo.</p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="video" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="video" className="gap-2">
              <FileVideo className="h-4 w-4" />
              Video ({videos.length})
            </TabsTrigger>
            <TabsTrigger value="audio" className="gap-2">
              <FileAudio className="h-4 w-4" />
              Audio ({audios.length})
            </TabsTrigger>
            <TabsTrigger value="pdf" className="gap-2">
              <FileText className="h-4 w-4" />
              PDF ({pdfs.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="video" className="space-y-6 mt-4">
            {videos.length === 0 ? (
              <p className="text-muted-foreground">No hay videos.</p>
            ) : (
              videos.map((m) => (
                <Card key={m.id}>
                  <CardContent className="pt-6">
                    <VideoPlayer media={m} />
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
          <TabsContent value="audio" className="space-y-6 mt-4">
            {audios.length === 0 ? (
              <p className="text-muted-foreground">No hay audios.</p>
            ) : (
              audios.map((m) => (
                <Card key={m.id}>
                  <CardContent className="pt-6">
                    <AudioPlayer media={m} />
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
          <TabsContent value="pdf" className="space-y-6 mt-4">
            {pdfs.length === 0 ? (
              <p className="text-muted-foreground">No hay PDFs.</p>
            ) : (
              pdfs.map((m) => (
                <Card key={m.id}>
                  <CardContent className="pt-6">
                    <PdfViewer media={m} />
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
