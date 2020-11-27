import { Bindable } from 'curvature/base/Bindable';

class Foobar {};

const foo = Bindable.make( new Foobar );

foo.bindTo((v,k,t,d,p) => console.log({v,k,t,d,p}));

foo.x = 5;
foo.y = 6;
foo.z = 7;

delete foo.z;
