import { IPersistedProjectModel } from './models';
import { ObjectId } from 'mongodb';

const projectNameRegex = /^[a-zA-ZA-Z0-9 -]+$/;

/**
 * Aggregate root for project bounded context
 */
export class Project {
    private persistedModel: IPersistedProjectModel;

    constructor(persisted: IPersistedProjectModel) {
        if (!persisted) {
            throw new Error('Invalid parameters while creating user');
        }
        this.persistedModel = persisted;
    }

    static createNew(name: string, description: string, files: any, ownerId: string, anonymousToken?: string) {
        name = (name || '').trim();
        if (name && !projectNameRegex.test(name)) {
            throw new Error('Invalid project name');
        }

        ownerId = ownerId || null;
        anonymousToken = anonymousToken ? anonymousToken : new ObjectId().toHexString();
        const now = new Date();

        return new Project({
            _id: new ObjectId(),
            name,
            description,
            files,
            ownerId,
            createdAt: now,
            lastModifiedAt: now,
            anonymousToken
        });
    }

    get id() { return this.persistedModel._id.toHexString(); }

    get persisted(): IPersistedProjectModel { return this.persistedModel; }

    get exposed() {
        const { _id, anonymousToken, ...data } = this.persistedModel;
        return { ...data, id: _id };
    }

    get anonymousToken() { return this.persistedModel.anonymousToken; }

    update(name: string, description: string, files: any, userId?: string, anonymousToken?: string) {
        if (this.canBeUpdatedBy(userId, anonymousToken)) {
            name = (name || '').trim();
            if (!projectNameRegex.test(name)) {
                throw new Error('Invalid project name');
            }
            this.persistedModel.name = name;
            // TODO: add validation in next version
            this.persistedModel.files = files;
            this.persistedModel.description = description;
            this.persistedModel.lastModifiedAt = new Date();
        } else {
            throw new Error('Project can be modified only by owner');
        }
    }

    claimOwnership(userId: string, anonymousToken: string) {
        if (!this.persistedModel.ownerId && this.persistedModel.anonymousToken === anonymousToken) {
            this.persistedModel.anonymousToken = null;
            this.persistedModel.ownerId = userId;
        } else {
            throw new Error('User can claim only projects associated with them.');
        }
    }

    public canBeUpdatedBy(userId?: string, anonymousToken?: string) {
        return (this.persistedModel.ownerId && this.persistedModel.ownerId === userId)
            || (this.persistedModel.anonymousToken && this.persistedModel.anonymousToken === anonymousToken);
    }
}
