// A starter template for side-scrolling games like our platformer

//Background on the game ! 
kaboom({
    width: 1400,
    height: 707,
    background: [234, 205, 159],
    // background: [116, 71, 0],
});



setGravity(800);

// Loading in my loadsounds, character sprites + features of the background, (sun, cloud, etc.)
loadSprite("ghosty", "https://kaboomjs.com/sprites/ghosty.png");
loadSprite("enemy", "https://kaboomjs.com/sprites/mushroom.png");
loadSprite("pineapple", "https://kaboomjs.com/sprites/pineapple.png");
loadSprite("portal", "https://kaboomjs.com/sprites/portal.png");
loadSprite("cloud", "https://kaboomjs.com/sprites/cloud.png");
loadSprite("sun", "https://kaboomjs.com/sprites/sun.png");
loadSound("backgroundMusic", "/Background.mp3");
loadSound("boomMusic", "/BoomMusic.mp3 ");
loadSound("CoinMusic", "/Coin.mp3");
loadSound("GameOver", "/GameOver.mp3");
loadSound("VictoryMusic", "/VictoryMusic.mp3");
loadSprite("lighting", "https://kaboomjs.com/sprites/lightening.png");


// Letting the background Music run constantly, loop = true
let music = play("backgroundMusic", { loop: true });

// The patrol
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


// This is my main scene! 
scene("main", ({ level } = { level: 0 }) => {

// Beginning to add sprites into the main scene.
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

    // 5 Different levels! 
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
            " $               ^    = ",
            "==================================",
        ],
        [
            "                      D ",
            "     $       $    =    ",
            "    =         =        ",
            "                  $     ",
            "  =    ^  =   ^   =    ",
            "         ^     ^         ^=",
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
                sprite("portal"), 
                area(),
                "portal",
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

    // ScoreKeeper
    let score = 0;
    const scoreLabel = add([
        text("pineapple: " + score),
        pos(24, 24),
        fixed(),
    ]);

   // The Player
    const player = add([
        sprite("ghosty"),
        pos(100, 100),
        area({ scale: 0.7 }),
        body(),
        "player",
    ]);

    // The Movement + Jumping
    onKeyDown("left", () => { player.move(-200, 0); });
    onKeyDown("right", () => { player.move(200, 0); });
    onKeyPress("space", () => { 
        if (player.isGrounded()) { 
            player.jump(650);
        } 
    });


    // Player collecting pineapples
    player.onCollide("pineapple", (pineapple) => {
        destroy(pineapple);
        play("CoinMusic");
        score += 20;
        scoreLabel.text = "pineapple: " + score;
    });

    //  Loading in my boom sprite 
loadSprite("boom", "https://kaboomjs.com/sprites/kaboom.png");


    player.onCollide("enemy", (enemy, col) => {
    if (col.isBottom()) {
        // "boomMusic" will be played !
        play("boomMusic");
        destroy(enemy);
        player.jump(300);

        // This will pixelated boom sound effect when the player jumps onto the mushroom
        add([
            sprite("boom"),
            pos(enemy.pos),
            lifespan(0.5), 
            scale(1), 
        ]);
    } else {
        destroy(player);
        // This will play a fatality sound effect when the player runs into the enemy "the mushroom"
        play("GameOver", { volume: 3 }); 

        // When the player dies, a lighting sprite will be shown to show that the player has died
        add([
            sprite("lighting"), 
            pos(enemy.pos),
            lifespan(2.4),
            scale(2),
        ]);

        // Waiting for 2 seconds only then switching to the lose scene
        wait(2, () => go("lose"));
    }
});

    // Door / portal sprite 
player.onCollide("portal", () => {
    const nextLevel = currentLevel + 1;
    if (nextLevel < LEVELS.length) {
        go("main", { level: nextLevel });
    } else {
        go("win");
        }
    });
});




// The win & lose scene
scene("win", () => {
    play("VictoryMusic", { volume: 3 }); 
    add([ text("You Win!"), pos(center()), anchor("center") ]);
    wait(3.4, () => { go("main", { level: 0 }); });

});
scene("lose", () => {
    const mid = center(); 

    const line1 = add([
        text("Game Over", { size: 48 }), 
        pos(mid),
        anchor("center"),
    ]);
    add([
        text("(imagine losing lol)", { size: 24 }),
        pos(mid.x, mid.y + line1.height / 2 + 10), 
    
]);
    wait(3, () => { go("main", { level: 0 }); });
});



// Starting the Game!
go("main", { level: 0 });