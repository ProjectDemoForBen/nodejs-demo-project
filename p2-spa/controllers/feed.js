
exports.getPosts = (req, res, next) => {
    res.status(200).json({
       posts: [
           {
               title: 'First Post',
               content: 'This is the first post',
               author: 'Marcelo Cardozo',
               imageUrl: '/images/2020-08-07_20-23.png',
           }
       ]
    });
}


exports.createPost = (req, res, next) => {
    const {title, content} = req.body;

    res.status(201).json({
       message: 'Post created!',
       data: {
           id: new Date().toISOString(),
           title,
           content,
       }
    });
}