import { Bindable } from 'curvature/base/Bindable';

class Foobar {};

const foo = Bindable.make( new Foobar );

foo.x = 0;
foo.y = 0;
foo.z = 0;

foo.bindTo(['x', 'y', 'z'], (v,k) => console.log(k, v));

foo.x = 5;
foo.y = 6;
foo.z = 7;
