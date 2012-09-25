var fs = require('fs'),
    exec = require('child_process').exec,
    mkdirp = require('mkdirp'),
    colors = require('colors'),
    conf = require('../config');

var cb;
process.chdir(__dirname);

function init() {
    var profile, head;

    exec('cp -R ./_init '+ conf.sourceDir, function(code, stdout, stderr) {
        exec('mv ../source/_init ../source/data', function(code, stdout, stderr) {
            console.log('haroo> created initial data'.yellow);
            process.chdir(conf.sourceDir);

            profile = fs.readFileSync('./authors/yours.markdown', 'utf8');
            profile = profile.split('\n\n');
            head = JSON.parse(profile[0]);
            head.name = conf.meta.author;
            head.email = conf.meta.email;
            head.blog = conf.meta.siteUrl;
            profile[0] = JSON.stringify(head, null, 4);
            profile = profile.join('\n\n');

            fs.writeFileSync('./authors/'+ conf.meta.author +'.markdown', profile, 'utf8');
            
            exec('rm -rf ./authors/yours.markdown', function(code, stdout, stderr) {
                exec('git init', function(code, stdout, stderr) {
                    console.log('haroo> site data initialized'.yellow);
                    cb();
                });

            });
        });
    });
}


module.exports = {
    start: function(callback) {
        cb = callback;
        if(!fs.existsSync(conf.sourceDir)) {
            init();
        }
    }
}
