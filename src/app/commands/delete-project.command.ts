import { IProjectsRepository } from '../interfaces';
import { ApiError } from 'app/models';

export class DeleteProjectCommand {
    private readonly projectsRepo: IProjectsRepository;

    constructor(projectsRepo: IProjectsRepository) {
        this.projectsRepo = projectsRepo;
    }

    async execute(id: string, currentUserId: string, anonymousToken?: string) {
        const project = await this.projectsRepo.getById(id);
        if (project.canBeUpdatedBy(currentUserId, anonymousToken)) {
            await this.projectsRepo.delete(id);
        } else {
            throw new ApiError('Only project owners can delete projects');
        }
    }
}
