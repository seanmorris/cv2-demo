import { Bindable } from 'curvature/base/Bindable';

class Foobar {};

const foo = Bindable.make( new Foobar );

foo.x = 0;

foo.bindTo('x', v => console.log(v));

foo.x = 1;
foo.x = 2;
foo.x = 3;
