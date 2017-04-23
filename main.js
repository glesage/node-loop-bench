/**
 * Dependencies
 */
var table = require('text-table');
var now = require("performance-now");

/**
 * Main export
 */
module.exports = function (config)
{
    if (!config.counts) throw new Error('Looper requires loop counts');
    if (!config.repeat) config.repeat = 10;

    /**
     * Build al lthe necessary data & setup all holder variables
     */
    var someFn = config.work || function () {};
    var results = {};
    var loopData = [];

    console.log('Building data...');
    config.counts.forEach(function (count)
    {
        var currData = [];
        while (currData.length < count)
        {
            currData.push(
            {
                "_id": "58fce0362c21d0235773c075",
                "index": 0,
                "guid": "4956df30-4faf-4cc1-be06-9dead4cb336d",
                "isActive": false,
                "balance": "$3,529.54",
                "picture": "http://placehold.it/32x32",
                "age": 22,
                "eyeColor": "brown",
                "name": "Green Love",
                "gender": "male",
                "company": "INFOTRIPS",
                "email": "greenlove@infotrips.com",
                "phone": "+1 (833) 437-2858",
                "address": "450 Halsey Street, Cataract, Minnesota, 2472",
                "about": "Do nulla ipsum ut velit tempor ea et labore aute adipisicing consequat aliqua officia in. Voluptate reprehenderit velit veniam proident aliquip aliqua occaecat duis nulla. Irure sint occaecat ullamco dolore aute magna est sit. Id dolore proident pariatur aliqua ullamco excepteur esse consequat irure occaecat enim dolore proident labore. In proident minim magna mollit aliquip ipsum occaecat mollit magna occaecat occaecat sint ullamco dolore. Magna nisi excepteur dolor laboris esse ea ipsum et quis.\r\n",
                "registered": "2014-03-18T03:03:08 +05:00",
                "latitude": 63.373698,
                "longitude": 123.784373,
                "tags": [
                    "ullamco",
                    "id",
                    "aliquip",
                    "duis",
                    "minim",
                    "tempor",
                    "elit"
                ],
                "friends": [
                {
                    "id": 0,
                    "name": "Fern Middleton"
                },
                {
                    "id": 1,
                    "name": "Wilkinson Graves"
                },
                {
                    "id": 2,
                    "name": "Melba Wells"
                }],
                "greeting": "Hello, Green Love! You have 4 unread messages.",
                "favoriteFruit": "banana"
            });
        }
        loopData.push(currData);
    });


    /**
     * Use text-table to log the results in a table format
     */
    var prettyLog = function ()
    {
        var tableData = [
            ['LOOP TYPE', ...config.counts]
        ];

        Object.keys(results).forEach(function (loopType)
        {
            var currentResult = [loopType];
            Object.keys(results[loopType]).forEach(function (countType)
            {
                var times = results[loopType][countType];
                var sum = times.reduce(function (acc, val)
                {
                    return acc + val;
                }, 0);
                var average = (sum / times.length).toFixed(2);

                currentResult.push(average);
            });
            tableData.push(currentResult);
        });

        console.log('\n\n' + table(tableData) + '\n');
        process.exit();
    }


    /**
     * Base loops to compare your own loops against
     */
    var methods = {
        'for loop - length uncached': function (data, func)
        {
            for (var x = 0; x < data.length; x++)
            {
                func(data[x]);
            }
        },
        'for loop - cached length': function (data, func)
        {
            var l = data.length;
            for (var x = 0; x < l; x++)
            {
                func(data[x]);
            }
        },
        'for loop - i--': function (data, func)
        {
            var i = data.length - 1;
            for (; i > 0; i--)
            {
                func(data[i]);
            }
        },
        'for in': function (data, func)
        {
            for (var i in data)
            {
                func(data[i]);
            }
        },
        'forEach': function (data, func)
        {
            data.forEach(func);
        },
        'while': function (data, func)
        {
            var i = 0;
            while (i < data.length)
            {
                func(data[i++]);
            }
        },
        'while desc': function (data, func)
        {
            var i = data.length;
            while (i--)
            {
                func(i);
            }
        },
        'pop': function (data, func)
        {
            while (data.length)
            {
                func(data.pop());
            }
        }
    };


    /**
     * Add the loops passed to the list
     */
    Object.assign(methods, config.loops);

    /**
     * Setup results holder object
     */
    Object.keys(methods).forEach(function (loopType)
    {
        results[loopType] = {};
        config.counts.forEach(function (count)
        {
            results[loopType][count] = [];
        });
    });

    /**
     * Run all loops in a reduce chain to avoid caching issues
     */
    var repeatArray = Array(config.repeat).fill().map((_, i) => i * i);
    console.log('Looping...');
    return repeatArray.reduce(function (lastIter, currIter, idx)
    {
        return lastIter.then(function ()
        {
            process.stdout.write(idx ? idx + ' ' : 'Iteration: ' + idx + ' ');
            return Object.keys(methods).reduce(function (prevLoop, currLoop)
            {
                return prevLoop.then(function ()
                {
                    return loopData.reduce(function (lastCounts, currCounts)
                    {
                        return lastCounts.then(function ()
                        {
                            var copy = [...currCounts];
                            var t0 = now();
                            methods[currLoop](copy, someFn);
                            var t1 = now();
                            results[currLoop][currCounts.length].push(t1 - t0);
                        });
                    }, Promise.resolve());
                });
            }, Promise.resolve());
        });
    }, Promise.resolve()).then(prettyLog);
};
