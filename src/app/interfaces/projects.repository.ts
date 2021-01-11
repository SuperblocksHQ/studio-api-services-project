import { Project, IPersistedProjectModel } from 'app-domain';

export interface IProjectsRepository {
    getById(id: string): Promise<Project>;
    getUserProjects(userId: string): Promise<IPersistedProjectModel[]>;
    create(project: Project): Promise<void>;
    update(project: Project): Promise<void>;
    delete(id: string): Promise<void>;
}
