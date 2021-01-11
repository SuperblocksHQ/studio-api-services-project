import { IProjectsRepository } from '../interfaces';
import { ApiError } from 'app/models';

export class GetProjectQuery {
    private readonly projectsRepo: IProjectsRepository;

    constructor(projectsRepo: IProjectsRepository) {
        this.projectsRepo = projectsRepo;
    }

    async execute(id: string, anonymousToken: string) {
        const project = await this.projectsRepo.getById(id);
        if (project) {
            return { ...project.exposed, isOwner: anonymousToken === project.anonymousToken };
        } else {
            throw new ApiError('Project not found');
        }
    }
}
