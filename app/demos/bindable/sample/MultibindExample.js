import { Bindable } from 'curvature/base/Bindable';

class Foobar {};

const foo = Bindable.make( new Foobar );

foo.x = 0;
foo.y = 0;
foo.z = 0;

foo.bindTo(['x', 'y', 'z'], (v,k) => console.log(k, v));

foo.x = 1;
foo.y = 1;
foo.z = 1;

Object.assign(foo, {x: 2, y: 2, z: 2});

foo.x = 3;
foo.y = 3;
foo.z = 3;
