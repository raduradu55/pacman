

const CANVAS = document.getElementById("canvas");
const CANVAS_CTX = CANVAS.getContext("2d");
const CANV_WIDTH = CANVAS.width;
const CANV_HEIGHT = CANVAS.height;

// colors che canvas black
CANVAS_CTX.fillStyle = "#000000";
CANVAS_CTX.fillRect(0, 0, CANV_WIDTH, CANV_HEIGHT);

// map
const WALL = 1;
const MAP = [[WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL],
			 [WALL, 0   , 0   , 0   , 0   , WALL, 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , WALL, 0   , 0   , 0   , 0   , WALL],
			 [WALL, 0   , WALL, WALL, 0   , WALL, 0   , WALL, WALL, WALL, WALL, WALL, WALL, 0   , WALL, 0   , WALL, WALL, 0   , WALL],
			 [WALL, 0   , WALL, 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , WALL, 0   , WALL],
			 [WALL, 0   , WALL, 0   , WALL, WALL, 0   , WALL, WALL, 0   , 0   , WALL, WALL, 0   , WALL, WALL, 0   , WALL, 0   , WALL],
			 [WALL, 0   , 0   , 0   , 0   , 0   , 0   , WALL, 0   , 0   , 0   , 0   , WALL, 0   , 0   , 0   , 0   , 0   , 0   , WALL],
			 [WALL, 0   , WALL, 0   , WALL, WALL, 0   , WALL, WALL, WALL, WALL, WALL, WALL, 0   , WALL, WALL, 0   , WALL, 0   , WALL],
			 [WALL, 0   , WALL, 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , WALL, 0   , WALL],
			 [WALL, 0   , WALL, WALL, 0   , WALL, 0   , WALL, WALL, WALL, WALL, WALL, WALL, 0   , WALL, 0   , WALL, WALL, 0   , WALL],
			 [WALL, 0   , 0   , 0   , 0   , WALL, 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , WALL, 0   , 0   , 0   , 0   , WALL],
			 [WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL]]

// walls
const WALL_COLOR = "#434afa";
const WALL_WIDTH = 25;
const WALL_HEIGHT = WALL_WIDTH;

const CON_WALL_COLOR = "#57a8ff";
const CON_WALL_WIDTH = 15;
const CON_WALL_HEIGHT = CON_WALL_WIDTH;

// map centering calculations
const MAP_HEIGHT = MAP.length * WALL_HEIGHT;
const MAP_WIDTH = MAP[0].length * WALL_WIDTH;
const MAP_START_WIDTH = (CANV_WIDTH-MAP_WIDTH) / 2;
const MAP_START_HEIGHT = (CANV_HEIGHT-MAP_HEIGHT) / 2;

// player 
const PLAYER_COLOR = "#f7f743";
const PLAYER_WALL_SPACING = 2
const P_CIRCLE_RADIUS = (WALL_WIDTH / 2) - PLAYER_WALL_SPACING;
const PLAYER_SPEED = 5;

var player_row = 6;
var player_col = 9;
var player_x = (((player_col * WALL_WIDTH) + MAP_START_WIDTH) - P_CIRCLE_RADIUS) - PLAYER_WALL_SPACING;
var player_y = (((player_row * WALL_HEIGHT) + MAP_START_HEIGHT) - P_CIRCLE_RADIUS) - PLAYER_WALL_SPACING;

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

                CANVAS_CTX.fillStyle = CON_WALL_COLOR;
                CANVAS_CTX.fillRect((col * WALL_WIDTH) + MAP_START_WIDTH + (CON_WALL_WIDTH / 2),
                                    (row * WALL_HEIGHT) + MAP_START_HEIGHT + (CON_WALL_HEIGHT / 2),	
                                    WALL_WIDTH - CON_WALL_WIDTH, 
                                    WALL_HEIGHT - CON_WALL_HEIGHT);	
            
            
            }

            if(MAP[row][col] == 0) {
                CANVAS_CTX.fillStyle = "#000000";
                CANVAS_CTX.fillRect((col * WALL_WIDTH) + MAP_START_WIDTH,
                                      (row * WALL_HEIGHT) + MAP_START_HEIGHT,	
                                      WALL_WIDTH, 
                                      WALL_HEIGHT)	
            }
        }
	}
}

function drawPlayer() {
    drawMap();
	CANVAS_CTX.fillStyle = PLAYER_COLOR;
	
	CANVAS_CTX.beginPath();
	//arc(x, y, radius, startAngle, endAngle, counterclockwise)
	CANVAS_CTX.arc(player_x, player_y, P_CIRCLE_RADIUS, 0, 2 * Math.PI);
	CANVAS_CTX.fill();
}

document.addEventListener("keypress", function(event) {
    // TODO: pacman style movemnt
    switch(event.key) {
        case 's':
            player_y += PLAYER_SPEED;
            drawPlayer();
            break;
        case 'w':
            player_y -= PLAYER_SPEED;
            drawPlayer();
            break;
        case 'd':
            player_x += PLAYER_SPEED;
            drawPlayer();
            break;
        case 'a':
            player_x -= PLAYER_SPEED;
            drawPlayer();
            break;    
    }
});

drawMap();
drawPlayer();

