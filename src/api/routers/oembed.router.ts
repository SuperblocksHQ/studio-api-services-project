import * as express from 'express';
import { OEmbedQuery } from 'app';
import { projectsRepository } from 'infrastructure-mongodb';

export const oEmbedRouter = express.Router();

oEmbedRouter
.get('/oembed', async (req, res) => {
    const oEmbedQuery = new OEmbedQuery(projectsRepository);
    const result = await oEmbedQuery.execute(req.query.url);
    res.status(200).send(result);
});
