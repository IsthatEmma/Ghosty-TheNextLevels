// A starter template for side-scrolling games like our platformer

//Background on the game ! 
kaboom({
    width: 1400,
    height: 707,
    background: [234, 205, 159],
    
});


// Setting the set Gravity to 800
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
loadSound("IntroMusic", "IntroMusic.mp3");
// I used most of these audios from tiktok and converted them into a mp3, 
// I hope that is okay!


// The patrol section
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

// Opening Intro I came up with, 
// Unfortionately I did not know how to program a opening intro the game,
// so I asked AI how I could do that.
scene("intro", () => {
    const introSong = play("IntroMusic", { loop: true, volume: 0.8 });
    // A black background as my opening intro to the game! :) 
    add([
        rect(width(), height()),
        color(0, 0, 0),
        pos(0, 0),
    ]);
    // The title of the Game!
wait(0.1, () => {
    add([
        text("Ghosty & the next Levels!🎃", {
            size: 60,
            width: 1000,
        }),
        pos(center().x, center().y - 100),
        anchor("center"),
    ]);
});
    // A short description of how to help Ghosty!
wait(1, () => {
    add([
        text("Help Ghosty collect pineapples, avoid mushrooms and reach the portal!", {
            size: 24,
        }),
        pos(center().x, center().y),
        anchor("center"),
    ]);
});

// I created a somewhat fade in text right on beat with the opening song,
// to give it more a cool intro effect, the song should be on beat though
wait(1.8, () => {
    const startText = add([
        text("Press SPACE to Start", {
            size: 28,
        }),
        pos(center().x, center().y + 120),
        anchor("center"),
        color(255, 242, 204),
    ]);

    // I asked AI to show me how to program a flashing effect when the,
    // text says "press space to start" on the screen
    loop(0.4, () => {
        startText.hidden = !startText.hidden;
    });
});
// Once the player presses the space bar, the game begins immediately 
    onKeyPress("space", () => {

        // I asked AI how I could program to stop a intro song,
        //  so it wont continue forever in the actual game
        introSong.stop();
        play("backgroundMusic", { loop: true, volume: 0.8 });
        // Goes to the main scene | starts from the beginning
        go("main", { level: 0 });
    });
});



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
            "==============================",
            "==============================",
           
                               
        ], 
        [
            "         $          ",
            "         =           ",
            "    =         =     ",
            "  $               $     D",
            "  =      =   ^   =  ",
            "    ^     $       ^   =",
            "==============================",
            "==============================",
            "==============================",
        ],
        [
            "                         ",
            "        =                D",
            "    =         =       ==    ",
            "         $             $  ",
            "   =    ^  =   ^   =      ",
            "      ^      $       ^   ==",
            "==============================",
            "==============================",
            "==============================",
        ],
        [
            "                  $    ",
            "    $    =    $       ",
            "    =         =      D ",
            "                     ",
            "  =    ^  =  ^ =   =  ",
            " $               ^    = ",
           "==============================",
            "==============================",
            "==============================",
        ],
        [
            "                      D ",
            "     $       $    =    ",
            "    =         =        ",
            "                  $     ",
            "  =    ^  =       =    ",
            "         ^  =   ^   =  ^  ^ = =",
            "==============================",
            "==============================",
            "==============================",

        
        ]
    ];

    const currentLevel = level;

   
    const levelConf = {
        tileWidth: 47,
        tileHeight: 47,
        tiles: {
            " ": () => [],
            "=": () => [
                // "=" means platform
                rect(47, 47),
                color(236, 226, 209),
                outline(3, rgb(0, 0, 0)),
                area(),
                body({ isStatic: true }),
                "platform",
                
            ],
            // $ = pineapple
            "$": () => [
                sprite("pineapple"),
                area(),
                "pineapple",
            ],
            // D = Door
            "D": () => [
                sprite("portal"), 
                area(),
                "portal",
            ],
            // "^" = the enemy (the mushroom)
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

    // The ScoreKeeper
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
        // Coin music will be played! :) 
        play("CoinMusic");
        // Every single pineapple is worth 20 points each!
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
            // boom sprite
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
            // lighting sprite
            sprite("lighting"), 
            pos(enemy.pos),
            lifespan(2.4),
            scale(2),
        ]);

        // Waiting for 2 seconds only then switching to the lose scene
        // Almost like a time.sleep function I always like to put in my games.
        wait(2, () => go("lose"));
    }
});

    // Door | portal sprite included
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

    // I also asked AI how I could make an outro with a backgroud
    add([
        rect(width(), height()),
        color(0, 0, 0),
        pos(0, 0),
    ]);

    // A text will appear below saying "Yippe, You won" once you reach the end of the game.
    add([
        text("Yippe, You Won :D !", {
            size: 48,
        }),
        pos(center()),
        anchor("center"),
        color(255, 255, 255)
    ]);

    wait(3.4, () => {
        go("main", { level: 0 });
    });
});
scene("lose", () => {
    const mid = center(); 

    const line1 = add([
        text("Game Over", { size: 48 }), 
        pos(mid),
        anchor("center"),
    ]);
    add([
        // I asked AI how to size text and how to make the text be in the center more.
        text("(imagine losing lol)", { size: 24 }),
        pos(mid.x, mid.y + line1.height / 2 + 10), 
    
]);
    wait(3, () => { go("main", { level: 0 }); });
});



// Starting Ghosty & the next Levels game!
go("intro");
// Starting at the intro so the intro opening can play! 
// I like games that have a cute opening haha.