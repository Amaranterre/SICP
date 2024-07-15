import {
    init_unity_academy_3d, init_unity_academy_2d, set_start, set_update,
    instantiate, delta_time, instantiate_sprite, same_gameobject, destroy,
    translate_world, get_key_down, get_key, get_key_up, get_position, copy_position,
    set_position, get_rotation_euler, set_rotation_euler, rotate_world,
    get_scale, set_scale, play_animator_state, add_impulse_force,
    apply_rigidbody, get_angular_velocity, get_mass, get_velocity,
    set_angular_velocity, set_mass, set_use_gravity, set_velocity,
    on_collision_enter, on_collision_stay, on_collision_exit,
    get_main_camera_following_target, vector3, get_x, get_y, vector_difference,
    add_vectors, scale_vector, normalize, debug_log, get_z, magnitude,
    remove_collider_components, set_custom_prop, translate_local, 
    get_custom_prop, instantiate_empty
}
    from "unity_academy";

init_unity_academy_2d();



///////////////////////////////////////////////////////
//<----------------------------------------------------
// debug related
function my_debug(gameObject) {
    const pos = get_position(gameObject);
    const x = get_x(pos);
    const y = get_y(pos);
    debug_log("x: " + stringify(x) + " y: " + stringify(y));

    const euler = get_rotation_euler(gameObject);
    debug_log(euler);
    debug_log(get_velocity(gameObject));
}


//--------------------------------------------------->//
///////////////////////////////////////////////////////



///////////////////////////////////////////////////////
//<----------------------------------------------------
// image asset
const Player1ImageURL = "https://raw.githubusercontent.com/Amaranterre/SICP/main/asset/player1.png";

const PlayerBulletImageURL = "https://raw.githubusercontent.com/Amaranterre/SICP/main/asset/play_bullet.png";
const playerBulletImageAngle = vector3(0, 0, 135);
const playerBulletImageDegree = 135;

const Player1TurretImageURL = "https://raw.githubusercontent.com/Amaranterre/SICP/main/asset/turret1.png";

const TestWallImageURL = "https://raw.githubusercontent.com/Amaranterre/SICP/main/asset/test_wall.png";

const BoomFireImageURL = "https://raw.githubusercontent.com/Amaranterre/SICP/main/asset/boom_fire.png";

const WallImageURL = "https://raw.githubusercontent.com/Amaranterre/SICP/main/asset/wall.png";

const Player2ImageURL = "https://raw.githubusercontent.com/Amaranterre/SICP/main/asset/player2.png";
const Player2TurretImageURL = "https://raw.githubusercontent.com/Amaranterre/SICP/main/asset/turret2.png";

const ShootFireImageURL = "https://raw.githubusercontent.com/Amaranterre/SICP/main/asset/shoot_fire.png";

const WhitePaperBackgroundImageURL = "https://raw.githubusercontent.com/Amaranterre/SICP/main/asset/white_paper_background.jpg";

const StartBackgroundImageURL = "https://raw.githubusercontent.com/Amaranterre/SICP/main/asset/start_background.jpg";
//--------------------------------------------------->//
///////////////////////////////////////////////////////

///////////////////////////////////////////////////////
//<----------------------------------------------------
// animation

function playConsistAnim(imageUrl, duration, position, scale, euler) {
    debug_log(position);
    const body = instantiate_sprite(imageUrl);
    remove_collider_components(body);
    let time_count = 0;
    set_start(body, (gameObject) => {
        set_position(gameObject, position);
        set_scale(gameObject, scale);
        set_rotation_euler(gameObject, euler);
        remove_collider_components(gameObject);
    });
    set_update(body, (gameObject) => {
       time_count = time_count + delta_time();
       if( time_count > duration) {
           destroy(gameObject);
       }
    });
}

//--------------------------------------------------->//
///////////////////////////////////////////////////////


///////////////////////////////////////////////////////
//<----------------------------------------------------
// const related

const x_boundary = 15;
const y_boundary = 15;

const direction_left = vector3(-1, 0, 0);
const direction_right = vector3(1, 0, 0);
const direction_up = vector3(0, 1, 0);
const direction_down = vector3(0, -1, 0);

const shootFireSize = vector3(1, 1, 0);

let cur_time = 0;
function get_game_time() {
    return cur_time;
}

// layer related 
const playerLayer = 10;
const bulletLayer = 12;
const turretLayer = 7;
const shootFireLayer = 5;

//--------------------------------------------------->//
///////////////////////////////////////////////////////



///////////////////////////////////////////////////////
//<----------------------------------------------------
// predicate_related

function is_out_boundary(gameObject) {
    const pos = get_position(gameObject);
    return math_abs(get_x(pos)) > x_boundary ||
        math_abs(get_y(pos)) > y_boundary;
}

//--------------------------------------------------->//
///////////////////////////////////////////////////////



///////////////////////////////////////////////////////
//<----------------------------------------------------
// vector related 
function abs_vector(vec) {
    return vector3(math_abs(get_x(vec)),
        math_abs(get_y(vec)),
        math_abs(get_z(vec)));
}

function is_same_vector(vec1, vec2) {
    return get_x(vec1) === get_x(vec2) &&
        get_y(vec1) === get_y(vec2) &&
        get_z(vec1) === get_z(vec2)
        ? true
        : false;
}
//--------------------------------------------------->//
///////////////////////////////////////////////////////


///////////////////////////////////////////////////////
//<----------------------------------------------------
// gameprocess related
const stage = 0;

const GameController = instantiate_empty();

function start_GameController(gameObject) {
    change_background(StartBackgroundImageURL, startBackgroundPosition, startBackgroundScale);
    ConstructMap(startGameMap);
    // change_walls(startGameMap);
        
}


//--------------------------------------------------->//
///////////////////////////////////////////////////////



///////////////////////////////////////////////////////
//<----------------------------------------------------
// background related
let background = instantiate_empty();

const whitePaperPosition = vector3(0, 0, 100);
const whitePaperScale = vector3(20, 20, 0);

const startBackgroundPosition = vector3(0, 0, 100);
const startBackgroundScale = vector3(1.2, 1, 0);

function change_background(new_url, position, scale) {
    destroy(background);
    background = instantiate_sprite(new_url);
    
    remove_collider_components(background);
    set_position(background, position);
    set_scale(background, scale);
}

//--------------------------------------------------->//
///////////////////////////////////////////////////////



///////////////////////////////////////////////////////
//<----------------------------------------------------
// map related

//wallData: ['x' or 'y', position, scale]
const UnitLength=1.02;
const UnitWidth=UnitLength/5.41;

const startGameMap = [];

const FirstGameMap = [
    ['x', vector3(0, -4.5*UnitLength, 0), vector3(12*UnitWidth, 1, 0)],
    ['x', vector3(0, 4.5*UnitLength, 0), vector3(12*UnitWidth, 1, 0)],
    ['y', vector3(-6*UnitLength, 0, 0), vector3(9*UnitWidth, 1, 0)],
    ['y', vector3(6*UnitLength, 0, 0), vector3(9*UnitWidth, 1, 0)],
    
    ['x', vector3(-4*UnitLength, -3.5*UnitLength, 0), vector3(2*UnitWidth, 0.6, 0)],
    ['x', vector3(UnitLength, -3.5*UnitLength, 0), vector3(2*UnitWidth, 0.6, 0)],
    ['x', vector3(5*UnitLength, -3.5*UnitLength, 0), vector3(2*UnitWidth, 0.6, 0)],
    ['x', vector3(-2.5*UnitLength, -2.5*UnitLength, 0), vector3(UnitWidth, 0.6, 0)],
    ['x', vector3(0.5*UnitLength, -2.5*UnitLength, 0), vector3(3*UnitWidth, 0.6, 0)],
    ['x', vector3(3.5*UnitLength, -2.5*UnitLength, 0), vector3(UnitWidth, 0.6, 0)],
    ['x', vector3(5.5*UnitLength, -2.5*UnitLength, 0), vector3(UnitWidth, 0.6, 0)],
    ['x', vector3(-5*UnitLength, -1.5*UnitLength, 0), vector3(2*UnitWidth, 0.6, 0)],
    ['x', vector3(-2*UnitLength, -1.5*UnitLength, 0), vector3(2*UnitWidth, 0.6, 0)],
    ['x', vector3(UnitLength, -1.5*UnitLength, 0), vector3(2*UnitWidth, 0.6, 0)],
    ['x', vector3(3.5*UnitLength, -1.5*UnitLength, 0), vector3(UnitWidth, 0.6, 0)],
    ['x', vector3(5.5*UnitLength, -1.5*UnitLength, 0), vector3(UnitWidth, 0.6, 0)],
    ['x', vector3(-3*UnitLength, -0.5*UnitLength, 0), vector3(2*UnitWidth, 0.6, 0)],
    ['x', vector3(2*UnitLength, -0.5*UnitLength, 0), vector3(2*UnitWidth, 0.6, 0)],
    ['x', vector3(-5.5*UnitLength, 0.5*UnitLength, 0), vector3(UnitWidth, 0.6, 0)],
    ['x', vector3(-2.5*UnitLength, 0.5*UnitLength, 0), vector3(UnitWidth, 0.6, 0)],
    ['x', vector3(4*UnitLength, 0.5*UnitLength, 0), vector3(2*UnitWidth, 0.6, 0)],
    ['x', vector3(-5*UnitLength, 1.5*UnitLength, 0), vector3(2*UnitWidth, 0.6, 0)],
    ['x', vector3(0.5*UnitLength, 1.5*UnitLength, 0), vector3(UnitWidth, 0.6, 0)],
    ['x', vector3(2.5*UnitLength, 1.5*UnitLength, 0), vector3(UnitWidth, 0.6, 0)],
    ['x', vector3(5.5*UnitLength, 1.5*UnitLength, 0), vector3(UnitWidth, 0.6, 0)],
    ['x', vector3(-5.5*UnitLength, 2.5*UnitLength, 0), vector3(UnitWidth, 0.6, 0)],
    ['x', vector3(-3.5*UnitLength, 2.5*UnitLength, 0), vector3(UnitWidth, 0.6, 0)],
    ['x', vector3(0.5*UnitLength, 2.5*UnitLength, 0), vector3(UnitWidth, 0.6, 0)],
    ['x', vector3(4.5*UnitLength, 2.5*UnitLength, 0), vector3(UnitWidth, 0.6, 0)],
    ['x', vector3(-4.5*UnitLength, 3.5*UnitLength, 0), vector3(UnitWidth, 0.6, 0)],
    ['x', vector3(1.5*UnitLength, 3.5*UnitLength, 0), vector3(5*UnitWidth, 0.6, 0)],
    ['x', vector3(0, 0.5*UnitLength, 0), vector3(2*UnitWidth, 0.6, 0)],
    ['x', vector3(0, -0.5*UnitLength, 0), vector3(2*UnitWidth, 0.6, 0)],    
    
    
    ['y', vector3(-5*UnitLength, -3*UnitLength, 0), vector3(UnitWidth, 0.6, 0)],
    ['y', vector3(-5*UnitLength, -0.5*UnitLength, 0), vector3(2*UnitWidth, 0.6, 0)],
    ['y', vector3(-4*UnitLength, -3*UnitLength, 0), vector3(UnitWidth, 0.6, 0)],
    ['y', vector3(-4*UnitLength, -UnitLength, 0), vector3(UnitWidth, 0.6, 0)],
    ['y', vector3(-4*UnitLength, UnitLength, 0), vector3(UnitWidth, 0.6, 0)],
    ['y', vector3(-4*UnitLength, 3.5*UnitLength, 0), vector3(2*UnitWidth, 0.6, 0)],
    ['y', vector3(-3*UnitLength, -3*UnitLength, 0), vector3(UnitWidth, 0.6, 0)],
    ['y', vector3(-3*UnitLength, UnitLength, 0), vector3(UnitWidth, 0.6, 0)],
    ['y', vector3(-3*UnitLength, 3*UnitLength, 0), vector3(UnitWidth, 0.6, 0)],
    ['y', vector3(-2*UnitLength, -3.5*UnitLength, 0), vector3(2*UnitWidth, 0.6, 0)],
    ['y', vector3(-2*UnitLength, -UnitLength, 0), vector3(UnitWidth, 0.6, 0)],
    ['y', vector3(-2*UnitLength, 2.5*UnitLength, 0), vector3(4*UnitWidth, 0.6, 0)],
    ['y', vector3(-UnitLength, -4*UnitLength, 0), vector3(UnitWidth, 0.6, 0)],
    ['y', vector3(-UnitLength, 1.5*UnitLength, 0), vector3(2*UnitWidth, 0.6, 0)],
    ['y', vector3(0, -4*UnitLength, 0), vector3(UnitWidth, 0.6, 0)],
    ['y', vector3(0, -2*UnitLength, 0), vector3(UnitWidth, 0.6, 0)],
    ['y', vector3(UnitLength, -4*UnitLength, 0), vector3(UnitWidth, 0.6, 0)],
    ['y', vector3(UnitLength, -1.5*UnitLength, 0), vector3(2*UnitWidth, 0.6, 0)],
    ['y', vector3(UnitLength, 2*UnitLength, 0), vector3(UnitWidth, 0.6, 0)],
    ['y', vector3(UnitLength, 4*UnitLength, 0), vector3(UnitWidth, 0.6, 0)],
    ['y', vector3(2*UnitLength, -4*UnitLength, 0), vector3(UnitWidth, 0.6, 0)],
    ['y', vector3(2*UnitLength, 2*UnitLength, 0), vector3(3*UnitWidth, 0.6, 0)],
    ['y', vector3(3*UnitLength, -4*UnitLength, 0), vector3(UnitWidth, 0.6, 0)],
    ['y', vector3(3*UnitLength, -2*UnitLength, 0), vector3(UnitWidth, 0.6, 0)],
    ['y', vector3(3*UnitLength, 2.5*UnitLength, 0), vector3(2*UnitWidth, 0.6, 0)],
    ['y', vector3(4*UnitLength, -2*UnitLength, 0), vector3(UnitWidth, 0.6, 0)],
    ['y', vector3(4*UnitLength, 0, 0), vector3(UnitWidth, 0.6, 0)],
    ['y', vector3(4*UnitLength, 2*UnitLength, 0), vector3(UnitWidth, 0.6, 0)],
    ['y', vector3(5*UnitLength, -4*UnitLength, 0), vector3(UnitWidth, 0.6, 0)],
    ['y', vector3(5*UnitLength, -UnitLength, 0), vector3(UnitWidth, 0.6, 0)],
    ['y', vector3(5*UnitLength, 2*UnitLength, 0), vector3(UnitWidth, 0.6, 0)],
    ['y', vector3(5*UnitLength, 4*UnitLength, 0), vector3(UnitWidth, 0.6, 0)],
    ['y', vector3(-UnitLength, 0, 0), vector3(UnitWidth, 0.6, 0)],
    ['y', vector3(UnitLength, 0, 0), vector3(UnitWidth, 0.6, 0)]
];

let curWallsData = [];
let curWallsObject = [];

let walls = [];



function ConstructMap(walls) {
    
    
    const dataLen = array_length(walls);
    for(let i = 0; i < dataLen; i = i + 1) {
        
        let position = walls[i][1];
        
        
        const scale = walls[i][2];
        const wall = instantiate_sprite(WallImageURL);
        
        debug_log(position);
        set_position(wall, position);
        set_scale(wall, scale);
        
        if(walls[i][0] === 'y') {
            set_rotation_euler(wall, vector3(0, 0, 90));
        }   
        
        curWallsObject[i] = wall;
        curWallsData[i] = walls[i];
    }
}


//--------------------------------------------------->//
///////////////////////////////////////////////////////



///////////////////////////////////////////////////////
//<----------------------------------------------------
// wall related 

// const testWall = instantiate_sprite(TestWallImageURL);

function getWallStart(position, scale) {
    return (gameObject) => {
        set_position(gameObject, position);
        set_scale(gameObject, scale);
    };
}

//--------------------------------------------------->//
///////////////////////////////////////////////////////

// const test = instantiate_sprite(ShootFireImageURL);


///////////////////////////////////////////////////////
//<----------------------------------------------------
// bullet related 
const BulletForce = 10;
const bulletSpeed = 2;
const MAXCollideNum = 12;

function is_y_wall(gameObject) {
    const wallsLen = array_length(curWallsObject);
    // debug_log("check y wall");
    for(let i = 0; i < wallsLen; i = i + 1) {
        if(same_gameobject(gameObject, curWallsObject[i])) {
            return curWallsData[i][0] === 'y';
        }
    }
    
    return false;
}

function is_x_wall(gameObject) {
    const wallsLen = array_length(curWallsObject);
    
    for(let i = 0; i < wallsLen; i = i + 1) {
        if(same_gameobject(gameObject, curWallsObject[i])) {
            return curWallsData[i][0] === 'x';
        }
    }
    
    return false;
}

function is_player(gameObject) {
    return same_gameobject(gameObject, player1) || same_gameobject(gameObject, player2);
}

function recycleBullet(bullet, position, index, bullets) {
    playConsistAnim(BoomFireImageURL, 1, 
    position, vector3(1, 1, 0), vector3(0, 0, 0)); // play booming fire
    bullets[index] = null;
    destroy(bullet);
    return null;
}



function bulletCollisionEnter(index, bullets, bullet_collide_count) {
    return (self, other) => {
        if( is_player(other)) {
            recycleBullet(self, get_position(self), index, bullets);
            KillPlayer(other, self);
            return null;
        }
        
        
        bullet_collide_count[index] = bullet_collide_count[index] + 1;
        if( bullet_collide_count[index] === MAXCollideNum) {
            playConsistAnim(BoomFireImageURL, 1, 
                get_position(self), vector3(1, 1, 0), vector3(0, 0, 0)); // play booming fire
            bullets[index] = null;
            destroy(self);
            return null;
        }
        
        
    // debug_log("1");
    //     my_debug(self);
    const self_velocity = get_velocity(self);
    const x = get_x(self_velocity);
    const y = get_y(self_velocity);

    const bulletDirectionDegree = get_z(get_rotation_euler(self)) + playerBulletImageDegree;

    // const degree = add_vectors(playerBulletImageAngle, get_rotation_euler(self));
    const degree = get_z(get_rotation_euler(self));
    if (is_y_wall(other)) {
        const reflectedBulletDirectionDegree = 180 - bulletDirectionDegree;
        const unit_cos = math_cos((reflectedBulletDirectionDegree / 360) * 2 * math_PI);
        const unit_sin = math_sin((reflectedBulletDirectionDegree / 360) * 2 * math_PI);

        set_velocity(self, vector3(unit_cos * bulletSpeed, unit_sin * bulletSpeed, 0));
        set_rotation_euler(self, vector3(0, 0, reflectedBulletDirectionDegree - playerBulletImageDegree));
        // debug_log("2");
        // my_debug(self);
    } else if( is_x_wall(other)) {
        // debug_log("x wall");
        const reflectedBulletDirectionDegree = -bulletDirectionDegree;
        const unit_cos = math_cos((reflectedBulletDirectionDegree / 360) * 2 * math_PI);
        const unit_sin = math_sin((reflectedBulletDirectionDegree / 360) * 2 * math_PI);

        set_velocity(self, vector3(unit_cos * bulletSpeed, unit_sin * bulletSpeed, 0));
        set_rotation_euler(self, vector3(0, 0, reflectedBulletDirectionDegree - playerBulletImageDegree));
    } else {
        recycleBullet(self, get_position(self), index, bullets);
        return null;
    }

};}


//create a bullet facing $angular at $pos, with $velocity
function getPlayerBulletCreator(time_gap) {
    const cur_time = get_game_time();
    let last_time = cur_time;

    let bullets = [];
    let bullets_num = 0;
    let bullet_collide_count = [];

    return (fire_pos, pos, angle, velocity, scale) => {
        // debug_log("last time: " + stringify(last_time) + " cur_time: " + stringify(get_game_time()));
        if (get_game_time() - last_time < time_gap) {
            // debug_log("not shoot");
            return null;
        } else {
                     playConsistAnim(ShootFireImageURL, 0.2, fire_pos , 
                    shootFireSize , angle);
            let flag = false;
            let index = -1;
            
            for( let i = 0; i < bullets_num; i = i + 1) {
                if(is_null(bullets[i])) {
                    flag = true;
                    index = i;
                    
                }
            }
            if( flag === false) {
                index = bullets_num;
                bullets_num = bullets_num + 1;
            }

    bullets[index] = instantiate_sprite(PlayerBulletImageURL);
    bullet_collide_count[index] = 0;

        // debug_log(index);
        // debug_log(bullets_num);


            set_start(bullets[index] , (gameObject) => {
                apply_rigidbody(gameObject);
                // remove_collider_components(gameObject); // very important !!
                set_use_gravity(gameObject, false);

                set_rotation_euler(gameObject,
                    vector_difference(angle, playerBulletImageAngle)); // modify the image angle
                set_velocity(gameObject, velocity);
                set_position(gameObject, pos);

                set_scale(gameObject, scale);

                on_collision_enter(gameObject, 
                    bulletCollisionEnter(index, bullets, bullet_collide_count));

            });

            set_update(bullets[index] , (gameObject) => {
                set_angular_velocity(gameObject, vector3(0, 0, 0));

                const bulletDirectionDegree = get_z(get_rotation_euler(gameObject)) + playerBulletImageDegree;
                const unit_cos = math_cos((bulletDirectionDegree / 360) * 2 * math_PI);
                const unit_sin = math_sin((bulletDirectionDegree / 360) * 2 * math_PI);
                set_velocity(gameObject, vector3(unit_cos * bulletSpeed, unit_sin * bulletSpeed, 0));

                if (is_out_boundary(gameObject)) { // cross the boundary of map, destroy
                    bullets[index] = null;
                    destroy(gameObject);
                    // debug_log("destroy myself 0_0");

                }
            });

            last_time = get_game_time();
        }
    };




}


//--------------------------------------------------->//
///////////////////////////////////////////////////////



///////////////////////////////////////////////////////
//<----------------------------------------------------
// turret related

const turret1 = instantiate_sprite(Player1TurretImageURL);
const turret2 = instantiate_sprite(Player2TurretImageURL);

const TurretLength = 0.4;
const rotateSpeed = vector3(0, 0, 180); //180 degree per second
const turretSize = vector3(0.8, 0.8, 0);

const shootGap = 2;

// function CreateTurret(tank) { //if using CreateTurret, layer will not be applied correctly, so create turret directly
//     const turret = instantiate_sprite(PlayerTurretImageURL);


//     set_start(turret, gameObject => {
//         set_position(gameObject, get_position(tank));
//         remove_collider_components(gameObject);

//         set_custom_prop(gameObject, "layer", turretLayer);
//     });
//     set_update(turret, gameObject => {
//         set_position(gameObject, get_position(tank));
//     });
// }

function get_turret_position(player_position) {
    const x = get_x(player_position);
    const y = get_y(player_position);
    const z = turretLayer;
    return vector3(x, y, z);
    
}  


function start_turret1 (gameObject) {
    const position = get_turret_position(get_position(player1));
    
    set_position(gameObject, position);set_scale(gameObject, turretSize);
    remove_collider_components(gameObject);


}

function get_shoot_fire_position(position) {
    const x = get_x(position);
    const y = get_y(position);
    const z = shootFireLayer;
    return vector3(x, y, z);
    
}


function update_turret1(gameObject) {
    if(!player1LiveState) {
        return null;
    }
    
const position = get_turret_position(get_position(player1));
    
    set_position(gameObject, position);

    if (get_key("1")) {
        // debug_log("get Q");
        const curEuler = get_rotation_euler(gameObject);
        set_rotation_euler(gameObject,
            add_vectors(curEuler, scale_vector(rotateSpeed, delta_time())));
    } else if (get_key("3")) {
        // debug_log("get Q");
        const curEuler = get_rotation_euler(gameObject);
        set_rotation_euler(gameObject,
            add_vectors(curEuler, scale_vector(rotateSpeed, -delta_time())));
    }

    if (get_key("2")) {
               // my_debug(gameObject);
        const angle = get_rotation_euler(gameObject);
        const facingAngle = get_z(angle);
        const unit_cos = math_cos((facingAngle / 360) * 2 * math_PI);
        const unit_sin = math_sin((facingAngle / 360) * 2 * math_PI);

        const position = add_vectors(get_position(gameObject),
            vector3(unit_cos * TurretLength, unit_sin * TurretLength, 0));

        // const position = vector3(0, 0, 0);
        // const velocity = vector3(math_cos(facingAngle) * bulletSpeed, 
        //     math_sin(facingAngle) * bulletSpeed, 0);
        const velocity = vector3(unit_cos * bulletSpeed, unit_sin * bulletSpeed, 0);
        const scale = vector3(0.9, 0.9, 0); //set bullet size

        const shoot_fire_position = get_shoot_fire_position(get_position(gameObject));

        bullet_creator(shoot_fire_position, 
            position, angle, velocity, scale);
    }
}

function start_turret2 (gameObject) {
    const position = get_turret_position(get_position(player2));
    
    set_position(gameObject, position);
    set_scale(gameObject, turretSize);
    remove_collider_components(gameObject);


}

function update_turret2(gameObject) {
    if(!player2LiveState) {
        return null;
    }
    const position = get_turret_position(get_position(player2));
    
    set_position(gameObject, position);

    if (get_key("8")) {
        // debug_log("get Q");
        const curEuler = get_rotation_euler(gameObject);
        set_rotation_euler(gameObject,
            add_vectors(curEuler, scale_vector(rotateSpeed, delta_time())));
    } else if (get_key("0")) {
        // debug_log("get Q");
        const curEuler = get_rotation_euler(gameObject);
        set_rotation_euler(gameObject,
            add_vectors(curEuler, scale_vector(rotateSpeed, -delta_time())));
    }

    if (get_key("9")) {
        // my_debug(gameObject);
        const angle = get_rotation_euler(gameObject);
        const facingAngle = get_z(angle);
        const unit_cos = math_cos((facingAngle / 360) * 2 * math_PI);
        const unit_sin = math_sin((facingAngle / 360) * 2 * math_PI);

        const position = add_vectors(get_position(gameObject),
            vector3(unit_cos * TurretLength, unit_sin * TurretLength, 0));

        // const position = vector3(0, 0, 0);
        // const velocity = vector3(math_cos(facingAngle) * bulletSpeed, 
        //     math_sin(facingAngle) * bulletSpeed, 0);
        const velocity = vector3(unit_cos * bulletSpeed, unit_sin * bulletSpeed, 0);
        const scale = vector3(0.9, 0.9, 0); //set bullet size


        bullet_creator(get_position(gameObject), position, angle, velocity, scale);
    }
}


//--------------------------------------------------->//
///////////////////////////////////////////////////////


let player1LiveState = true;
let player2LiveState = true;


///////////////////////////////////////////////////////
//<----------------------------------------------------
// player related
const playerSize = vector3(0.8, 0.8, 0);

const player1 = instantiate_sprite(Player1ImageURL);
const player2 = instantiate_sprite(Player2ImageURL);

let player_speed = 1;

const bullet_creator = getPlayerBulletCreator(shootGap); //set shoot gap


function KillPlayer(player, murder) {
    // debug_log("someone got killed");
    const degree = ((get_z(get_rotation_euler(murder)) + 135) / 360) * 2 * math_PI;
    const force_unit = vector3(math_cos(degree), math_sin(degree), 0 );
    
    const force = scale_vector(force_unit, BulletForce);
    debug_log(force);
    if( same_gameobject(player, player1)) {
        debug_log("player1 wass killed!");
        player1LiveState = false;
        add_impulse_force(player2, force);
        
        add_impulse_force(player1, force);
    } else if (same_gameobject(player, player2)) {
        debug_log("player2 wass killed!");
        player2LiveState = false;
        add_impulse_force(player2, force);
    }
}



function get_player1_move_direction() {
    let direction = vector3(0, 0, 0);
    if (get_key("A")) {
        direction = add_vectors(direction_left, direction);
    }
    if (get_key("D")) {
        direction = add_vectors(direction_right, direction);
    }
    if (get_key("W")) {
        direction = add_vectors(direction_up, direction);
    }
    if (get_key("S")) {
        direction = add_vectors(direction_down, direction);
    }
    return direction;
}

function get_player2_move_direction() {
    let direction = vector3(0, 0, 0);
    if (get_key("J")) {
        direction = add_vectors(direction_left, direction);
    }
    if (get_key("L")) {
        direction = add_vectors(direction_right, direction);
    }
    if (get_key("I")) {
        direction = add_vectors(direction_up, direction);
    }
    if (get_key("K")) {
        direction = add_vectors(direction_down, direction);
    }
    return direction;
}

function get_player_move_scale(move_direction) {

    let scale = vector3(1, 1, 1);
    // debug_log( normalize(move_direction) );
    return scale_vector(normalize(add_vectors(scale,
        scale_vector(normalize(abs_vector(move_direction)), 0.5))), 3);
}

function get_face_degree(move_direction) {
    const x = get_x(move_direction);
    const y = get_y(move_direction);
    return x === 0 && y === 1 ? 90 :
        x === 0 && y === -1 ? 270 :
            x === 1 && y === 0 ? 0 :
                x === -1 && y === 0 ? 180 :
                    x === 1 && y === 1 ? 45 :
                        x === 1 && y === -1 ? 315 :
                            x === -1 && y === 1 ? 135 : 225;
}

function player_move_rotate(gameObject, move_direction) {
    if (!is_same_vector(move_direction, vector3(0, 0, 0))) { //when moving
        const degree = get_face_degree(move_direction);

        set_rotation_euler(gameObject, vector3(0, 0, degree));
    } else { //not moving
        set_rotation_euler(gameObject, vector3(0, 0, 0));
    }
}

function player_move(gameObject, get_player_move_direction) {
    let move_direction = vector3(0, 0, 0);

    move_direction = get_player_move_direction(); // get move direction

    const speedCorrection = is_same_vector(abs_vector(move_direction), vector3(1, 1, 0)) ? math_sqrt(3) : 1;

    translate_world(gameObject,
        scale_vector(move_direction,
            delta_time() * player_speed / speedCorrection));
    // move by direction

    player_move_rotate(gameObject, move_direction); // rotate player depending on 
    // move direction


}

function start_player1(gameObject) {
    set_position(gameObject, vector3(-2, 2, playerLayer));
    set_scale(gameObject, playerSize);
    apply_rigidbody(gameObject);
    set_use_gravity(gameObject, false);

}



function update_player1(gameObject) {
    if(!player1LiveState) {
        return null;
    }
    cur_time = cur_time + delta_time();
    
    if(player1LiveState) {
        set_velocity(gameObject, vector3(0, 0, 0));
    }
    player_move(gameObject, get_player1_move_direction);



    // my_debug(gameObject);

}

function start_player2(gameObject) {
    set_position(gameObject, vector3(2, -2, playerLayer));
    set_scale(gameObject, playerSize);
    apply_rigidbody(gameObject);
    set_use_gravity(gameObject, false);

}



function update_player2(gameObject) {
    if(!player2LiveState) {
        return null;
    }
    cur_time = cur_time + delta_time();
    
    if(player2LiveState) {
        set_velocity(gameObject, vector3(0, 0, 0));
    }
    
    player_move(gameObject, get_player2_move_direction);



    // my_debug(gameObject);

}

//--------------------------------------------------->//
///////////////////////////////////////////////////////

const main_cam_target = get_main_camera_following_target();


set_start(GameController, start_GameController);

set_start(turret1, start_turret1);
set_update(turret1, update_turret1);

set_start(turret2, start_turret2);
set_update(turret2, update_turret2);

set_start(player1, start_player1);
set_update(player1, update_player1);

set_start(player2, start_player2);
set_update(player2, update_player2);




// set_start(testWall, getWallStart(vector3(0, 0, 0), vector3(4, 4, 0)));
