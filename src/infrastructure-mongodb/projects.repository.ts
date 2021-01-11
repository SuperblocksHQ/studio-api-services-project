import { IProjectsRepository, ApiError } from 'app';
import { Project, IPersistedProjectModel } from 'app-domain';
import { repository } from './db';
import { ObjectId } from 'mongodb';

export const projectsRepository: IProjectsRepository = {

    async getById(id: string): Promise<Project> {
        const persisted = await repository.projects.findOne({ _id: new ObjectId(id) });
        return persisted ? new Project(persisted) : null;
    },

    async getUserProjects(userId: string): Promise<IPersistedProjectModel[]> {
        return await (
            await repository.projects.find({ ownerId: userId }, { projection: { _id: 1, name: 1, createdAt: 1, lastModifiedAt: 1, description: 1 }  })
        ).toArray();
    },

    async create(project: Project): Promise<void> {
        const operation = await repository.projects.insertOne(project.persisted);
        if (!operation.result.ok) {
            throw new ApiError('Cannot create project in DB', 500);
        }
    },

    async update(project: Project): Promise<void> {
        const operation = await repository.projects.replaceOne({ _id: project.persisted._id }, project.persisted);
        if (!operation.result.ok) {
            throw new ApiError('Cannot update project in DB', 500);
        }
    },

    async delete(id: string): Promise<void> {
        const operation = await repository.projects.deleteOne({ _id: new ObjectId(id) });
        if (!operation.result.ok) {
            throw new ApiError('Cannot delete project from DB', 500);
        }
    }
};
