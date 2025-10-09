// A starter template for side-scrolling games like our platformer
kaboom({
    width: 1400,
    height: 800,
    background: [234, 205, 159],
    // background: [116, 71, 0],
});



setGravity(800);

// Loading sprites
loadSprite("ghosty", "https://kaboomjs.com/sprites/ghosty.png");
loadSprite("enemy", "https://kaboomjs.com/sprites/mushroom.png");
loadSprite("pineapple", "https://kaboomjs.com/sprites/pineapple.png");
loadSprite("door", "https://kaboomjs.com/sprites/door.png");
loadSprite("cloud", "https://kaboomjs.com/sprites/cloud.png");
loadSprite("sun", "https://kaboomjs.com/sprites/sun.png");
loadSound("backgroundMusic", "/music.mp3");
const music = play ("backgroundMusic", { loop: true});


// --- Enemy patrol component ---
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



scene("main", ({ level } = { level: 0 }) => {

    add([
        sprite("sun"),
        pos(1200, -2),
        scale(3),
        "sun"
         ]);
    
    add([
        sprite("cloud"),
        pos(300, -1),
        scale(2),
        "cloud"
         ]);

    add([
        sprite("cloud"),
        pos(600, -1),
        scale(2),
        "cloud"
         ]);

    add([
        sprite("cloud"),
        pos(900, -1),
        scale(2),
        "cloud"
         ]);

    const LEVELS = [
        [
            "                    ",
            "    $                ",
            "    =     $    =    $ ",
            "                 $ =   = ",
            "  =      =  ^    =    ",
            " $    ^             ^  =   D",
            "==============================",
        ], 
        [
            "         $          ",
            "         =           ",
            "    =         =     ",
            "  $               $     D",
            "  =      =   ^   =  ",
            "    ^     $       ^   =",
            "===============================",
        ],
        [
            "                         ",
            "        =                D",
            "    =         =       ==    ",
            "         $             $  ",
            "   =    ^  =   ^   =      ",
            "      ^      $        ^   ==",
            "=================================",
        ],
        [
            "                  $    ",
            "    $    =    $       ",
            "    =         =      D ",
            "                     ",
            "  =    ^  =  ^ =   =  ",
            " $               ^   ^ = ",
            "==================================",
        ],
        [
            "                      D ",
            "     $       $    =    ",
            "  ^  =         =        ",
            "                  $     ",
            "  =    ^  =   ^   =    ",
            " $        ^     ^         ^=",
            "==================================",
        ]
    ];

    const currentLevel = level;

   
    const levelConf = {
        tileWidth: 47,
        tileHeight: 47,
        tiles: {
            " ": () => [],
            "=": () => [
                rect(47, 47),
                color(236, 226, 209),
                outline(3, rgb(0, 0, 0)),
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
        },
    };

    addLevel(LEVELS[currentLevel], levelConf);

 
    let score = 0;
    const scoreLabel = add([
        text("pineapple: " + score),
        pos(24, 24),
        fixed(),
    ]);

   
    const player = add([
        sprite("ghosty"),
        pos(100, 100),
        area({ scale: 0.7 }),
        body(),
        "player",
    ]);

    // Movement
    onKeyDown("left", () => { player.move(-200, 0); });
    onKeyDown("right", () => { player.move(200, 0); });
    onKeyPress("space", () => { 
        if (player.isGrounded()) { 
            player.jump(650);
        } 
    });


    // Collecting pineapples
    player.onCollide("pineapple", (pineapple) => {
        destroy(pineapple);
        score += 20;
        scoreLabel.text = "pineapple: " + score;
    });

loadSprite("boom", "https://kaboomjs.com/sprites/boom.png");

    player.onCollide("enemy", (enemy, col) => {
        if (col.isBottom()) {
            destroy(enemy);
            player.jump(300);


            add([
                sprite("boom"),
                pos(enemy.pos),
                lifespan(0.5), 
                scale(1), 
                ]);
        } else {
            destroy(player);
            go("lose");
        }
    });

    player.onCollide("door", () => {
        if (currentLevel + 1 < LEVELS.length) {
            go("main", { level: currentLevel + 1 });
        } else {
            go("win");
        }
    });
});

scene("lose", () => {
    add([ text("Game Over"), pos(center()), anchor("center") ]);
    wait(2, () => { go("main", { level: 0 }); });
});

// --- Win Scene ---
scene("win", () => {
    add([ text("You Win!"), pos(center()), anchor("center") ]);
    wait(2, () => { go("main", { level: 0 }); });
});
''

// Start the game
go("main");
