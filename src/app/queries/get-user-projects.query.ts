import { IProjectsRepository } from '../interfaces';

export class GetUserProjectsQuery {
    private readonly projectsRepo: IProjectsRepository;

    constructor(projectsRepo: IProjectsRepository) {
        this.projectsRepo = projectsRepo;
    }

    async execute(currentUserId: string) {
        const projects = await this.projectsRepo.getUserProjects(currentUserId);
        return projects.map(p => ({ id: p._id, name: p.name, createdAt: p.createdAt, lastModifiedAt: p.lastModifiedAt, description: p.description }));
    }
}
