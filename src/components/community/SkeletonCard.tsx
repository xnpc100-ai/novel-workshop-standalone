import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface SkeletonCardProps {
  type: 'share' | 'work' | 'qa' | 'topic';
}

export function SkeletonCard({ type }: SkeletonCardProps) {
  if (type === 'share') {
    return (
      <Card className="shadow-elegant rounded-2xl">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full skeleton" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-24 skeleton" />
              <div className="h-3 w-32 skeleton" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="h-5 w-3/4 skeleton" />
          <div className="h-4 w-20 skeleton" />
          <div className="space-y-2">
            <div className="h-3 w-full skeleton" />
            <div className="h-3 w-5/6 skeleton" />
            <div className="h-3 w-4/6 skeleton" />
          </div>
          <div className="flex gap-4 pt-2">
            <div className="h-8 w-16 skeleton" />
            <div className="h-8 w-16 skeleton" />
            <div className="h-8 w-16 skeleton" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (type === 'work') {
    return (
      <Card className="shadow-elegant rounded-2xl">
        <div className="aspect-video rounded-t-2xl skeleton" />
        <CardContent className="pt-4 space-y-3">
          <div className="flex justify-between">
            <div className="h-5 w-16 skeleton" />
            <div className="h-8 w-8 skeleton" />
          </div>
          <div className="h-5 w-3/4 skeleton" />
          <div className="space-y-1">
            <div className="h-3 w-full skeleton" />
            <div className="h-3 w-2/3 skeleton" />
          </div>
          <div className="flex justify-between">
            <div className="flex gap-3">
              <div className="h-4 w-12 skeleton" />
              <div className="h-4 w-12 skeleton" />
            </div>
            <div className="h-4 w-20 skeleton" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (type === 'qa') {
    return (
      <Card className="shadow-elegant rounded-2xl">
        <CardContent className="py-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl skeleton flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="flex gap-2">
                <div className="h-5 w-16 skeleton" />
                <div className="h-4 w-24 skeleton" />
              </div>
              <div className="h-5 w-3/4 skeleton" />
              <div className="space-y-1">
                <div className="h-3 w-full skeleton" />
                <div className="h-3 w-5/6 skeleton" />
              </div>
              <div className="flex gap-4">
                <div className="h-4 w-16 skeleton" />
                <div className="h-4 w-16 skeleton" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // topic
  return (
    <Card className="shadow-elegant rounded-2xl">
      <CardContent className="py-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <div className="flex gap-2">
              <div className="h-5 w-32 skeleton" />
              <div className="h-5 w-12 skeleton" />
            </div>
            <div className="h-5 w-16 skeleton" />
            <div className="flex gap-4">
              <div className="h-4 w-16 skeleton" />
              <div className="h-4 w-20 skeleton" />
            </div>
          </div>
          <div className="w-8 h-8 rounded skeleton" />
        </div>
      </CardContent>
    </Card>
  );
}
