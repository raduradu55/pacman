

const SCORE_TEXT = document.getElementById("score");

const CANVAS = document.getElementById("canvas");
const CANVAS_CTX = CANVAS.getContext("2d");
const CANV_WIDTH = CANVAS.width;
const CANV_HEIGHT = CANVAS.height;

const FPS = 90;
const FRAME_TIME = 1000 / FPS;

// colors che canvas black
CANVAS_CTX.fillStyle = "#000000";
CANVAS_CTX.fillRect(0, 0, CANV_WIDTH, CANV_HEIGHT);

// map
const WALL = 1;
const PYER = 2; // player
const TURN = 3; // turn point
const NOUP = 4; // turn point that cant send the player up
const NODW = 5; // turn point that cant send the player down
const NODX = 6; // turn point that cant send the player to the right
const NOSX = 7; // turn point that cant send the player to the left
var MAP =   [[WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL],
		     [WALL, TURN, 0   , 0   , TURN, WALL, TURN, 0   , 0   , 0   , 0   , 0   , 0   , TURN, WALL, TURN, 0   , 0   , TURN, WALL],
			 [WALL, 0   , WALL, WALL, 0   , WALL, 0   , WALL, WALL, WALL, WALL, WALL, WALL, 0   , WALL, 0   , WALL, WALL, 0   , WALL],
			 [WALL, 0   , WALL, TURN, NODW, 0   , TURN, 0   , 0   , 0   , 0   , 0   , 0   , TURN, 0   , NODW, TURN, WALL, 0   , WALL],
			 [WALL, 0   , WALL, 0   , WALL, WALL, 0   , WALL, WALL, 0   , 0   , WALL, WALL, 0   , WALL, WALL, 0   , WALL, 0   , WALL],
			 [WALL, NOSX, 0   , TURN, 0   , 0   , NODX, WALL, 0   , 0   , 0   , 0   , WALL, NOSX, 0   , 0   , TURN, 0   , NODX, WALL],
			 [WALL, 0   , WALL, 0   , WALL, WALL, 0   , WALL, WALL, WALL, WALL, WALL, WALL, 0   , WALL, WALL, 0   , WALL, 0   , WALL],
			 [WALL, 0   , WALL, TURN, NOUP, 0   , TURN, 0   , 0   , 0   , 0   , 0   , 0   , TURN, 0   , NOUP, TURN, WALL, 0   , WALL],
			 [WALL, 0   , WALL, WALL, 0   , WALL, 0   , WALL, WALL, WALL, WALL, WALL, WALL, 0   , WALL, 0   , WALL, WALL, 0   , WALL],
			 [WALL, TURN, 0   , 0   , TURN, WALL, TURN, 0   , 0   , 0   , 0   , 0   , 0   , TURN, WALL, TURN, 0   , 0   , TURN, WALL],
			 [WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL]];

// walls
const EMPTY_RECT_COLOR = "#000000";

const WALL_COLOR = "#2e8f21";
const WALL_WIDTH = 26;
const WALL_HEIGHT = WALL_WIDTH;

const CON_WALL_COLOR = "#000000";
const CON_WALL_WIDTH = 12;
const CON_WALL_HEIGHT = CON_WALL_WIDTH;

const TURN_COLOR = "#123123";

var RECT_COORDINATES = [];  //[ [[row, col],[topleft_x, topleft_y]], [...]]
var TURN_RECTS_CENTERS = [];    // [ [[center_x, center_y],[allowed_up, allowed_down, allowed_left, allowed_right]], [...]]
                                // "allowed" variable tells if the turning point can send the player in that direction
var coordinates_saved = false;
var turn_rects_saved = false;
const X = 0, Y = 1, PIXEL_COORDINATES = 1, ARR_COORDINATES = 0, ROW = 0, COLUMN = 1, ALLOWED_DIRECTIONS = 1;
const CENTER_COORDINATES = 0;

// map centering calculationsva
const MAP_HEIGHT = MAP.length * WALL_HEIGHT;
const MAP_WIDTH = MAP[0].length * WALL_WIDTH;
const MAP_START_WIDTH = (CANV_WIDTH-MAP_WIDTH) / 2;
const MAP_START_HEIGHT = (CANV_HEIGHT-MAP_HEIGHT) / 2;

// coins

const COIN_COLOR = "#deeba0";
const COIN_RADIUS = 3;
// [[coin_x, coin_y], [...]]
var COINS = [];

// player 
const PLAYER_COLOR = "#d6132d";
const PLAYER_WALL_SPACING = 2
const P_CIRCLE_RADIUS = (WALL_WIDTH / 2) - PLAYER_WALL_SPACING;
const PLAYER_SPEED = 1;
var PLAYER_SCORE = 0;
const UP = 0, DOWN = 1, LEFT = 2, RIGHT = 3;

var player_row = 1;
var player_col = 1;

var player_x = ((((player_col+1) * WALL_WIDTH) + MAP_START_WIDTH) - P_CIRCLE_RADIUS) - PLAYER_WALL_SPACING;
var player_y = ((((player_row+1) * WALL_HEIGHT) + MAP_START_HEIGHT) - P_CIRCLE_RADIUS) - PLAYER_WALL_SPACING;

var player_direction = UP;
var player_next_direction = player_direction;

function drawMap() {
    for(var row=0; row<MAP.length; row++) {
		for(var col=0; col<MAP[0].length; col++) {

            // choses the color
            if(MAP[row][col] == WALL) {
                CANVAS_CTX.fillStyle = WALL_COLOR;
                CANVAS_CTX.fillRect((col * WALL_WIDTH) + MAP_START_WIDTH,
                                      (row * WALL_HEIGHT) + MAP_START_HEIGHT,	
                                      WALL_WIDTH, 
                                      WALL_HEIGHT);

                // saves topleft corners of all rectangles (used for collisions)   
                if(!coordinates_saved) {
                    RECT_COORDINATES.push([[row, 
                                        col],
                                       [(col * WALL_WIDTH) + MAP_START_WIDTH,
                                       (row * WALL_HEIGHT) + MAP_START_HEIGHT]]);
                } 
                
                // conscntric wall
                CANVAS_CTX.fillStyle = CON_WALL_COLOR;
                CANVAS_CTX.fillRect((col * WALL_WIDTH) + MAP_START_WIDTH + (CON_WALL_WIDTH / 2),
                                    (row * WALL_HEIGHT) + MAP_START_HEIGHT + (CON_WALL_HEIGHT / 2),	
                                    WALL_WIDTH - CON_WALL_WIDTH, 
                                    WALL_HEIGHT - CON_WALL_HEIGHT);	
            }
            
            if(MAP[row][col] == TURN || MAP[row][col] == NOUP || MAP[row][col] == NODW || MAP[row][col] == NODX || MAP[row][col] == NOSX) {
                CANVAS_CTX.fillStyle = EMPTY_RECT_COLOR;
                CANVAS_CTX.fillRect((col * WALL_WIDTH) + MAP_START_WIDTH,
                                      (row * WALL_HEIGHT) + MAP_START_HEIGHT,	
                                      WALL_WIDTH, 
                                      WALL_HEIGHT);
                
                if(!turn_rects_saved) {
                    if(MAP[row][col] == NOUP) {
                        
                        TURN_RECTS_CENTERS.push([[((col * WALL_WIDTH) + MAP_START_WIDTH) + WALL_WIDTH / 2,
                                                ((row * WALL_HEIGHT) + MAP_START_HEIGHT) + WALL_HEIGHT / 2], 
                                                [false,true,true,true]]);
                    } else if(MAP[row][col] == NODW) {

                        TURN_RECTS_CENTERS.push([[((col * WALL_WIDTH) + MAP_START_WIDTH) + WALL_WIDTH / 2,
                                                ((row * WALL_HEIGHT) + MAP_START_HEIGHT) + WALL_HEIGHT / 2], 
                                                [true,false,true,true]]);    
                    } else if(MAP[row][col] == NODX) {

                        TURN_RECTS_CENTERS.push([[((col * WALL_WIDTH) + MAP_START_WIDTH) + WALL_WIDTH / 2,
                                                ((row * WALL_HEIGHT) + MAP_START_HEIGHT) + WALL_HEIGHT / 2], 
                                                [true,true,true,false]]);    
                    } else if(MAP[row][col] == NOSX) {

                        TURN_RECTS_CENTERS.push([[((col * WALL_WIDTH) + MAP_START_WIDTH) + WALL_WIDTH / 2,
                                                ((row * WALL_HEIGHT) + MAP_START_HEIGHT) + WALL_HEIGHT / 2], 
                                                [true,true,false,true]]);    
                    } else {

                        TURN_RECTS_CENTERS.push([[((col * WALL_WIDTH) + MAP_START_WIDTH) + WALL_WIDTH / 2,
                                                ((row * WALL_HEIGHT) + MAP_START_HEIGHT) + WALL_HEIGHT / 2], 
                                                [true,true,true,true]]);
                    }
                }
            }

            if(MAP[row][col] == 0) {
                CANVAS_CTX.fillStyle = EMPTY_RECT_COLOR;
                CANVAS_CTX.fillRect((col * WALL_WIDTH) + MAP_START_WIDTH,
                                      (row * WALL_HEIGHT) + MAP_START_HEIGHT,	
                                      WALL_WIDTH, 
                                      WALL_HEIGHT)
            }
        }
	}

    coordinates_saved = true;
    turn_rects_saved = true;
}

function drawPlayer() {
	CANVAS_CTX.fillStyle = PLAYER_COLOR;
	
	CANVAS_CTX.beginPath();
	//arc(x, y, radius, startAngle, endAngle, counterclockwise)
	CANVAS_CTX.arc(player_x, player_y, P_CIRCLE_RADIUS, 0, 2 * Math.PI);
	CANVAS_CTX.fill();
}

function movePlayer() {

    /* if any of the angle on the side of the direction the player is goning in
       touches a wall, it doesnt go further */
    switch(player_direction) {
        case UP:
            if(!isWall(player_x + (P_CIRCLE_RADIUS + PLAYER_WALL_SPACING-1), player_y - (P_CIRCLE_RADIUS + PLAYER_WALL_SPACING)) &&
                !isWall(player_x - (P_CIRCLE_RADIUS + PLAYER_WALL_SPACING-1), player_y - (P_CIRCLE_RADIUS + PLAYER_WALL_SPACING))) { 
                player_y -= PLAYER_SPEED;
            }
            break;
        case DOWN:
            if(!isWall(player_x + (P_CIRCLE_RADIUS + PLAYER_WALL_SPACING-1), player_y + (P_CIRCLE_RADIUS + PLAYER_WALL_SPACING)) &&
                !isWall(player_x - (P_CIRCLE_RADIUS + PLAYER_WALL_SPACING-1), player_y + (P_CIRCLE_RADIUS + PLAYER_WALL_SPACING))) { 
                player_y += PLAYER_SPEED;
            }
            break;
        case LEFT:
            if(!isWall(player_x - (P_CIRCLE_RADIUS + PLAYER_WALL_SPACING), player_y + (P_CIRCLE_RADIUS + PLAYER_WALL_SPACING-1)) && 
                !isWall(player_x - (P_CIRCLE_RADIUS + PLAYER_WALL_SPACING), player_y - (P_CIRCLE_RADIUS + PLAYER_WALL_SPACING-1))) { 
                player_x -= PLAYER_SPEED;
            }
            break;
        case RIGHT:
            if(!isWall(player_x + (P_CIRCLE_RADIUS + PLAYER_WALL_SPACING), player_y + (P_CIRCLE_RADIUS + PLAYER_WALL_SPACING-1)) &&
                !isWall(player_x + (P_CIRCLE_RADIUS + PLAYER_WALL_SPACING), player_y - (P_CIRCLE_RADIUS + PLAYER_WALL_SPACING-1))) {
                player_x += PLAYER_SPEED;
            }
            break;
    }
}

function findPlayerRect() {
    for(var wall_num=0; wall_num<RECT_COORDINATES.length; wall_num++) {
    
        if(player_x > RECT_COORDINATES[wall_num][PIXEL_COORDINATES][X] && 
            player_x < (RECT_COORDINATES[wall_num][PIXEL_COORDINATES][X] + WALL_WIDTH)) {
                
                if(player_y > RECT_COORDINATES[wall_num][PIXEL_COORDINATES][Y] &&
                    player_y < (RECT_COORDINATES[wall_num][PIXEL_COORDINATES][Y] + WALL_HEIGHT)) {
                        MAP[RECT_COORDINATES[wall_num][ARR_COORDINATES][ROW]][RECT_COORDINATES[wall_num][ARR_COORDINATES][COLUMN]] = 3;
                }
        }
    }
}

function addEventListener() {
    document.addEventListener("keypress", function(event) {
        switch(event.key) {
            case 's':
                if(!isWall(player_x + (P_CIRCLE_RADIUS + PLAYER_WALL_SPACING-1), player_y + (P_CIRCLE_RADIUS + PLAYER_WALL_SPACING)) &&
                    !isWall(player_x - (P_CIRCLE_RADIUS + PLAYER_WALL_SPACING-1), player_y + (P_CIRCLE_RADIUS + PLAYER_WALL_SPACING))) { 
                    player_direction = DOWN;
                    player_next_direction = DOWN;
                } else {
                    player_next_direction = DOWN;
                }
                break;
            case 'w':
                if(!isWall(player_x + (P_CIRCLE_RADIUS + PLAYER_WALL_SPACING-1), player_y - (P_CIRCLE_RADIUS + PLAYER_WALL_SPACING)) &&
                    !isWall(player_x - (P_CIRCLE_RADIUS + PLAYER_WALL_SPACING-1), player_y - (P_CIRCLE_RADIUS + PLAYER_WALL_SPACING))) { 
                    player_direction = UP;
                    player_next_direction = UP;
                } else {
                    player_next_direction = UP;
                }
                break;
            case 'd':
                if(!isWall(player_x + (P_CIRCLE_RADIUS + PLAYER_WALL_SPACING), player_y + (P_CIRCLE_RADIUS + PLAYER_WALL_SPACING-1)) &&
                    !isWall(player_x + (P_CIRCLE_RADIUS + PLAYER_WALL_SPACING), player_y - (P_CIRCLE_RADIUS + PLAYER_WALL_SPACING-1))) {
                    player_direction = RIGHT;
                    player_next_direction = RIGHT;
                } else {
                    player_next_direction = RIGHT;
                }
                break;
            case 'a':
                if(!isWall(player_x - (P_CIRCLE_RADIUS + PLAYER_WALL_SPACING), player_y + (P_CIRCLE_RADIUS + PLAYER_WALL_SPACING-1)) && 
                    !isWall(player_x - (P_CIRCLE_RADIUS + PLAYER_WALL_SPACING), player_y - (P_CIRCLE_RADIUS + PLAYER_WALL_SPACING-1))) { 
                    player_direction = LEFT;
                    player_next_direction = LEFT;
                } else {
                    player_next_direction = LEFT;
                }
                break;    
        }
    });
}

function isWall(x, y) {
    for(var wall_num=0; wall_num<RECT_COORDINATES.length; wall_num++) {

        if(x >= RECT_COORDINATES[wall_num][PIXEL_COORDINATES][X] && 
            x <= RECT_COORDINATES[wall_num][PIXEL_COORDINATES][X] + WALL_WIDTH ) {
            if(y >= RECT_COORDINATES[wall_num][PIXEL_COORDINATES][Y] &&
                y <= RECT_COORDINATES[wall_num][PIXEL_COORDINATES][Y] + WALL_HEIGHT) {
                return true;
            }
        }
    }
    return false;
}

function drawCoins() {
    CANVAS_CTX.fillStyle = COIN_COLOR;
    
    for(var coin_num = 0; coin_num<COINS.length; coin_num++) {

        if(COINS[coin_num] != null) {
            CANVAS_CTX.beginPath();
            CANVAS_CTX.arc(COINS[coin_num][X], COINS[coin_num][Y], COIN_RADIUS, 0, 2 * Math.PI);
            CANVAS_CTX.fill();
        }
    }
}

function addCoinsRow(row, start_col, end_col, edge_first=false, edge_last=false) {
    for(var col = start_col; col<=end_col; col++) {
        if(edge_first && col == start_col) {
            COINS.push([MAP_START_WIDTH + (WALL_WIDTH * (col-1)), MAP_START_HEIGHT + (WALL_HEIGHT * row) - (WALL_HEIGHT/2)]);
        }
        COINS.push([MAP_START_WIDTH + (WALL_WIDTH * col) - (WALL_WIDTH/2), MAP_START_HEIGHT + (WALL_HEIGHT * row) - (WALL_HEIGHT/2)]);
        if(col != end_col) {
            COINS.push([MAP_START_WIDTH + (WALL_WIDTH * col), MAP_START_HEIGHT + (WALL_HEIGHT * row) - (WALL_HEIGHT/2)]);    
        }
        if(edge_last && col == end_col) {
            COINS.push([MAP_START_WIDTH + (WALL_WIDTH * col), MAP_START_HEIGHT + (WALL_HEIGHT * row) - (WALL_HEIGHT/2)]);    
        }
    }
}

function addCoinsCol(col, start_row, end_row, edge_first=false, edge_last=false) {
    for(var row = start_row; row<=end_row; row++) {
        if(edge_first && row == start_row) {
            COINS.push([MAP_START_WIDTH + (WALL_WIDTH * col) - (WALL_WIDTH/2), MAP_START_HEIGHT + (WALL_HEIGHT * (row-1))]);
        }
        COINS.push([MAP_START_WIDTH + (WALL_WIDTH * col) - (WALL_WIDTH/2), MAP_START_HEIGHT + (WALL_HEIGHT * row) - (WALL_HEIGHT/2)]);
        if(row != end_row) {
            COINS.push([MAP_START_WIDTH + (WALL_WIDTH * col) - (WALL_HEIGHT/2), MAP_START_HEIGHT + (WALL_HEIGHT * row)]);
        }
        if(edge_last && row == end_row) {
            COINS.push([MAP_START_WIDTH + (WALL_WIDTH * col) - (WALL_HEIGHT/2), MAP_START_HEIGHT + (WALL_HEIGHT * row)]);
        }
    }
}

function collectCoins() {
    
    for(var coin_num = 0; coin_num<COINS.length; coin_num++) {
        if(COINS[coin_num] != null) {
            if((player_x + P_CIRCLE_RADIUS == COINS[coin_num][X] && player_y == COINS[coin_num][Y]) ||
               (player_x - P_CIRCLE_RADIUS == COINS[coin_num][X] && player_y == COINS[coin_num][Y]) ||
               (player_y + P_CIRCLE_RADIUS == COINS[coin_num][Y] && player_x == COINS[coin_num][X]) ||
               (player_y - P_CIRCLE_RADIUS == COINS[coin_num][Y] && player_x == COINS[coin_num][X])) {
                
                delete COINS[coin_num];
                PLAYER_SCORE += 1;

                if(PLAYER_SCORE < 10) {
                    SCORE_TEXT.innerHTML = "00" + PLAYER_SCORE;
                } else if (PLAYER_SCORE < 100 && PLAYER_SCORE >= 10) {
                    SCORE_TEXT.innerHTML = "0" + PLAYER_SCORE;
                } else {
                    SCORE_TEXT.innerHTML = "" + PLAYER_SCORE;
                }
            }
        }
    }
}


addCoinsRow(10,3,5, true);
addCoinsCol(2,7,10);
addCoinsRow(10,16,19);
addCoinsCol(19,7,9, false, true);
addCoinsCol(19,2,5);
addCoinsRow(2,16,18, false, true);
addCoinsRow(2,7,14);
addCoinsRow(10,7,14);
addCoinsCol(7,5,7, true, true);
addCoinsCol(14,5,7, true, true);
addCoinsCol(4,4,5);
addCoinsCol(4,7,8);
addCoinsCol(17,4,5);
addCoinsCol(17,7,8);
addCoinsRow(4,7,14);
addCoinsRow(8,7,14);

function gameLoop() {
    drawMap();
    if(COINS.length != 0) {
        drawCoins();
    }

    for(var turn_point_num=0; turn_point_num<TURN_RECTS_CENTERS.length; turn_point_num++) {

        if(player_x == TURN_RECTS_CENTERS[turn_point_num][CENTER_COORDINATES][X] &&
            player_y == TURN_RECTS_CENTERS[turn_point_num][CENTER_COORDINATES][Y]) {
            
            if(TURN_RECTS_CENTERS[turn_point_num][ALLOWED_DIRECTIONS][player_next_direction]) {
                player_direction = player_next_direction;
            }
            
        }
    }
    drawPlayer();
    movePlayer();
    collectCoins();

    setTimeout(gameLoop, FRAME_TIME);
}

addEventListener();
setTimeout(gameLoop, FRAME_TIME);


