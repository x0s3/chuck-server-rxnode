import express from 'express';
import axios from 'axios';
import { from } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { serverKey } from '../config/firebaseConfig';

const router = express.Router();

/* GET send push notification to all devices. */
router.get('/all', (req, res) => {
    const headers = {
        headers: {
            Authorization: `key=${serverKey}`,
            'Content-Type': 'application/json'
        }
    };
    const payload = {
        to: '/topics/all',
        notification: {
            title: 'Title Joke',
            body: 'Body Joke'
        },
        content_available: true,
        priority: 'high'
    };
    from(axios.post('https://fcm.googleapis.com/fcm/send', { ...payload }, { ...headers })).pipe(
        map(response => response),
        catchError(error => res.send(error.toString()))
    ).subscribe(response => res.send(response.toString()));
});

export default router;
