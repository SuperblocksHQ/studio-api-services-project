import { IProjectsRepository } from '../interfaces';
import { Project } from 'app-domain';

export class CreateProjectCommand {
    private readonly projectsRepo: IProjectsRepository;

    constructor(projectsRepo: IProjectsRepository) {
        this.projectsRepo = projectsRepo;
    }

    async execute(name: string, description: string, files: any, currentUserId: string, anonymousToken?: string) {
        const project = Project.createNew(name, description, files, currentUserId, anonymousToken);
        await this.projectsRepo.create(project);
        return { ...project.exposed, anonymousToken: project.anonymousToken };
    }
}
