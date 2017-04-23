node-loop-bench
===============
NodeJS Loop Benchmarking tool, plugs into your environment and takes in custom loops

![Example usage](https://media.giphy.com/media/xUA7bf3wo7VVQczY0E/giphy.gif)

Installation
------------
`npm install --save node-loop-bench`

Usage
-----
### Base
```
var looper = require('node-loop-bench');
looper(
{
    counts: [10000]
});
```

### Options
```
var looper = require('node-loop-bench');
looper(
{
    // How many test iterations of each loop types should be run
    repeat: 10,

    // Run the loops 10 & 100 times and show results for both lengths
    counts: [10, 100],

    // A custom function you'd like the loops to perform
    work: function (i)
    {
        return JSON.parse(JSON.stringify(i));
    },
    
    // Any additional custom loops you'd like to have benchmarked
    loops:
    {
        'for loop - length uncached': function (data, func)
        {
            for (var x = 0; x < data.length; x++)
            {
                func(data[x]);
            }
        }
    }
});
```

### Passing a custom loop to benchmark ([see example](https://github.com/glesage/node-loop-bench/blob/master/example/example.js))
```
var looper = require('node-loop-bench');
var _ = require('lodash');

looper(
{
    loops:
    {
        'lodash each': function (data, func)
        {
            _.each(data, function (o)
            {
                func(o);
            });
        },
        'lodash map': function (data, func)
        {
            _.map(data, function (o)
            {
                return func(o);
            });
        }
    }
});
```