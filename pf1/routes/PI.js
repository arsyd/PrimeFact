'use strict';
var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var dbPI = new sqlite3.Database('./db/chkp.db');

var tout = 30000;

router.get('/:num/:ind', function (req, res) {
    dbPI.get('SELECT [N],[PI] FROM [NxPI] where N < ? order by N desc', req.params.num,
        function (err, row) {
            var num = req.params.num;
            var PI;
            if (num === 2)
                PI = 1;
            else
            if (row !== undefined) {
                PI = calcPI(row.N, num, row.PI);
            }
            else {
                PI = calcPI(3, num, 1);
                }
            
            var s = String(PI) + ' ' + req.params.ind;
            var ob = { PI: PI, ind: req.params.ind };
            res.json(ob);
        });
});

function calcPI(n_from, n_to, PI_from) {
    var start = new Date();
    var PI = PI_from;
    var n_test, fact;
    for (n_test = n_from; n_test <= n_to; n_test++) {
        var fact_to = Math.sqrt(n_test);
        var bPrime = true;
        for (fact = 2; fact <= fact_to; fact++) {
            if ((n_test % fact) == 0) {
                bPrime = false;
                break;
            }
        }
        if (bPrime)
            PI++;
        var t = new Date();
        if ((t - start) > tout) {
            PI = 0;
            break;
        }

    }
    return PI;
}

module.exports = router;
