import { IProjectsRepository } from '../interfaces';

export class ClaimProjectCommand {
    private readonly projectsRepo: IProjectsRepository;

    constructor(projectsRepo: IProjectsRepository) {
        this.projectsRepo = projectsRepo;
    }

    async execute(id: string, currentUserId: string, anonymousToken: string) {
        const project = await this.projectsRepo.getById(id);
        project.claimOwnership(currentUserId, anonymousToken);
        await this.projectsRepo.update(project);
    }
}
