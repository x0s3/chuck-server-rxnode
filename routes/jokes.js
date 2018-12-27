import express from 'express';
import { Logger } from 'mongodb';
import axios from 'axios';
import { catchError, map } from 'rxjs/operators';
import { from } from 'rxjs';
import mongoCon from '../config/mongoClient';

const router = express.Router();

/**
 * TODO abstract mongo actions
 * */

/* GET one joke from mongodb */
router.get('/one', (req, res) => {
    mongoCon().subscribe(
        db => {
            Logger.setLevel('debug');
            const dbCallback = from(db.db('chuck_db').collection('jokes').findOne({}));
            let joke = {};
            dbCallback.subscribe(
                a => joke = a,
                error => res.send(error),
                () => {
                    res.send(joke);
                    db.close();
                }
            )
        },
        error => console.log(error)
    );
});

/* GET random joke from API. */
router.get('/random', (req, res) => {
    let joke = {};
    from(axios.get('https://api.chucknorris.io/jokes/random')).pipe(
        map(response => response.data),
        catchError(err => console.log(err))
    ).subscribe(
        data => joke = data,
        err => res.send(err),
        () => {
            mongoCon().subscribe(
                db => {
                    Logger.setLevel('debug');
                    const dbCallback = from(db.db('chuck_db').collection('jokes').insertOne({
                        ...joke,
                        date: new Date()
                    }));
                    dbCallback.subscribe(
                        response => console.log(response),
                        error => res.send(error),
                        () => {
                            res.send(joke);
                            db.close();
                        }
                    );
                }
            );
        }
    );
});


/* POST a joke to mongoDB */
router.post('/joke', (req, res) => {
    const { joke } = req.body;
    mongoCon().subscribe(
        db => {
            Logger.setLevel('debug');
            const dbCallback = from(db.db('chuck_db').collection('jokes').insertOne({ joke, date: new Date() }));
            dbCallback.subscribe(
                response => console.log(response),
                error => console.log(error),
                () => {
                    res.send(joke);
                    db.close();
                }
            );
        }
    );
});

export default router;
