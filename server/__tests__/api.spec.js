const request = require('supertest');
const { app }= require('../app');

describe('API server', () => {
    let api;
    let testEntry = {
        title: 'blog1',
        author: 'jeff mandem',
        content: 'i was going for a long long walk...'
    };
    let port = 5000;

    beforeAll(()=>{
        api = app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));
    })

    test('Get items responds with status 200', (done)=>{
        request(api).get('/all').expect(200,done);
    })

    test('Post a new entry responds with status 201', (done) => {
        request(api)
        .post('/add')
        .send(testEntry)
        .set('Accept', /application\/json/)
        .expect(201,done)
    })

    test('responds to delete /:title with status 204', async () => {
        await request(api).delete('/blog1').expect(204);

        const updatedTasks = await request(api).get('/all');

        expect(updatedTasks.body.length).toBe(0);
    });

    afterAll((done) => {
        console.log('server closed');
        api.close(done)
    })
})