import { ObjectId } from 'mongodb';

export interface IPersistedProjectModel {
    _id: ObjectId;
    name: string;
    description: string;
    files: string;
    createdAt: Date;
    lastModifiedAt: Date;
    ownerId: string;
    anonymousToken?: string;
}
