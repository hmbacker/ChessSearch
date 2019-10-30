const mysql = require('mysql');
const express = require('express');
const router = express.Router();

const info = {
    host: 'it2810-55.idi.ntnu.no',
    user: 'g55webserver',
    password: 'webdev55',
    database: 'prosjekt3',
    useNewUrlParser: true,
    multipleStatements: true,
    tables: {
        games: 'games',
        games_params: {
            id: "id",
            rated: "rated",
            created_at: "created_at",
            last_move_at: "last_move_at",
            turns: "turns",
            victory_status: "victory_status",
            winner: "winner",
            increment_code: "increment_code",
            white_id: "white_id",
            white_rating: "white_rating",
            black_id: "black_id",
            black_rating: "black_rating",
            moves: "moves",
            opening_eco: "opening_eco",
            opening_name: "opening_name",
            opening_ply: "opening_ply"
        },
        comments: 'comments',
        comments_params: {
            GameID: "GameID",
            Comment: "Comment"
        },
    },
};


// constans
const { games, comments } = info.tables;
const { id, rated, created_at, last_move_at, turns, victory_status, winner, increment_code, white_id, white_rating, black_id, black_rating, moves, opening_eco, opening_name, opening_ply } = info.tables.games_params;
const { GameID, Comment } = info.tables.comments_params;

function create_connection() {
    const connection = mysql.createConnection(info);
    connection.connect((err) => {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }
        console.log('connected as id ' + connection.threadId);
    });
    return connection;
}


//  Optional URL parameters: playerw, playerb, ignorecolors, winner, datemin, datemax, ratingmin, ratingmax, eco, turnmin, turnmax
//  Result: [{ id, rated, created_at, last_move_at, turns, victory_status, winner, increment_code, white_id, white_rating, black_id,
//  black_rating, moves, opening_eco, opening_name, opening_ply }]
exports.games_list = (req, res) => {
    let query = req.query

    // default sorting and pagination params
    let sorting_params = {
        order: "id",
        des: false,
        off: "0",
        lim: 10,
    };

    // date format: yyyy-mm-dd
    // ES6 destructuring 
    let { playerw, playerb, ignorecolors, winner, datemin, datemax, ratingmin, ratingmax, eco, turnmin, turnmax, orderby, descending, offset, limit } = query


    let winner_dict = {
        w: "white",
        b: "black",
        d: "draw"
    };

    // this is so every query append can have the form "and key=value"
    let qString = `where white_id like "%"`;

    // Build query based on params
    if (ignorecolors == "true") {
        if (playerw && playerb) {
            qString = `${qString} and (${white_id}="${playerw}" and ${black_id}="${playerb}") or (${white_id}="${playerb}" and ${black_id}="${playerw}") `
        } else if (playerw) {
            qString = `${qString} and (${white_id}="${playerw}" or ${black_id}="${playerw}") `;
        } else if (playerb) {
            qString = `${qString} and (${white_id}="${playerb}" or ${black_id}="${playerb}")`;
        };
    }
    else {
        if (playerw) {
            qString = `${qString} and ${white_id}="${playerw}"`;
        };
        if (playerb) {
            qString = `${qString} and ${black_id}="${playerb}"`;
        };
    }
    if (winner) {
        qString = `${qString} and winner="${winner_dict[winner]}"`;
    }

    if (datemin) {
        let time = new Date(datemin).getTime()
        qString = `${qString} and ${created_at} >= "${time}"`;
    }

    if (datemax) {
        let time = new Date(datemax).getTime()
        qString = `${qString} and ${created_at} <= "${time}"`;
    }

    if (ratingmin) {
        qString = `${qString} and ${white_rating} >= "${ratingmin}" and ${black_rating} >= "${ratingmin}"`;
    }

    if (ratingmax) {
        qString = `${qString} and ${white_rating} <= "${ratingmax}" and ${black_rating} <= "${ratingmax}"`;
    }

    if (turnmin) {
        qString = `${qString} and ${turns} >= "${turnmin}"`;
    }

    if (turnmax) {
        qString = `${qString} and ${turns} <= "${turnmax}"`;

    }

    if (eco) {
        qString = `${qString} and ${opening_eco} = "${eco}"`;
    }

    if (orderby) sorting_params.order = orderby;

    if (descending != undefined) sorting_params.des = descending;

    if (offset) sorting_params.off = offset;

    if (limit) sorting_params.lim = limit;

    let { order, off, lim } = sorting_params

    let o = ` order by ${order}`;

    let d;

    if ((sorting_params.des == "true") & (descending !== undefined)) {
        d = ` desc`
    }
    else {
        d = ` asc`
    };

    let l = ` limit ${off},${lim}`

    // final query to get results base on params
    let queryString = `SELECT * FROM ${games} ${qString}`;
    queryString = queryString + o + d + l;


    // query to get intances of rating within range
    // should get list of {range: num, instance: int}, eks {range 760, instance: 5};
    let graphQuery = `select F as Rating, sum(Instance) from
    (select floor(white_rating/10)*10 as F,(ceil(white_rating/10)+if(mod(white_rating,10)=0,1,0))*10 as T, count(white_rating) as Instance
    from  ${games} ${qString} 
    group by 1,2
    union all
    select floor(black_rating/10)*10 as F,(ceil(black_rating/10)+if(mod(black_rating,10)=0,1,0))*10 as T, count(black_rating) 
    from ${games} ${qString} 
    group by 1,2
    order by 1,2) as UnionTable
    group by Rating`;

    console.log(queryString)
    console.log(graphQuery)

    connection = create_connection()

    // multiple queries, {multipleStatements: true}
    query = queryString + `; ` + graphQuery
    connection.query(query, [1, 2], function (error, result) {
        if (error) throw error;
        res.send(result)
    });
    connection.end(error => { if (error) throw error });
};


exports.game = (req, res) => {
    let id = req.params.id
    connection = create_connection()
    connection.query(`select * from ${games} where id="${id}"`, function (error, result) {
        if (error) throw error;
        res.send(result)
    });
    connection.end(error => { if (error) throw error });
};

exports.game_comments = (req, res) => {
    let id = req.params.id
    connection = create_connection()
    connection.query(`select * from ${comments} where ${GameID}="${id}" order by DateTime asc`, function (error, result) {
        if (error) throw error;
        res.send(result)
    });
    connection.end(error => { if (error) throw error });
};

exports.create_game_comment = (req, res) => {
    let id = req.params.id
    let comment = req.body.comment
    console.log(id, comment)
    connection = create_connection()
    connection.query(`insert into ${comments} (${GameID}, ${Comment}) values("${id}","${comment}")`, function (error, result) {
        if (error) throw error;
        res.send(result)
    });
    connection.end(error => { if (error) throw error });
};







