<?php

namespace SeanMorris\YourBrowser;

class BarBaz
{
	const STRING_VALUE = 'Hello, world!';
}

$foo = new BarBaz;

$baz->x = 100;
$baz->y = BarBaz::STRING_VALUE;
$baz->z = ["array", "array", "array"];
$baz->𝛼 = (object) ["value" => "something"];

// Horrified yet?

echo "<pre style = 'font-size:0.6rem;line-height:0.7rem'>" . nl2br(print_r($baz, 1)) . "</pre>";

phpinfo();
