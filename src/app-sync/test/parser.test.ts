// eslint-disable-next-line @typescript-eslint/no-require-imports
const parse = require('mongodb-language-model').parse;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const accepts = require('mongodb-language-model').accepts;

/**
 * npx jest parser.test.ts
 */

describe('Parser', () => {
    test('parser', () => {

        // const ast = parse('{"foo": "bar"}');
        // const ast = parse('getCollection("country").find({}).sort( { name : -1 } )');
        // const ast = parse('{"age": {"$gt": 35}}');
        // const ast = parse('{"$or": [{"email": {"$exists": true}}, {"phone": {"$exists": true}}]}');
        // console.log('!!!', ast);

        // const rv = accepts('{"foo": 1}');
        const rv = accepts('{"$or": [{"email": {"$exists": true}}, {"phone": {"$exists": true}}]}');
        console.log('!!!', rv);
    });
});
