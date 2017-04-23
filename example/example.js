var looper = require('node-loop-bench');
var _ = require('lodash');

looper(
{
    repeat: 10,
    counts: [10, 100, 1000, 10000],
    work: function (i)
    {
        return JSON.parse(JSON.stringify(i));
    },
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
