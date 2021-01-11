import * as express from 'express';
import { authRoute, optionalAuthRoute } from '../middleware';
import { GetProjectQuery, CreateProjectCommand, UpdateProjectCommand, DeleteProjectCommand, GetUserProjectsQuery, ClaimProjectCommand } from 'app';
import { projectsRepository } from 'infrastructure-mongodb';

const ANONYMOUS_TOKEN_HEADER = 'x-anonymous-token';

export const projectsRouter = express.Router();

projectsRouter
.get('/projects/:id', async (req, res) => {
    const getProject = new GetProjectQuery(projectsRepository);
    const anonymousToken = <string> req.headers[ANONYMOUS_TOKEN_HEADER];
    const result = await getProject.execute(req.params.id, anonymousToken);
    res.status(200).send(result);
})
.get('/user/projects', authRoute, async (req, res) => {
    const getUserProjects = new GetUserProjectsQuery(projectsRepository);
    const result = await getUserProjects.execute(req.user.id);
    res.status(200).send(result);
})
.post('/projects', optionalAuthRoute, async (req, res) => {
    const createProject = new CreateProjectCommand(projectsRepository);
    const userId = req.user && req.user.id;
    const anonymousToken = <string> req.headers[ANONYMOUS_TOKEN_HEADER];
    const result = await createProject.execute(req.body.name, req.body.description, req.body.files, userId, anonymousToken);
    res.status(201).send(result);
})
.post('/projects/:id/_claim', authRoute, async (req, res) => {
    const claimProject = new ClaimProjectCommand(projectsRepository);
    const anonymousToken = <string> req.headers[ANONYMOUS_TOKEN_HEADER];
    const result = await claimProject.execute(req.params.id, req.user.id, anonymousToken);
    res.status(201).send(result);
})
.put('/projects/:id', optionalAuthRoute, async (req, res) => {
    const updateProject = new UpdateProjectCommand(projectsRepository);
    const userId = req.user && req.user.id;
    const anonymousToken = <string> req.headers[ANONYMOUS_TOKEN_HEADER];
    await updateProject.execute(req.params.id, req.body.name, req.body.description, req.body.files, userId, anonymousToken);
    res.status(204).send();
})
.delete('/projects/:id', optionalAuthRoute, async (req, res) => {
    const deleteProject = new DeleteProjectCommand(projectsRepository);
    const anonymousToken = <string> req.headers[ANONYMOUS_TOKEN_HEADER];
    const userId = req.user && req.user.id;
    await deleteProject.execute(req.params.id, userId, anonymousToken);
    res.status(204).send();
});
