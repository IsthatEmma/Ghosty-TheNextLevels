// A starter template for side-scrolling games like our platformer
kaboom({
 width: 1400,
 height: 800,
 background: [0, 100, 200],
});

setGravity(800);

// Load a player sprite
loadSprite("ghosty", "https://kaboomjs.com/sprites/ghosty.png");
loadSprite("enemy", "https://kaboomjs.com/sprites/mushroom.png");
loadSprite("pineapple", "https://kaboomjs.com/sprites/pineapple.png");
loadSprite("door", "https://kaboomjs.com/sprites/door.png");
loadSprite("cloud", "https://kaboomjs.com/sprites/cloud.png");

// --- The Player Character ---
const player = add([
 sprite("ghosty"),
 pos(100, 100),
 area({ scale: 0.7 }),
 body(),
]);

// --- The World ---
add([
 rect(width(), 48),
 pos(0, height() - 48),
 area(),
 body({ isStatic: true }),
]);

// --- Movement Controls ---
onKeyDown("left", () => {
 player.move(-200, 0);
});
onKeyDown("right", () => {
 player.move(200, 0);
});
onKeyPress("space", () => {
 if (player.isGrounded()) {
 player.jump(650);
 }
});

function patrol() {
    return {
        id: "patrol",
        require: [ "pos", "area" ],
        dir: -1,
        add() {
            this.onCollide((obj, col) => {
                if (col.isLeft() || col.isRight()) {
                    this.dir = -this.dir;
                }
            });
        },
        update() {
            this.move(60 * this.dir, 0);
        },
    };
}

// The Main Game Scene wowzersss 
scene("main", ({ level } = { level: 0 }) => {
   // the levels
   const LEVELS = [
       [
           "                    ",
           "                    ",
           "    =     $    =   D ",
           "    $           $     ",
           "  =    ^  =      =  ",
           " $                 ",
           "====================",
       ],
       [
           "                  D ",
           "         =           ",
           "    =         =   = ",
           "  $         $  $       ",
           "  =    ^  =      =  ",
           "         $          ",
           "====================",
       ],
       [
           "                   ",
           "                    ",
           "    =         =    ",
           "                    ",
           "  =    ^  =      =  ",
           " $           $     D ",
           "====================",
       ],
       [
           "   $            $    ",
           "         =           ",
           "    =         =   D ",
           "                    ",
           "  =    ^  =   =   =  ",
           " $                  ",
           "====================",
       ],
       [
           "                   D ",
           "     $       $    =    ",
           "    =         =     ",
           "                    ",
           "  =    ^  =      =  ",
           " $                ",
           "====================",
       ]
   ];
   const currentLevel = level;
   
   const levelConf = {
    tileWidth: 47, 
    titeHeight: 47, 
    tiles: {
        " ": () => [],
            "=": () => [
                rect(47, 47),
                color(0, 300, 0),
                area(),
                body({ isStatic: true }),
                "platform",
            ],
         "$": () => [
                sprite("pineapple"),
                area(),
                "pineapple",
            ],
             "D": () => [
                sprite("door"),
                area(),
                "door", 

            ],

             "^": () => [
                sprite("enemy"),
                area(),
                body(),
                patrol(),
                "enemy",
            ],
        }
    };

    addLevel(LEVELS[currentLevel], levelconf);

    let score = 0;
    const scoreLabel = add([
        text("pineapple:" + score),
        pos(24,24),
        fixed(),
    ]);