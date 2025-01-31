import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
        title: {type: String, required: true},
        description: {type: String, required: true},
        genre: {type: String, required: true},
        producer: {type: String, required: true},
        release_date: {type: Date},
        favorite: { type: Boolean, default: false }

    }, {
        toJSON: {
            virtuals: true,
            versionKey: false,
            // past object aan voordat het JSON wordt
            transform: (doc, ret) => {

                ret._links = {
                    self: {
                        href: `${process.env.BASE_URL}/${ret._id}`
                    },
                    collection: {
                        href: process.env.BASE_URL
                    }
                }
                // maakt id 'ontzichbaar'
                delete ret._id
            }
        },
    }
);

const Game = mongoose.model('Game', gameSchema);

export default Game;