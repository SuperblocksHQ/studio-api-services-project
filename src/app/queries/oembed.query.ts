import { IProjectsRepository } from '../interfaces';

const INVALID_URL = 'Invalid parameter: url';

export class OEmbedQuery {
    private readonly projectsRepo: IProjectsRepository;

    constructor(projectsRepo: IProjectsRepository) {
        this.projectsRepo = projectsRepo;
    }

    async execute(url: string) {
        if (!url || url.indexOf(process.env.ORIGIN) < 0) {
            throw new Error(INVALID_URL);
        }

        const projectId = url.replace(process.env.ORIGIN, '').replace(/\//g, '');
        if (!projectId) {
            throw new Error(INVALID_URL);
        }

        const project = await this.projectsRepo.getById(projectId);
        if (!project) {
            throw new Error(INVALID_URL);
        }

        return {
            version: '1.0',
            type: 'rich',
            title: project.exposed.name,
            provider_url: process.env.ORIGIN,
            provider_name: 'Superblocks',
            thumbnail_width: '1200',
            thumbnail_height: '900',
            thumbnail_url: 'https://superblocks.com/static/img/embed.jpg',
            // tslint:disable-next-line:max-line-length
            html: `<iframe width=\"1000\" height=\"500\" src=\"${url}\" style=\"width:1000px; height:500px; border:0; border-radius: 4px; overflow:hidden;\" sandbox=\"allow-modals allow-forms allow-popups allow-scripts allow-same-origin\"></iframe>`
        };
    }
}
