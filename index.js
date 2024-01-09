//creates full page canvas

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
console.log(c)

const scoreEl = document.querySelector('#scoreEl')


canvas.width = innerWidth
canvas.height = innerHeight

//creates game boundaries using squares (object instance)

class Boundary {
    static width = 40
    static height = 40
    constructor({ position, image }) {
        this.position = position
        this.width = 40
        this.height = 40
        this.image = image
    }
    //fill for boundary
    draw() {
        // c.fillStyle = 'blue'
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

//Pacman avatar
class Player {
    constructor({ position, velocity }) {
        this.position = position
        this.velocity = velocity
        this.radius = 15
        this.radians = 0.75
        this.openRate = 0.12
        this.rotation = 0
    }

    //Blueprint of Pacman 
    draw() {
        c.save()
        c.translate(this.position.x, this.position.y)
        c.rotate(this.rotation)
        c.translate(-this.position.x, -this.position.y)

        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0 + this.radians, Math.PI * 2 - this.radians)
        c.lineTo(this.position.x, this.position.y)
        c.fillStyle = 'yellow'
        c.fill()
        c.closePath()
        c.restore()
    }

    //Determines how player should move when a key is hit
    update() {
        this.draw()
        //adds velocity to the position
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.radians < 0 || this.radians > .75) this.openRate = -this.openRate

        this.radians += this.openRate
    }
}

//Ghost avatar
class Ghost {
    static speed = 2
    constructor({ position, velocity, color = 'red' }) {
        this.position = position
        this.velocity = velocity
        this.radius = 15
        this.color = color
        //empty array that stores current ghost collisions
        this.prevCollisions = []
        this.speed = 2
        this.scared = false
    }

    //Blueprint of Ghost plust scared condition
    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = this.scared ? 'blue' : this.color
        c.fill()
        c.closePath()
    }

    //Determines how ghost should move when a key is hit
    update() {
        this.draw()
        //adds velocity to the position
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}


//Pacman pellets
class Pellet {
    constructor({ position }) {
        this.position = position
        this.radius = 3
    }

    //Blueprint of pellets 
    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'white'
        c.fill()
        c.closePath()
    }
}

//Pacman powerups
class Powerup {
    constructor({ position }) {
        this.position = position
        this.radius = 8
    }

    //Blueprint of powerups 
    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'white'
        c.fill()
        c.closePath()
    }
}


//Empty array to place pellets using switch case
const pellets = []
const boundaries = []
const powerups = []
//Array of ghost instances + ghost placement
const ghosts = [
    new Ghost({
        position: {
            x: Boundary.width * 6 + Boundary.width / 2,
            y: Boundary.height + Boundary.height / 2
        },
        velocity: {
            x: Ghost.speed,
            y: 0
        }
    }),
    new Ghost({
        position: {
            x: Boundary.width * 8 + Boundary.width / 2,
            y: Boundary.height * 3 + Boundary.height / 2
        },
        velocity: {
            x: Ghost.speed,
            y: 0
        },
        color: 'pink'
    }),
    new Ghost({
        position: {
            x: Boundary.width * 8 + Boundary.width / 2,
            y: Boundary.height * 7 + Boundary.height / 2
        },
        velocity: {
            x: Ghost.speed,
            y: 0
        },
        color: 'cyan'
    }),
    new Ghost({
        position: {
            x: Boundary.width * 3 + Boundary.width / 2,
            y: Boundary.height * 9 + Boundary.height / 2
        },
        velocity: {
            x: Ghost.speed,
            y: 0
        },
        color: 'orange'
    })
]

//Creates instance of Pacman
const player = new Player({
    position: {
        x: Boundary.width + Boundary.width / 2,
        y: Boundary.height + Boundary.height / 2
    },
    velocity: {
        x: 0,
        y: 0
    }
})


//Determines which keys are being pressed down
const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

//Need this variable so else if conditional statements can be executed (2 keys at once)
let lastKey = ''

let score = 0

//creates map of squares using a forEach loop & switch function to replace "grid" symbols
const map = [
    ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', 'p', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', 'p', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
    ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
]

//Function to pull in image assets to replace boxes
function createImage(src) {
    const image = new Image()
    image.src = src
    return image
}


//Loops over and switches symbols
map.forEach((row, i) => {
    row.forEach((symbol, j) => {
        switch (symbol) {
            case '-':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: createImage('./img/pipeHorizontal.png')
                    })
                )
                break
            case '|':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: createImage('./img/pipeVertical.png')
                    })
                )
                break
            case '1':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: createImage('./img/pipeCorner1.png')
                    })
                )
                break
            case '2':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: createImage('./img/pipeCorner2.png')
                    })
                )
                break
            case '3':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: createImage('./img/pipeCorner3.png')
                    })
                )
                break
            case '4':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: createImage('./img/pipeCorner4.png')
                    })
                )
                break
            case 'b':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: createImage('./img/block.png')
                    })
                )
                break
            case '[':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: createImage('./img/capLeft.png')
                    })
                )
                break
            case ']':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: createImage('./img/capRight.png')
                    })
                )
                break
            case '7':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: createImage('./img/pipeConnectorBottom.png')
                    })
                )
                break
            case '^':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: createImage('./img/capTop.png')
                    })
                )
                break
            case '_':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: createImage('./img/capBottom.png')
                    })
                )
                break
            case '+':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: createImage('./img/pipeCross.png')
                    })
                )
                break
            case '5':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: createImage('./img/pipeConnectorTop.png')
                    })
                )
                break
            //Places pellet in blank pellets array w/ centered position
            case '.':
                pellets.push(
                    new Pellet({
                        position: {
                            x: Boundary.width * j + Boundary.width / 2,
                            y: Boundary.height * i + Boundary.height / 2
                        }
                    })
                )
                break
            case 'p':
                powerups.push(
                    new Powerup({
                        position: {
                            x: Boundary.width * j + Boundary.width / 2,
                            y: Boundary.height * i + Boundary.height / 2
                        }
                    })
                )
                break
        }
    })
})

//Detects collision when rectangle runs into square and accounts for 1px padding
function circleCollidesWithRectangle({ circle, rectangle
}) {
    const padding = Boundary.width / 2 - circle.radius - 1
    return (circle.position.y - circle.radius + circle.velocity.y
        <=
        rectangle.position.y + rectangle.height + padding &&
        circle.position.x + circle.radius + circle.velocity.x
        >=
        rectangle.position.x - padding &&
        circle.position.y + circle.radius + circle.velocity.y
        >=
        rectangle.position.y - padding &&
        circle.position.x - circle.radius + circle.velocity.x
        <=
        rectangle.position.x + rectangle.width + padding)

}


let animationId

//Animation frame calls animate function every time a frame is completed
function animate() {
    animationId = requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)

    //Adds lastKey variable to move through else conditions / 2 keys at once ok
    if (keys.w.pressed && lastKey === 'w') {
        //Loops through boundaries to create seamless up movements 
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                circleCollidesWithRectangle({
                    circle: {
                        ...player, velocity: {
                            x: 0,
                            y: -5
                        }
                    },
                    rectangle: boundary
                })
            ) {
                player.velocity.y = 0
                break
            } else {
                player.velocity.y = -5
            }
        }
    } else if (keys.a.pressed && lastKey === 'a') {
        //Loops through boundaries to create seamless left movements 
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                circleCollidesWithRectangle({
                    circle: {
                        ...player, velocity: {
                            x: -5,
                            y: 0
                        }
                    },
                    rectangle: boundary
                })
            ) {
                player.velocity.x = 0
                break
            } else {
                player.velocity.x = -5
            }
        }
    }
    else if (keys.s.pressed && lastKey === 's') {
        //Loops through boundaries to create seamless down movements 
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                circleCollidesWithRectangle({
                    circle: {
                        ...player, velocity: {
                            x: 0,
                            y: 5
                        }
                    },
                    rectangle: boundary
                })
            ) {
                player.velocity.y = 0
                break
            } else {
                player.velocity.y = 5
            }
        }
    }
    else if (keys.d.pressed && lastKey === 'd') {
        //Loops through boundaries to create seamless right movements 
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                circleCollidesWithRectangle({
                    circle: {
                        ...player, velocity: {
                            x: 5,
                            y: 0
                        }
                    },
                    rectangle: boundary
                })
            ) {
                player.velocity.x = 0
                break
            } else {
                player.velocity.x = 5
            }
        }
    }

    //Detect collision between ghosts and player
    for (let i = ghosts.length - 1; 0 <= i; i--) {
        const ghost = ghosts[i]
        //Collision detection for when ghost and player touch
        if (Math.hypot(
            ghost.position.x - player.position.x,
            ghost.position.y - player.position.y
        ) <
            ghost.radius + player.radius
        ) {

            if (ghost.scared) {
                ghosts.splice(i, 1)
            }
            else {
                cancelAnimationFrame(animationId)
                alert('You lose. Try again!')
                location.reload()
                console.log('you lose')
            }
        }
    }

    //Loops through powerups array backwords to prevent rendering issue
    for (let i = powerups.length - 1; 0 <= i; i--) {
        const powerup = powerups[i]

        //renders powerups        
        powerup.draw()
        //player collides with powerup
        if (
            Math.hypot(
                powerup.position.x - player.position.x,
                powerup.position.y - player.position.y
            ) <
            powerup.radius + player.radius
        ) {
            powerups.splice(i, 1)

            //make ghosts scared
            ghosts.forEach(ghost => {
                ghost.scared = true

                setTimeout(() => {
                    ghost.scared = false
                }, 5000)
            })
        }

    }

    //Loops through pellet array backwords to prevent rendering issue; touch pellets here
    for (let i = pellets.length - 1; 0 <= i; i--) {
        const pellet = pellets[i]

        //Loops over pellet array and draws a new pellet
        pellet.draw()


        //Collision detection for Pacman/Pellets
        if (
            Math.hypot(
                pellet.position.x - player.position.x,
                pellet.position.y - player.position.y
            ) <
            pellet.radius + player.radius
        ) {
            pellets.splice(i, 1)
            score += 10
            scoreEl.innerHTML = score
        }
    }

    //Win condition goes here
    if (pellets.length === 0) {
        alert('You win!')
        cancelAnimationFrame(animationId)
    }

    //Loops over boundary & calls to draw for each frame
    boundaries.forEach(boundary => {
        boundary.draw()
        //Collision detection for boundaries/pacman + velocity to anticipate collision
        if (
            circleCollidesWithRectangle({
                circle: player,
                rectangle: boundary
            })
        ) {
            player.velocity.x = 0
            player.velocity.y = 0
        }
    })
    //Adds key down/up "listeners" to the frame animation
    player.update()

    //Loops through each ghost instance and renders
    ghosts.forEach((ghost) => {
        ghost.update()

        const collisions = []

        //Loops through boundaries and detects collisions for ghosts
        boundaries.forEach((boundary) => {
            if (
                //prevents collisions from being read twice (i.e. if collision is not right, then execute right)
                !collisions.includes('right') &&
                circleCollidesWithRectangle({
                    circle: {
                        ...ghost,
                        velocity: {
                            x: ghost.speed,
                            y: 0
                        }
                    },
                    rectangle: boundary
                })
            ) {
                collisions.push('right')
            }

            if (
                !collisions.includes('left') &&
                circleCollidesWithRectangle({
                    circle: {
                        ...ghost,
                        velocity: {
                            x: -ghost.speed,
                            y: 0
                        }
                    },
                    rectangle: boundary
                })
            ) {
                collisions.push('left')
            }

            if (
                !collisions.includes('up') &&
                circleCollidesWithRectangle({
                    circle: {
                        ...ghost,
                        velocity: {
                            x: 0,
                            y: -ghost.speed
                        }
                    },
                    rectangle: boundary
                })
            ) {
                collisions.push('up')
            }

            if (
                !collisions.includes('down') &&
                circleCollidesWithRectangle({
                    circle: {
                        ...ghost,
                        velocity: {
                            x: 0,
                            y: ghost.speed
                        }
                    },
                    rectangle: boundary
                })
            ) {
                collisions.push('down')
            }
        })
        //Stores current collisions
        if (collisions.length > ghost.prevCollisions.length)
            ghost.prevCollisions = collisions
        //Stringifies array so data can be compared
        if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)) {


            if (ghost.velocity.x > 0) ghost.prevCollisions.push('right')
            else if (ghost.velocity.x < 0) ghost.prevCollisions.push('left')
            else if (ghost.velocity.y < 0) ghost.prevCollisions.push('up')
            else if (ghost.velocity.y > 0) ghost.prevCollisions.push('down')

            console.log(collisions)
            console.log(ghost.prevCollisions)

            //Filters out collisions that do not exist within the array; provides the new pathways available
            const pathways = ghost.prevCollisions.filter(collision => {
                return !collisions.includes(collision)
            })
            console.log({ pathways })

            const direction = pathways[Math.floor(Math.random() * pathways.length)]

            console.log({ direction })

            switch (direction) {
                case 'down':
                    ghost.velocity.y = ghost.speed
                    ghost.velocity.x = 0
                    break
                case 'up':
                    ghost.velocity.y = -ghost.speed
                    ghost.velocity.x = 0
                    break
                case 'right':
                    ghost.velocity.y = 0
                    ghost.velocity.x = ghost.speed
                    break
                case 'left':
                    ghost.velocity.y = 0
                    ghost.velocity.x = -ghost.speed
                    break

            }
            ghost.prevCollisions = []
        }
        // console.log(collisions)
    })

    if (player.velocity.x > 0) player.rotation = 0
    else if (player.velocity.x < 0) player.rotation = Math.PI
    else if (player.velocity.y > 0) player.rotation = Math.PI / 2
    else if (player.velocity.y < 0) player.rotation = Math.PI * 1.5
    //end of animate()
}
animate()


//Listens for keys and applies movement of player (pacman)
//lastKey variable added to track / override last key pressed
addEventListener('keydown', ({ key }) => {
    switch (key) {
        case 'w':
            keys.w.pressed = true
            lastKey = 'w'
            break
        case 'a':
            keys.a.pressed = true
            lastKey = 'a'
            break
        case 's':
            keys.s.pressed = true
            lastKey = 's'
            break
        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
            break
    }

})

//Listens for keyup and stops movement of player (pacman)
addEventListener('keyup', ({ key }) => {
    switch (key) {
        case 'w':
            keys.w.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 's':
            keys.s.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
    }

    // console.log(player.velocity)
})