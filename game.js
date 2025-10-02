//Background of the Game
kaboom({
    width: 1400,
    height: 900,
    background: [0, 100, 200],
});
//Setting the gravitiy frfr
setGravity(800);

loadSprite("ghosty", "https://kaboomjs.com/sprites/ghosty.png");
loadSprite("enemy", "https://kaboomjs.com/sprites/mushroom.png");
loadSprite("pineapple", "https://kaboomjs.com/sprites/pineapple.png");
loadSprite("door", "https://kaboomjs.com/sprites/door.png");
loadSprite("cloud", "https://kaboomjs.com/sprites/cloud.png");


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

// --- Main Game Scene ---
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