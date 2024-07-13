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
    remove_collider_components, set_custom_prop, translate_local
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
const PlayerImageURL = "https://raw.githubusercontent.com/Amaranterre/SICP/main/asset/player.png";

const PlayerBulletImageURL = "https://raw.githubusercontent.com/Amaranterre/SICP/main/asset/play_bullet.png";
const playerBulletImageAngle = vector3(0, 0, 135);
const playerBulletImageDegree = 135;

const PlayerTurretImageURL = "https://raw.githubusercontent.com/Amaranterre/SICP/main/asset/turret.png";

const TestWallImageURL = "https://raw.githubusercontent.com/Amaranterre/SICP/main/asset/test_wall.png";

const BoomFireImageURL = "https://raw.githubusercontent.com/Amaranterre/SICP/main/asset/boom_fire.png";

const WallImageURL = "https://raw.githubusercontent.com/Amaranterre/SICP/main/asset/wall.png";


//--------------------------------------------------->//
///////////////////////////////////////////////////////


///////////////////////////////////////////////////////
//<----------------------------------------------------
// animation

function playConsistAnim(imageUrl, duration, position, scale, euler) {
    const body = instantiate_sprite(imageUrl);
    let time_count = 0;
    set_start(body, (gameObject) => {
        set_position(gameObject, position);
        set_scale(gameObject, scale);
        set_rotation_euler(gameObject, euler);
    });
    set_update(body, (gameObject) => {
       time_count = time_count + delta_time();
       if( time_count > 1) {
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

let cur_time = 0;
function get_game_time() {
    return cur_time;
}

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
// map related

//wallData: ['x' or 'y', position, scale]
const wallsData = [
    ['x', vector3(0, -4.5, 0), vector3(2.58, 1, 0)],
    ['x', vector3(0, 4.5, 0), vector3(2.58, 1, 0)],
    ['y', vector3(-7, 0, 0), vector3(1.6673, 1, 0)],
    ['y', vector3(7, 0, 0), vector3(1.6673, 1, 0)]
]; 

let walls = [];



function ConstructMap() {
    const dataLen = array_length(wallsData);
    for(let i = 0; i < dataLen; i = i + 1) {
        
        const position = wallsData[i][1];
        const scale = wallsData[i][2];
        const wall = instantiate_sprite(WallImageURL);
        
        debug_log(position);
        set_position(wall, position);
        set_scale(wall, scale);
        
        if(wallsData[i][0] === 'y') {
            set_rotation_euler(wall, vector3(0, 0, 90));
        }   
        
        walls[i] = wall;
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



///////////////////////////////////////////////////////
//<----------------------------------------------------
// bullet related 

const bulletLayer = 17;
const bulletSpeed = 5;
const MAXCollideNum = 12;

function is_y_wall(gameObject) {
    const wallsLen = array_length(walls);
    debug_log("check y wall");
    for(let i = 0; i < wallsLen; i = i + 1) {
        if(same_gameobject(gameObject, walls[i])) {
            return wallsData[i][0] === 'y';
        }
    }
    
    return true;
}

function is_x_wall(gameObject) {
    return true;
}


function bulletCollisionEnter(index, bullets, bullet_collide_count) {
    return (self, other) => {
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
    } else {
        // debug_log("x wall");
        const reflectedBulletDirectionDegree = -bulletDirectionDegree;
        const unit_cos = math_cos((reflectedBulletDirectionDegree / 360) * 2 * math_PI);
        const unit_sin = math_sin((reflectedBulletDirectionDegree / 360) * 2 * math_PI);

        set_velocity(self, vector3(unit_cos * bulletSpeed, unit_sin * bulletSpeed, 0));
        set_rotation_euler(self, vector3(0, 0, reflectedBulletDirectionDegree - playerBulletImageDegree));
    }

};}


//create a bullet facing $angular at $pos, with $velocity
function getPlayerBulletCreator(time_gap) {
    const cur_time = get_game_time();
    let last_time = cur_time;

    let bullets = [];
    let bullets_num = 0;
    let bullet_collide_count = [];

    return (pos, angle, velocity, scale) => {
        // debug_log("last time: " + stringify(last_time) + " cur_time: " + stringify(get_game_time()));
        if (get_game_time() - last_time < time_gap) {
            // debug_log("not shoot");
            return null;
        } else {
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

        debug_log(index);
        debug_log(bullets_num);


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

const turretLayer = 15;
const turret = instantiate_sprite(PlayerTurretImageURL);

const TurretLength = 2;
const rotateSpeed = vector3(0, 0, 180); //180 degree per second

const shootGap = 0.5;

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

set_start(turret, gameObject => {
    set_position(gameObject, get_position(player));
    remove_collider_components(gameObject);

    set_custom_prop(gameObject, "layer", turretLayer); // drawing order

});

set_update(turret, gameObject => {

    set_position(gameObject, get_position(player));

    if (get_key("Q")) {
        // debug_log("get Q");
        const curEuler = get_rotation_euler(gameObject);
        set_rotation_euler(gameObject,
            add_vectors(curEuler, scale_vector(rotateSpeed, delta_time())));
    } else if (get_key("E")) {
        // debug_log("get Q");
        const curEuler = get_rotation_euler(gameObject);
        set_rotation_euler(gameObject,
            add_vectors(curEuler, scale_vector(rotateSpeed, -delta_time())));
    }

    if (get_key("X")) {
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
        const scale = vector3(3, 3, 0); //set bullet size


        bullet_creator(position, angle, velocity, scale);
    }
});


//--------------------------------------------------->//
///////////////////////////////////////////////////////



///////////////////////////////////////////////////////
//<----------------------------------------------------
// player related
const playerLayer = 16;
const player = instantiate_sprite(PlayerImageURL);
let player_speed = 3;

const bullet_creator = getPlayerBulletCreator(shootGap); //set shoot gap


function get_player_move_direction() {
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

        set_scale(gameObject, vector3(1.05, 0.95, 0.95));
        set_rotation_euler(gameObject, vector3(0, 0, degree));
    } else { //not moving
        set_scale(gameObject, vector3(1, 1, 1));
        set_rotation_euler(gameObject, vector3(0, 0, 0));
    }
}

function player_move(gameObject) {
    let move_direction = vector3(0, 0, 0);

    move_direction = get_player_move_direction(); // get move direction

    translate_world(gameObject,
        scale_vector(move_direction,
            delta_time() * player_speed * magnitude(move_direction)));
    // move by direction

    player_move_rotate(gameObject, move_direction); // rotate player depending on 
    // move direction


}

function start_player(gameObject) {
    set_position(gameObject, vector3(-2, 2, 0));
    set_scale(gameObject, vector3(0.5, 0.5, 1));
    apply_rigidbody(gameObject);
    set_use_gravity(gameObject, false);

    set_custom_prop(gameObject, "layer", playerLayer);
}



function update_player(gameObject) {
    cur_time = cur_time + delta_time();
    set_velocity(gameObject, vector3(0, 0, 0));
    player_move(gameObject);




    // my_debug(gameObject);

}


//--------------------------------------------------->//
///////////////////////////////////////////////////////

const main_cam_target = get_main_camera_following_target();
set_start(player, start_player);
set_update(player, update_player);

// set_start(testWall, getWallStart(vector3(0, 0, 0), vector3(4, 4, 0)));

ConstructMap();