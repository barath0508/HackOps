import { useGetProjects } from '@/hooks/useDatabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const ProjectList = () => {
  const { data: projects, isLoading, error } = useGetProjects();

  if (isLoading) return <div>Loading projects...</div>;
  if (error) return <div>Error loading projects</div>;
  
  const projectList = Array.isArray(projects) ? projects : [];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Projects</h2>
      {projectList.length === 0 ? (
        <p className="text-muted-foreground">No projects found. Create your first project!</p>
      ) : (
        projectList.map((project) => (
        <Card key={project._id}>
          <CardHeader>
            <CardTitle>{project.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-2">{project.description}</p>
            <p className="text-sm text-gray-500">
              Team: {project.teamMembers?.join(', ') || 'N/A'}
            </p>
            <p className="text-sm text-gray-500">
              Submitted by: {project.submittedBy}
            </p>
          </CardContent>
        </Card>
        ))
      )}
    </div>
  );
};