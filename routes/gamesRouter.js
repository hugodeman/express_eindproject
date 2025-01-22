import Game from "../models/Game.js";
import {Router} from "express";
import {faker} from "@faker-js/faker";

const gamesRouter= new Router();

// seeding
gamesRouter.post('/games/:amount' || '/games/:amount/reset',async (req, res) => {
    //  heeft de body een body.method === seed?
    //  seed
    //  else res. error
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
})

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
        const games = await Game.find({});

        if (!games){
            return res.status(404).json({message: 'game not found'});
        }

        res.status(200).json({
            items: games,
            _links: {
                self: {
                    href: process.env.BASE_URL
                },
                collection: {
                    href: process.env.BASE_URL
                }
            },
            // pagination: {
            //     currentPage: 1,
            //     currentItems: 6,
            //     totalPages: 2,
            //     totalItems: 12,
            //     _links: {
            //         first: {
            //             page: 1,
            //             href: process.env.PAGINATION_FIRST
            //         },
            //         last: {
            //             page: 2,
            //             href: process.env.PAGINATION_LAST
            //         },
            //         previous: null,
            //         next: {
            //             page: 2,
            //             href: process.env.PAGINATION_NEXT
            //         }
            //     }
            // }
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