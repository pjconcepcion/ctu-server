const router = require('express').Router();
const sql = require("mssql/msnodesqlv8")

/**
 * Index
 */
router.route('/').get((req, res) => {
    const request = new sql.Request();
    request.query(`
        SELECT B.id, B.title, B.author, B.genre,B.description,B.max_qty, COUNT(BB.BOOK_ID) AS borrowed 
        FROM BOOKS B LEFT JOIN borrowed_books BB ON B.ID = BB.book_id
        GROUP BY B.ID, B.TITLE, B.AUTHOR, B.GENRE,B.description,B.max_qty;`, (err,result) => {
        if(err){
            res.status(400).json(`Error: ${err}`)
        }else{
            res.json(result.recordsets[0]);
        }
    });
});

/***
 * Add new book
 */
router.route('/add').post((req,res) => {
    const params = {
        title : req.body.title,
        author : req.body.author,
        genre : req.body.genre,
        description : req.body.description,
        max_qty : req.body.max_qty
    }

    const ps = new sql.PreparedStatement();
    ps.input('title', sql.NVarChar);
    ps.input('author', sql.NVarChar);
    ps.input('genre', sql.NVarChar);
    ps.input('description', sql.NVarChar);
    ps.input('max_qty', sql.Int);
    ps.prepare('INSERT INTO BOOKS (title, author, genre, description, max_qty) VALUES (@title, @author, @genre, @description, @max_qty)', (err) => {
        if(err) {
            res.status(400).json('Prepare:' + err);
        }else{
            ps.execute(params, (err, result) => {
                if(err){
                    res.status(400).json('Execute:' + err);
                }else{
                    ps.unprepare((err) =>{
                        if(err) {
                            res.status(400).json(err);
                        }else {
                            res.json(result);
                        }
                    })
                }
            });
        }
    })
});

/***
 * Get book by id
 */
router.route('/:id').get((req,res) => {
    const id = req.params.id;
    const ps = new sql.PreparedStatement();
    ps.input('id', sql.Int);
    ps.prepare(`
        SELECT B.id, B.title, B.author, B.genre,B.description,B.max_qty, COUNT(BB.BOOK_ID) AS borrowed 
        FROM BOOKS B LEFT JOIN borrowed_books BB ON B.ID = BB.book_id
        WHERE B.ID=@id
        GROUP BY B.ID, B.TITLE, B.AUTHOR, B.GENRE,B.description,B.max_qty;`, (err)=> {
        if(err) {
            res.status(400).json(`Prepare: ${err}`);
        }else{
            ps.execute({id}, (err, result) => {
                if(err){
                    res.status(400).json('Execute:' + err);
                }else{
                    ps.unprepare((err) =>{
                        if(err) {
                            res.status(400).json(err);
                        }else {
                            res.json(result.recordsets[0]);
                        }
                    })
                }
            });
        }
    })
});

/***
 * Update book by id
 */
router.route('/:id/update').put((req,res) => {
    const params = {
        title : req.body.title,
        author : req.body.author,
        genre : req.body.genre,
        description : req.body.description,
        id: req.params.id
    }
    
    const ps = new sql.PreparedStatement();
    ps.input('id', sql.Int);
    ps.input('title', sql.NVarChar);
    ps.input('author', sql.NVarChar);
    ps.input('genre', sql.NVarChar);
    ps.input('description', sql.NVarChar);
    ps.prepare('UPDATE BOOKS SET TITLE=@title, AUTHOR=@author, GENRE=@genre, DESCRIPTION=@description WHERE ID=@id', (err)=> {
        if(err) {
            res.status(400).json(`Prepare: ${err}`);
        }else{
            ps.execute(params, (err, result) => {
                if(err){
                    res.status(400).json('Execute:' + err);
                }else{
                    ps.unprepare((err) =>{
                        if(err) {
                            res.status(400).json(err);
                        }else {
                            res.json(result);
                        }
                    })
                }
            });
        }
    })
});

/***
 * Delete book by id
 */
router.route('/:id/delete').put((req,res) => {
    const id = req.params.id;
    const ps = new sql.PreparedStatement();
    ps.input('id', sql.Int);
    ps.prepare('DELETE FROM BOOKS WHERE ID=@id', (err)=> {
        if(err) {
            res.status(400).json(`Prepare: ${err}`);
        }else{
            ps.execute({id}, (err, result) => {
                if(err){
                    res.status(400).json('Execute:' + err);
                }else{
                    ps.unprepare((err) =>{
                        if(err) {
                            res.status(400).json(err);
                        }else {
                            res.json(result);
                        }
                    })
                }
            });
        }
    })
});

/***
 * Borrow a book
 */
router.route('/:id/borrow').post((req,res) => {
    const params = {
        id: req.params.id,
        bookId: req.params.id,
        name: req.body.borrowerName
    }
    const ps = new sql.PreparedStatement();
    ps.input('id', sql.Int);
    ps.input('bookId', sql.Int);
    ps.input('name', sql.NVarChar);
    ps.prepare(`IF (SELECT B.max_qty - COUNT(BB.BOOK_ID) FROM BOOKS B LEFT JOIN borrowed_books BB ON B.ID = BB.book_id  WHERE B.ID=@id GROUP BY B.mAX_QTY) > 0
	        INSERT INTO BORROWED_BOOKS (NAME, BOOK_ID) VALUES (@name, @bookId)`, (err)=> {
        if(err) {
            res.status(400).json(`Prepare: ${err}`);
        }else{
            ps.execute(params, (err, result) => {
                if(err){
                    res.status(400).json('Execute:' + err);
                }else{
                    ps.unprepare((err) =>{
                        if(err) {
                            res.status(400).json(err);
                        }else {
                            res.json(result);
                        }
                    })
                }
            });
        }
    })
});

/***
 * Get borrower/s of a book
 */
router.route('/:id/borrower').get((req,res) => {
    const params = {bookId: req.params.id}
    const ps = new sql.PreparedStatement();
    ps.input('bookId', sql.Int);
    ps.prepare('SELECT * FROM BORROWED_BOOKS WHERE BOOK_ID=@bookId', (err)=> {
        if(err) {
            res.status(400).json(`Prepare: ${err}`);
        }else{
            ps.execute(params, (err, result) => {
                if(err){
                    res.status(400).json('Execute:' + err);
                }else{
                    ps.unprepare((err) =>{
                        if(err) {
                            res.status(400).json(err);
                        }else {
                            res.json(result.recordsets[0]);
                        }
                    })
                }
            });
        }
    })
});

/***
 * Return a book
 */
router.route('/:id/borrower/:borrower/delete').put((req,res) => {
    const params = {id: req.params.borrower}
    const ps = new sql.PreparedStatement();
    ps.input('id', sql.Int);
    ps.prepare('DELETE FROM BORROWED_BOOKS WHERE ID=@id', (err)=> {
        if(err) {
            res.status(400).json(`Prepare: ${err}`);
        }else{
            ps.execute(params, (err, result) => {
                if(err){
                    res.status(400).json('Execute:' + err);
                }else{
                    ps.unprepare((err) =>{
                        if(err) {
                            res.status(400).json(err);
                        }else {
                            res.json(result);
                        }
                    })
                }
            });
        }
    })
});

module.exports = router;