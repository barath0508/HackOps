import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useCreateRating } from '@/hooks/useDatabase';
import { toast } from 'sonner';
import { Project } from '@/lib/database';

interface RatingFormProps {
  project: Project;
  judgeId: string;
  onSuccess?: () => void;
}

export const RatingForm = ({ project, judgeId, onSuccess }: RatingFormProps) => {
  const [ratings, setRatings] = useState({
    innovation: [7],
    technical: [7],
    design: [7],
    presentation: [7]
  });
  const [feedback, setFeedback] = useState('');
  
  const createRating = useCreateRating();
  
  const overall = Math.round((ratings.innovation[0] + ratings.technical[0] + ratings.design[0] + ratings.presentation[0]) / 4);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createRating.mutateAsync({
        projectId: project._id!,
        judgeId,
        eventId: project.eventId,
        innovation: ratings.innovation[0],
        technical: ratings.technical[0],
        design: ratings.design[0],
        presentation: ratings.presentation[0],
        overall,
        feedback
      });
      
      toast.success('Rating submitted successfully!');
      onSuccess?.();
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to submit rating';
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">{project.title}</h3>
        <p className="text-sm text-muted-foreground">{project.description}</p>
        <div className="mt-2 flex gap-2">
          {project.technologies?.map((tech, index) => (
            <span key={index} className="px-2 py-1 bg-muted rounded text-xs">
              {tech}
            </span>
          ))}
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label>Innovation ({ratings.innovation[0]}/10)</Label>
            <Slider
              value={ratings.innovation}
              onValueChange={(value) => setRatings({ ...ratings, innovation: value })}
              max={10}
              min={1}
              step={1}
              className="mt-2"
            />
          </div>
          
          <div>
            <Label>Technical Implementation ({ratings.technical[0]}/10)</Label>
            <Slider
              value={ratings.technical}
              onValueChange={(value) => setRatings({ ...ratings, technical: value })}
              max={10}
              min={1}
              step={1}
              className="mt-2"
            />
          </div>
          
          <div>
            <Label>Design & UX ({ratings.design[0]}/10)</Label>
            <Slider
              value={ratings.design}
              onValueChange={(value) => setRatings({ ...ratings, design: value })}
              max={10}
              min={1}
              step={1}
              className="mt-2"
            />
          </div>
          
          <div>
            <Label>Presentation ({ratings.presentation[0]}/10)</Label>
            <Slider
              value={ratings.presentation}
              onValueChange={(value) => setRatings({ ...ratings, presentation: value })}
              max={10}
              min={1}
              step={1}
              className="mt-2"
            />
          </div>
          
          <div className="p-4 bg-muted rounded-lg">
            <Label className="text-lg font-semibold">Overall Score: {overall}/10</Label>
          </div>
        </div>
        
        <div>
          <Label htmlFor="feedback">Feedback</Label>
          <Textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Provide detailed feedback for the team..."
            className="mt-2"
            rows={4}
          />
        </div>
        
        <Button type="submit" disabled={createRating.isPending} className="w-full">
          {createRating.isPending ? 'Submitting...' : 'Submit Rating'}
        </Button>
      </form>
    </div>
  );
};