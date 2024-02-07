

const CANVAS = document.getElementById("canvas");
const CANVAS_CTX = CANVAS.getContext("2d");
const CANV_WIDTH = CANVAS.width;
const CANV_HEIGHT = CANVAS.height;

const FPS = 60;
const FRAME_TIME = 1000 / FPS;

// colors che canvas black
CANVAS_CTX.fillStyle = "#000000";
CANVAS_CTX.fillRect(0, 0, CANV_WIDTH, CANV_HEIGHT);

// map
const WALL = 1;
const PYER = 2; // player
var MAP =   [[WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL],
		     [WALL, 0   , 0   , 0   , 0   , WALL, 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , WALL, 0   , 0   , 0   , 0   , WALL],
			 [WALL, 0   , WALL, WALL, 0   , WALL, 0   , WALL, WALL, WALL, WALL, WALL, WALL, 0   , WALL, 0   , WALL, WALL, 0   , WALL],
			 [WALL, 0   , WALL, 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , WALL, 0   , WALL],
			 [WALL, 0   , WALL, 0   , WALL, WALL, 0   , WALL, WALL, 0   , 0   , WALL, WALL, 0   , WALL, WALL, 0   , WALL, 0   , WALL],
			 [WALL, 0   , 0   , 0   , 0   , 0   , 0   , WALL, 0   , 0   , 0   , 0   , WALL, 0   , 0   , 0   , 0   , 0   , 0   , WALL],
			 [WALL, 0   , WALL, 0   , WALL, WALL, 0   , WALL, WALL, WALL, WALL, WALL, WALL, 0   , WALL, WALL, 0   , WALL, 0   , WALL],
			 [WALL, 0   , WALL, 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , WALL, 0   , WALL],
			 [WALL, 0   , WALL, WALL, 0   , WALL, 0   , WALL, WALL, WALL, WALL, WALL, WALL, 0   , WALL, 0   , WALL, WALL, 0   , WALL],
			 [WALL, 0   , 0   , 0   , 0   , WALL, 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , WALL, 0   , 0   , 0   , 0   , WALL],
			 [WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL]];

// walls
const EMPTY_RECT_COLOR = "#000000";

const WALL_COLOR = "#434afa";
const WALL_WIDTH = 25;
const WALL_HEIGHT = WALL_WIDTH;

const CON_WALL_COLOR = "#000000";
const CON_WALL_WIDTH = 15;
const CON_WALL_HEIGHT = CON_WALL_WIDTH;

var RECT_COORDINATES = [];
var coordinates_saved = false;
const X = 0, Y = 1, PIXEL_COORDINATES = 1, ARR_COORDINATES = 0, ROW = 0, COLUMN = 1;

// map centering calculations
const MAP_HEIGHT = MAP.length * WALL_HEIGHT;
const MAP_WIDTH = MAP[0].length * WALL_WIDTH;
const MAP_START_WIDTH = (CANV_WIDTH-MAP_WIDTH) / 2;
const MAP_START_HEIGHT = (CANV_HEIGHT-MAP_HEIGHT) / 2;

// player 
const PLAYER_COLOR = "#f7f743";
const PLAYER_WALL_SPACING = 2
const P_CIRCLE_RADIUS = (WALL_WIDTH / 2) - PLAYER_WALL_SPACING;
const PLAYER_SPEED = 1.5;
const UP = 1, DOWN = 2, LEFT = 3, RIGHT = 4;

var player_row = 1;
var player_col = 1;

var player_x = ((((player_col+1) * WALL_WIDTH) + MAP_START_WIDTH) - P_CIRCLE_RADIUS) - PLAYER_WALL_SPACING;
var player_y = ((((player_row+1) * WALL_HEIGHT) + MAP_START_HEIGHT) - P_CIRCLE_RADIUS) - PLAYER_WALL_SPACING;
var player_direction = 0;

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
}

function drawPlayer() {
	CANVAS_CTX.fillStyle = PLAYER_COLOR;
	
	CANVAS_CTX.beginPath();
	//arc(x, y, radius, startAngle, endAngle, counterclockwise)
	CANVAS_CTX.arc(player_x, player_y, P_CIRCLE_RADIUS, 0, 2 * Math.PI);
	CANVAS_CTX.fill();
}

function movePlayer() {
    switch(player_direction) {
        case UP:
            player_y -= PLAYER_SPEED;
            break;
        case DOWN:
            player_y += PLAYER_SPEED;
            break;
        case LEFT:
            player_x -= PLAYER_SPEED;
            break;
        case RIGHT:
            player_x += PLAYER_SPEED;
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
                player_direction = DOWN;
                break;
            case 'w':
                player_direction = UP;
                break;
            case 'd':
                player_direction = RIGHT;
                break;
            case 'a':
                player_direction = LEFT;
                break;    
        }
    });
}

function playerCollisionCheck() {
    for(var wall_num = 0; wall_num<RECT_COORDINATES.length; wall_num++) {

        if((player_y + P_CIRCLE_RADIUS) >= RECT_COORDINATES[wall_num][PIXEL_COORDINATES][Y] &&
           (player_y - P_CIRCLE_RADIUS) <= RECT_COORDINATES[wall_num][PIXEL_COORDINATES][Y] + WALL_HEIGHT) {
            if((player_x + P_CIRCLE_RADIUS) >= RECT_COORDINATES[wall_num][PIXEL_COORDINATES][X] &&
               (player_x - P_CIRCLE_RADIUS) <= RECT_COORDINATES[wall_num][PIXEL_COORDINATES][X] + WALL_WIDTH) {
                
                switch(player_direction) {
                    case UP:
                        player_y += PLAYER_WALL_SPACING;
                        break;
                    case DOWN:
                        player_y -= PLAYER_WALL_SPACING;
                        break;
                    case RIGHT:
                        player_x -= PLAYER_WALL_SPACING;
                        break;
                    case LEFT:
                        player_x += PLAYER_WALL_SPACING;
                        break
                }
                player_direction = 0;       
            }
        }
    }
}

function gameLoop() {
    drawMap();
    movePlayer();
    drawPlayer();
    playerCollisionCheck();

    setTimeout(gameLoop, FRAME_TIME);
}

addEventListener();
setTimeout(gameLoop, FRAME_TIME);


