
import { Button } from './button'
import { ExternalLink, Github } from 'lucide-react'

interface ProjectProps {
    project: {
        id: number;
        title: string;
        description: string;
        image: string;
        tags: string[];
        liveUrl: string;
        githubUrl: string;
        featured: boolean;
        category: string;
    },
    index: number
}

const ProjectCard = ({ project, index }: ProjectProps) => {
    return (
        <div
            className="group glass rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-cyan-400/20 transition-all duration-300"
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            {/* Project Image */}
            <div className="w-full  aspect-video bg-gradient-to-br from-cyan-400/20 to-blue-500/20 flex items-center justify-center relative overflow-hidden">
                <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-fill group-hover:scale-110 transition-transform duration-500"
                    width={1800}
                    height={870}
                    loading='lazy'
                />

                {project.featured && (
                    <div className="absolute top-2 right-3 px-3 py-1 rounded-full bg-cyan-900 text-white text-xs font-medium">
                        Featured
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-cyan-400 transition-colors">
                    {project.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.filter(tag => tag).map((tag) => (
                        <span
                            key={tag}
                            className="px-2 py-1 rounded-md bg-white/5 text-muted-foreground text-xs"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-cyan-400 to-blue-500 text-background font-semibold hover:scale-105 transition-transform"
                        onClick={() => window.open(project.liveUrl, '_blank')}
                    >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Live Demo
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        className="border-white/20 text-foreground hover:bg-white/5"
                        onClick={() => window.open(project.githubUrl, '_blank')}
                    >
                        <Github className="w-3 h-3" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ProjectCard
