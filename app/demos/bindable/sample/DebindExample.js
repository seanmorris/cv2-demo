import { Bindable } from 'curvature/base/Bindable';

class Foobar {};

const foo = Bindable.make( new Foobar );

foo.x = 0;

const debind = foo.bindTo('x', v => console.log(v));

foo.x = 4;
foo.x = 5;

debind();

foo.x = 6;
