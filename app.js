var mdb = require('markdown-blog'),
    fs = require('fs'),
    moment = require('moment'),
    express = require('express'),
    config = require('./config'),
    routes = require('./source/routes');

/**
 * markdown blog configure
 */
mdb.setConfig('articles', config.articles);
mdb.setConfig('authors', config.authors);

var app = express.createServer();
app.configure(function() {
    app.set('views', __dirname +'/source/views');
    app.set('view engine', 'ejs');
    
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.session({ secret: 'haroog' }));

    app.use(app.router);
    app.use(express.static(__dirname +'/source/public'));
});

app.get('/', function(req, res) {
    var posts = fs.readFileSync(__dirname +'/source/_main.json', 'utf8');
    posts = JSON.parse(posts);
    posts.forEach(function(post) {
        post.header.published = moment(new Date(post.header.published)).fromNow();
    });

    res.render('main', { config: config, posts: posts });
});

app.get('/post/:title', function(req, res) {
    var post = mdb.loadArticle(req.params.title);

    res.render('article', { config: config, plugins: config.plugins, header: post.header, author: post.author, body: post.article });
});

/* category main page */
app.get('/category', function(req, res) {
    var cates = fs.readFileSync(__dirname +'/source/_categories.json', 'utf8');
    cates = JSON.parse(cates);

    res.render('category', { config: config, cates: cates });
});

app.get('/category/:cate', function(req, res) {
    var cates = fs.readFileSync(__dirname +'/source/_categories.json', 'utf8');
    cates = JSON.parse(cates);

    res.render('cate', { config: config, articles: cates[req.params.cate] });
});


app.get('/tags', function(req, res) {
    var tags = fs.readFileSync(__dirname +'/source/_tags.json', 'utf8');
    tags = JSON.parse(tags);

    res.render('tags', { config: config, tags: tags });
});

app.get('/tags/:tag', function(req, res) {
    var tags = fs.readFileSync(__dirname +'/source/_tags.json', 'utf8');
    tags = JSON.parse(tags);

    res.render('tag', { config: config, articles: tags[req.params.tag] });
});

app.listen(8000);
console.log('Start at http://haroog.dev');