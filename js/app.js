/**
 * Global constants.
 */
const blockHeight = 83;
const maxHeight = 83 * 5;
const blockWidth = 101;
const maxWidth = 101 * 4;

/**
 * Sprite is the base class for all the moving objects within this game.
 * This provides basic methods for positioning an object such as rendering @see render. 
 */
class Sprite {
    constructor() {
        this.x = 0;
        this.y = 0;
    }

    /**
     * This method updates the position of the sprite.
     * Should multiply any movement by the dt parameter,
     * which will ensure the game runs at the same speed for all computers. 
     * @param {delta as a fraction} dt 
     */
    update(dt, allSprites) {
        return Events.EMPTY;
    }

    /**
     * Draws the sprite on the screen.
     */
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    /**
     * Decides whether two sprites have collided with each other.
     * @param sprite 
     */
    collide(sprite) {
        const deltaX = this.getX() - sprite.getX();
        const deltaY = this.getY() - sprite.getY();
        return Math.abs(deltaX) < (blockWidth / 2) && Math.abs(deltaY) < (blockHeight / 2);
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

}


/**
 * Enemy class that the player must avoid.
 * Enemy movement is controlled by the computer @see update.
 * */
class Enemy extends Sprite {
    constructor() {
        super();
        this.reset();
        this.sprite = 'images/enemy-bug.png';
    }

    /**
     * This method updates the position of the sprite.
     * Should multiply any movement by the dt parameter,
     * which will ensure the game runs at the same speed for all computers. 
     * @param {delta value in milliseconds} dt 
     * @returns an event, so the caller can make actions based on the returned events @see  Events 
     */
    update(dt, allSprites) {
        if (this.x >= maxWidth) {
            this.reset();
        }
        else {
            this.x += blockWidth * dt * this.speed;
        }
        return Events.EMPTY;
    }

    reset() {
        this.x = 0;
        //randomize the initial position of the enemy on y axis  
        this.y = ((Math.floor(Math.random() * 5) + 1) * blockHeight);
        //randomize the speed of the enemy
        this.speed = Math.ceil(Math.random() * 3);
    }
}


/**
 * Player class
 * Player movement is controlled by the user @see handleInput.
 * */
class Player extends Sprite {
    constructor() {
        super();
        this.reset();
        this.sprite = 'images/char-pink-girl.png';
    }

    /**
     * Sets x & y coordinates according to the key command.
     * Always multiplied by either blockHeight or blockWidth to make sure the palyer moves a whole block.    
     */
    handleInput(key) {
        switch (key) {
            case 'up':
                this.y -= blockHeight;
                break;
            case 'down':
                this.y += blockHeight;
                break;
            case 'left':
                this.x -= blockWidth;
                break;
            case 'right':
                this.x += blockWidth;
                break;
            default:
                ;
        }
    }

    update(dt, allSprites) {
        //make sure that player does not move out of the limits.
        this.y = Math.min(this.y, maxHeight);
        this.y = Math.max(this.y, 0);
        this.x = Math.min(this.x, maxWidth);
        this.x = Math.max(this.x, 0);
        return this.checkEvents(allSprites);
    }

    /**
     * Checks whether the player has reached the water or collided with an enemy.
     * @param allSprites 
     */
    checkEvents(allSprites) {

        if (this.y == 0) {
            return Events.TURN_WON;
        }

        for (const sprite of allSprites) {
            if (sprite instanceof Enemy && sprite.collide(this)) {
                return Events.TURN_LOST;
            }
        }
        return Events.EMPTY;
    }

    reset() {
        //randomize the initial position of the player on x axis  
        this.x = (Math.floor(Math.random() * 3) + 2) * blockWidth;
        this.y = 5 * blockHeight;
    }
}

var Events = {
    EMPTY: 0,
    TURN_LOST: 1,
    TURN_WON: 2,
    properties: {
        1: { message: "Game over!", value: 1 },
        2: { message: "You won!!", value: 3 }
    }
};

let allSprites = [];
let player = new Player();

/**
 * Initilaize sprites. 
 */
function initSprites() {
    allSprites = [];
    for (let i = 0; i < 3; i++) {
        allSprites.push(new Enemy());
    }
    //It is importnat that the player is added to the end of the array.
    player = new Player();
    allSprites.push(player);
};

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
