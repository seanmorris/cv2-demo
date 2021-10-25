import { Bindable } from 'curvature/base/Bindable';

class Foobar {};

const foo = Bindable.make( new Foobar );

foo.bindTo((v,k) => console.log(k, v));

foo.x = 5;
foo.y = 6;
foo.z = 7;
