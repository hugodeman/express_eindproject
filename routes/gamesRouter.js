import Game from "../models/Game.js";
import {Router} from "express";
import {faker} from "@faker-js/faker";

const gamesRouter= new Router();

// seeding
gamesRouter.post('/games/:amount' || '/games/:amount/reset',async (req, res) => {
    try {
        const numGames = parseInt(req.params.amount, 10);
        const reset = req.query.reset === 'true';

        if (reset) {
            await Game.deleteMany({});
        }

        if(req.body.method === 'SEED') {
            for (let i = 0; i < numGames; i++) {
                let game = new Game({
                    title: faker.lorem.slug(),
                    description: faker.lorem.paragraph(),
                    genre: faker.lorem.words(),
                    producer: faker.company.name(),
                    release_date: faker.date.between({from: '2000-01-01T00:00:00.000Z', to: '2024-01-01T00:00:00.000Z'})
                })
                await game.save()
            }
            res.status(201).json({message: 'games seeded'})
        } else {
            res.status(400).json({message: 'geen SEED method'});
        }
    } catch (error){
        res.status(500).json({message: 'fout met seeden'});
    }
});

//options
gamesRouter.options('/games', (req, res)=> {
    res.setHeader('Allow', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');

    res.status(204).send();
})

gamesRouter.options('/games/:id', (req, res)=> {
    res.setHeader('Allow', 'GET,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,PATCH,DELETE,OPTIONS');

    res.status(204).send();
})

// overzicht alle games
gamesRouter.get('/games', async (req, res) => {
    try {
        console.log('GET /games');

        // zet strings om naar integers
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // totaal aantal documenten in mongoDB
        const totalGames = await Game.countDocuments();
        const totalPages = Math.ceil(totalGames / limit);

        // haal de items van pagina op en sla de rest over
        const offset = (page - 1) * limit;
        const paginatedGames = await Game.find()
            .skip(offset)
            .limit(limit);

        const links = {
            first: { page: 1, href: `/games?page=1&limit=${limit}` },
            last: { page: totalPages, href: `/games?page=${totalPages}&limit=${limit}` },
            previous: page > 1 ? { page: page - 1, href: `/games?page=${page - 1}&limit=${limit}` } : null,
            next: page < totalPages ? { page: page + 1, href: `/games?page=${page + 1}&limit=${limit}` } : null
        };

        if (paginatedGames.length === 0) {
            return res.status(404).json({ message: 'No games found' });
        }

        res.status(200).json({
            items: paginatedGames,
            _links: {
                self: {
                    href: process.env.BASE_URL
                },
                collection: {
                    href: process.env.BASE_URL
                }
            },
            pagination: {
                currentPage: page,
                currentItems: paginatedGames.length,
                totalPages: totalPages,
                totalItems: totalGames,
                _links: links
            }
        });
    } catch (error){
        res.status(500).json({message: 'error.message'});
    }
});

// overzicht een game
gamesRouter.get('/games/:id', async (req, res) => {
    try {
        const id= req.params.id;
        const games = await Game.findById(id);

        if (!games){
            return res.status(404).json({message: 'product not found'});
        }

        res.status(200).json(games);
    } catch (error) {
        res.status(500).json({message: 'error.message'});
    }
});

// aanmaken
gamesRouter.post('/games',async (req, res) => {
    try {
        const title = req.body.title;
        const description = req.body.description;
        const genre = req.body.genre;
        const producer = req.body.producer;
        const release_date = req.body.release_date;

        let game = new Game({
            title:title,
            description: description,
            genre: genre,
            producer: producer,
            release_date: release_date
        });

        if(!title || !description || !genre || !producer){
            return res.status(400).json({message: 'Velden mogen niet leeg zijn'})
        }

        await game.save();

        res.status(201).json(game);
    } catch (error){
        res.status(400).json({message: 'fout bij aanmaken'});
    }
});

// update
gamesRouter.put('/games/:id',async (req, res) => {
    try {
        const id= req.params.id;
        const games = await Game.findByIdAndUpdate(id, req.body);

        const title = req.body.title;
        const description = req.body.title;
        const genre = req.body.title;
        const producer = req.body.title;
        const release_date = req.body.title;

        if (!games){
            return res.status(404).json({message: 'product not found'});
        }

        if(!title || !description || !genre || !producer || !release_date){
            return res.status(400).json({message: 'Velden mogen niet leeg zijn'})
        }

        res.status(200).json(games);
    } catch (error){
        res.status(500).json({message: 'error.message'});
    }
})

//patch
gamesRouter.patch('/games/:id', async (req,res)=>{
    try {
        const id = req.params.id;
        const games = await Game.findByIdAndUpdate(id, req.body);

        const title = req.body.title;
        const description = req.body.title;
        const genre = req.body.title;
        const producer = req.body.title;
        const release_date = req.body.title;

        if (!games){
            return res.status(404).json({message: 'product not found'});
        }

        if(!title || !description || !genre || !producer || !release_date){
            return req.bodyUsed;
        }

        res.status(200).json(games)
    } catch (error){
        res.status(500).json({message: 'error.message'});
    }
})

// delete
gamesRouter.delete('/games/:id',async (req, res) => {
    try {
        const id= req.params.id;
        const games = await Game.findByIdAndDelete(id, req.body);

        if (!games){
            return res.status(404).json({message: 'product not found'})
        }

        res.status(204).json(games);
    } catch (error){
        res.status(500).json({message: 'error.message'})
    }
})

export default gamesRouter;