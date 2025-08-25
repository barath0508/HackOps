import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { FileText, Star, Github, ExternalLink, Users, Calendar, Eye, Send } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { toast } from 'sonner';

interface ProjectReviewProps {
  user: any;
  projects: any[];
  ratings: any[];
  onRatingSubmit: () => void;
}

const ProjectReview: React.FC<ProjectReviewProps> = ({ user, projects, ratings, onRatingSubmit }) => {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingData, setRatingData] = useState({
    innovation: [5],
    technical: [5],
    design: [5],
    impact: [5],
    presentation: [5],
    overallScore: [5],
    feedback: '',
    strengths: '',
    improvements: ''
  });
  const api = useApi();

  const handleRatingChange = (field: string, value: number[]) => {
    setRatingData(prev => ({ ...prev, [field]: value }));
  };

  const handleTextChange = (field: string, value: string) => {
    setRatingData(prev => ({ ...prev, [field]: value }));
  };

  const calculateOverallScore = () => {
    const scores = [
      ratingData.innovation[0],
      ratingData.technical[0],
      ratingData.design[0],
      ratingData.impact[0],
      ratingData.presentation[0]
    ];
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    return Math.round(average * 10) / 10;
  };

  const handleSubmitRating = async () => {
    if (!selectedProject) return;

    const overallScore = calculateOverallScore();
    
    try {
      await api.createRating({
        projectId: selectedProject._id,
        judgeId: user._id,
        judgeName: user.name,
        eventId: selectedProject.eventId,
        innovation: ratingData.innovation[0],
        technical: ratingData.technical[0],
        design: ratingData.design[0],
        impact: ratingData.impact[0],
        presentation: ratingData.presentation[0],
        overallScore,
        feedback: ratingData.feedback,
        strengths: ratingData.strengths,
        improvements: ratingData.improvements
      });

      toast.success('Rating submitted successfully!');
      setShowRatingModal(false);
      setRatingData({
        innovation: [5],
        technical: [5],
        design: [5],
        impact: [5],
        presentation: [5],
        overallScore: [5],
        feedback: '',
        strengths: '',
        improvements: ''
      });
      onRatingSubmit();
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit rating');
    }
  };

  const openRatingModal = (project: any) => {
    setSelectedProject(project);
    setShowRatingModal(true);
  };

  const getProjectRating = (projectId: string) => {
    return ratings.find((r: any) => r.projectId === projectId);
  };

  const unratedProjects = projects.filter(project => !getProjectRating(project._id));
  const ratedProjects = projects.filter(project => getProjectRating(project._id));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Project Review</h2>
        <p className="text-muted-foreground">Evaluate and rate submitted projects</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-semibold">{projects.length}</p>
                <p className="text-xs text-muted-foreground">Total Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Star className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-lg font-semibold">{ratedProjects.length}</p>
                <p className="text-xs text-muted-foreground">Rated Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Eye className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-lg font-semibold">{unratedProjects.length}</p>
                <p className="text-xs text-muted-foreground">Pending Reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Unrated Projects */}
      {unratedProjects.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Projects to Review</h3>
          <div className="grid gap-6 md:grid-cols-2">
            {unratedProjects.map((project) => (
              <Card key={project._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      Team: {project.teamMembers?.join(', ') || project.submittedBy}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Submitted: {new Date(project.submissionDate || project.createdAt).toLocaleDateString()}
                    </div>
                    {project.track && (
                      <Badge variant="secondary">{project.track}</Badge>
                    )}
                  </div>

                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 4).map((tech: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.technologies.length - 4} more
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    {project.githubUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4 mr-2" />
                          Code
                        </a>
                      </Button>
                    )}
                    {project.demoUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Demo
                        </a>
                      </Button>
                    )}
                  </div>

                  <Button 
                    onClick={() => openRatingModal(project)}
                    className="w-full"
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Rate Project
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Rated Projects */}
      {ratedProjects.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Completed Reviews</h3>
          <div className="grid gap-6 md:grid-cols-2">
            {ratedProjects.map((project) => {
              const rating = getProjectRating(project._id);
              
              return (
                <Card key={project._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {project.description}
                        </CardDescription>
                      </div>
                      <Badge variant="default" className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {rating?.overallScore}/10
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        Team: {project.teamMembers?.join(', ') || project.submittedBy}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Rated: {new Date(rating?.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {rating?.feedback && (
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium mb-1">Your Feedback:</p>
                        <p className="text-sm text-muted-foreground">{rating.feedback}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {project.githubUrl && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                            <Github className="h-4 w-4 mr-2" />
                            Code
                          </a>
                        </Button>
                      )}
                      {project.demoUrl && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Demo
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {projects.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Projects to Review</h3>
            <p className="text-muted-foreground">
              There are no projects assigned for review at this time.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Rating Modal */}
      <Dialog open={showRatingModal} onOpenChange={setShowRatingModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Rate Project: {selectedProject?.title}</DialogTitle>
            <DialogDescription>
              Provide detailed evaluation and feedback for this project
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Rating Criteria */}
            <div className="space-y-4">
              <h4 className="font-medium">Rating Criteria (1-10 scale)</h4>
              
              <div className="space-y-4">
                <div>
                  <Label>Innovation & Creativity ({ratingData.innovation[0]}/10)</Label>
                  <Slider
                    value={ratingData.innovation}
                    onValueChange={(value) => handleRatingChange('innovation', value)}
                    max={10}
                    min={1}
                    step={1}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label>Technical Implementation ({ratingData.technical[0]}/10)</Label>
                  <Slider
                    value={ratingData.technical}
                    onValueChange={(value) => handleRatingChange('technical', value)}
                    max={10}
                    min={1}
                    step={1}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label>Design & User Experience ({ratingData.design[0]}/10)</Label>
                  <Slider
                    value={ratingData.design}
                    onValueChange={(value) => handleRatingChange('design', value)}
                    max={10}
                    min={1}
                    step={1}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label>Impact & Usefulness ({ratingData.impact[0]}/10)</Label>
                  <Slider
                    value={ratingData.impact}
                    onValueChange={(value) => handleRatingChange('impact', value)}
                    max={10}
                    min={1}
                    step={1}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label>Presentation & Documentation ({ratingData.presentation[0]}/10)</Label>
                  <Slider
                    value={ratingData.presentation}
                    onValueChange={(value) => handleRatingChange('presentation', value)}
                    max={10}
                    min={1}
                    step={1}
                    className="mt-2"
                  />
                </div>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">Overall Score: {calculateOverallScore()}/10</p>
                <p className="text-sm text-muted-foreground">Calculated from all criteria</p>
              </div>
            </div>

            {/* Feedback */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="feedback">General Feedback</Label>
                <Textarea
                  id="feedback"
                  value={ratingData.feedback}
                  onChange={(e) => handleTextChange('feedback', e.target.value)}
                  placeholder="Provide overall feedback about the project..."
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="strengths">Strengths</Label>
                <Textarea
                  id="strengths"
                  value={ratingData.strengths}
                  onChange={(e) => handleTextChange('strengths', e.target.value)}
                  placeholder="What are the project's main strengths?"
                  rows={2}
                />
              </div>
              
              <div>
                <Label htmlFor="improvements">Areas for Improvement</Label>
                <Textarea
                  id="improvements"
                  value={ratingData.improvements}
                  onChange={(e) => handleTextChange('improvements', e.target.value)}
                  placeholder="What could be improved?"
                  rows={2}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={handleSubmitRating} disabled={api.loading}>
                <Send className="h-4 w-4 mr-2" />
                {api.loading ? 'Submitting...' : 'Submit Rating'}
              </Button>
              <Button variant="outline" onClick={() => setShowRatingModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectReview;