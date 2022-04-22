"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
class Post {
    constructor(test) {
        this.test = test;
    }
    b1(number3, number1, number2, event) {
        var _a;
        return (number1 + number2 + number3) * ((_a = event.a) !== null && _a !== void 0 ? _a : 1);
    }
    // Alternative approach. Good - we can name params and the order of arguments is not important. Bad - developers are forced to adopt nested/named params.
    // public b2(args: { number3: number; number1: number; number2: number }): number {
    //     return args.number1 + args.number2;
    // }
    b3(s1, s2) {
        return `${this.test}${s1}${s2}`;
    }
}
exports.Post = Post;
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
        const value = Reflect.apply(post[operation], undefined, [...Object.values(args), ...[event]]);
        expect(value).toBe(12);
    });
});
// Reflect.apply(object[event.stash.operation as keyof T], that, [...Object.values(event.arguments.input), ...[event]]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXN5bmMtcmVzb2x2ZXIudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAtc3luYy90ZXN0L2FwcC1zeW5jLXJlc29sdmVyLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsTUFBYSxJQUFJO0lBSWIsWUFBWSxJQUFZO1FBQ3BCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ3JCLENBQUM7SUFFTSxFQUFFLENBQUMsT0FBZSxFQUFFLE9BQWUsRUFBRSxPQUFlLEVBQUUsS0FBVzs7UUFDcEUsT0FBTyxDQUFDLE9BQU8sR0FBRyxPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsT0FBQyxLQUFLLENBQUMsQ0FBQyxtQ0FBSSxDQUFDLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBRUQseUpBQXlKO0lBQ3pKLG1GQUFtRjtJQUNuRiwwQ0FBMEM7SUFDMUMsSUFBSTtJQUVHLEVBQUUsQ0FBQyxFQUFVLEVBQUUsRUFBVTtRQUM1QixPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUM7SUFDcEMsQ0FBQztDQUNKO0FBcEJELG9CQW9CQztBQUVELFFBQVEsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRTtJQUMvQixJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxHQUFHLEVBQUU7UUFFNUIsTUFBTSxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDOUIsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBRXZCLFdBQVc7UUFDWCwrRUFBK0U7UUFFL0UsV0FBVztRQUNYLDRDQUE0QztRQUM1QywrRUFBK0U7UUFFL0UsTUFBTSxJQUFJLEdBQUcsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDO1FBQ3BELE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1FBRXZCLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQXVCLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU1RyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzNCLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUM7QUFHSCx3SEFBd0giLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgUG9zdCB7XHJcblxyXG4gICAgcHJpdmF0ZSB0ZXN0OiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IodGVzdDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy50ZXN0ID0gdGVzdDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYjEobnVtYmVyMzogbnVtYmVyLCBudW1iZXIxOiBudW1iZXIsIG51bWJlcjI6IG51bWJlciwgZXZlbnQ/OiBhbnkpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiAobnVtYmVyMSArIG51bWJlcjIgKyBudW1iZXIzKSAqIChldmVudC5hID8/IDEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEFsdGVybmF0aXZlIGFwcHJvYWNoLiBHb29kIC0gd2UgY2FuIG5hbWUgcGFyYW1zIGFuZCB0aGUgb3JkZXIgb2YgYXJndW1lbnRzIGlzIG5vdCBpbXBvcnRhbnQuIEJhZCAtIGRldmVsb3BlcnMgYXJlIGZvcmNlZCB0byBhZG9wdCBuZXN0ZWQvbmFtZWQgcGFyYW1zLlxyXG4gICAgLy8gcHVibGljIGIyKGFyZ3M6IHsgbnVtYmVyMzogbnVtYmVyOyBudW1iZXIxOiBudW1iZXI7IG51bWJlcjI6IG51bWJlciB9KTogbnVtYmVyIHtcclxuICAgIC8vICAgICByZXR1cm4gYXJncy5udW1iZXIxICsgYXJncy5udW1iZXIyO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIHB1YmxpYyBiMyhzMTogc3RyaW5nLCBzMjogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIGAke3RoaXMudGVzdH0ke3MxfSR7czJ9YDtcclxuICAgIH1cclxufVxyXG5cclxuZGVzY3JpYmUub25seSgnQXBwU3luY1N0YWNrJywgKCkgPT4ge1xyXG4gICAgdGVzdC5vbmx5KCdjcmVhdGUgc2NoZW1hJywgKCkgPT4ge1xyXG5cclxuICAgICAgICBjb25zdCBwb3N0ID0gbmV3IFBvc3QoJ3Rlc3QnKTtcclxuICAgICAgICBjb25zdCBvcGVyYXRpb24gPSAnYjEnO1xyXG5cclxuICAgICAgICAvLyBXb3JraW5nLlxyXG4gICAgICAgIC8vIGNvbnN0IHZhbHVlID0gUmVmbGVjdC5hcHBseShwb3N0W29wZXJhdGlvbiBhcyBrZXlvZiBQb3N0XSwgdGhpcywgWzMsIDEsIDJdKTtcclxuXHJcbiAgICAgICAgLy8gV29ya2luZy5cclxuICAgICAgICAvLyBjb25zdCBwb3N0ID0gUmVmbGVjdC5jb25zdHJ1Y3QoUG9zdCwgW10pO1xyXG4gICAgICAgIC8vIGNvbnN0IHZhbHVlID0gUmVmbGVjdC5hcHBseShwb3N0W29wZXJhdGlvbiBhcyBrZXlvZiBQb3N0XSwgdGhpcywgWzMsIDEsIDJdKTtcclxuXHJcbiAgICAgICAgY29uc3QgYXJncyA9IHsgbnVtYmVyMzogMywgbnVtYmVyMTogMSwgbnVtYmVyMjogMiB9O1xyXG4gICAgICAgIGNvbnN0IGV2ZW50ID0geyBhOiAyIH07XHJcblxyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gUmVmbGVjdC5hcHBseShwb3N0W29wZXJhdGlvbiBhcyBrZXlvZiBQb3N0XSwgdW5kZWZpbmVkLCBbLi4uT2JqZWN0LnZhbHVlcyhhcmdzKSwgLi4uW2V2ZW50XV0pO1xyXG5cclxuICAgICAgICBleHBlY3QodmFsdWUpLnRvQmUoMTIpO1xyXG4gICAgfSk7XHJcbn0pO1xyXG5cclxuXHJcbi8vIFJlZmxlY3QuYXBwbHkob2JqZWN0W2V2ZW50LnN0YXNoLm9wZXJhdGlvbiBhcyBrZXlvZiBUXSwgdGhhdCwgWy4uLk9iamVjdC52YWx1ZXMoZXZlbnQuYXJndW1lbnRzLmlucHV0KSwgLi4uW2V2ZW50XV0pOyJdfQ==