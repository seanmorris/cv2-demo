import { Bindable } from 'curvature/base/Bindable';

class Foobar {};

const foo = Bindable.make( new Foobar );

foo.bindTo((v,k) => console.log(k, v));

foo.x = 1;
foo.y = 1;
foo.z = 1;

Object.assign(foo, {a: 2, b: 2, c: 2});
Object.assign(foo, {x: 3, y: 3, z: 3});
