import { IProjectsRepository } from '../interfaces';

export class UpdateProjectCommand {
    private readonly projectsRepo: IProjectsRepository;

    constructor(projectsRepo: IProjectsRepository) {
        this.projectsRepo = projectsRepo;
    }

    async execute(id: string, name: string, description: string, files: any, userId?: string, anonymousToken?: string) {
        const project = await this.projectsRepo.getById(id);
        project.update(name, description, files, userId, anonymousToken);
        await this.projectsRepo.update(project);
    }
}
