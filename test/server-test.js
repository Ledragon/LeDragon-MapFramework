/// <reference path="../typings/node/node.d.ts"/>
var express = require('express');
var app = express();
var port = 4000;

app.use(express.static(__dirname));
app.use(express.static('./'));
app.use('/*', express.static('./index-test.html'));
app.listen(port);