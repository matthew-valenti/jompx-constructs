export class Post {

    private test: string;

    constructor(test: string) {
        this.test = test;
    }

    public b1(number3: number, number1: number, number2: number, event?: any): number {
        return (number1 + number2 + number3) * (event.a ?? 1);
    }

    // Alternative approach. Good - we can name params and the order of arguments is not important. Bad - developers are forced to adopt nested/named params.
    // public b2(args: { number3: number; number1: number; number2: number }): number {
    //     return args.number1 + args.number2;
    // }

    public b3(s1: string, s2: string) {
        return `${this.test}${s1}${s2}`;
    }
}

describe.only('AppSyncStack', () => {
    test.only('create schema', () => {

        const post = new Post('test');
        const operation = 'b1';

        // Working.
        // const value = Reflect.apply(post[operation as keyof Post], this, [3, 1, 2]);

        // Working.
        // const post = Reflect.construct(Post, []);
        // const value = Reflect.apply(post[operation as keyof Post], this, [3, 1, 2]);

        const args = { number3: 3, number1: 1, number2: 2 };
        const event = { a: 2 };

        const value = Reflect.apply(post[operation as keyof Post], undefined, [...Object.values(args), ...[event]]);

        expect(value).toBe(12);
    });
});


// Reflect.apply(object[event.stash.operation as keyof T], that, [...Object.values(event.arguments.input), ...[event]]);