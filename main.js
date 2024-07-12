import {init_unity_academy_3d, init_unity_academy_2d, set_start, set_update,
    instantiate, delta_time, instantiate_sprite, same_gameobject, destroy,
    translate_world,get_key_down, get_key, get_key_up, get_position, copy_position,
    set_position, get_rotation_euler, set_rotation_euler, rotate_world,
    get_scale, set_scale, play_animator_state, add_impulse_force,
    apply_rigidbody, get_angular_velocity, get_mass, get_velocity,
    set_angular_velocity, set_mass, set_use_gravity ,set_velocity,
    on_collision_enter, on_collision_stay, on_collision_exit,
    get_main_camera_following_target, vector3, get_x, get_y, vector_difference,
    add_vectors, scale_vector, normalize, debug_log, get_z, magnitude
}
    from "unity_academy";

init_unity_academy_2d();

///////////////////////////////////////////////////////
//<----------------------------------------------------
// const related

const direction_left = vector3(-1, 0, 0);
const direction_right = vector3(1, 0, 0);
const direction_up = vector3(0, 1, 0);
const direction_down = vector3(0, -1, 0);

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
// player related

const player = instantiate_sprite("https://raw.githubusercontent.com/Amaranterre/SICP/main/main.png");
let player_speed = 3;

function get_player_move_direction() {
    let direction = vector3(0, 0, 0);
    if(get_key("A")){
        direction = add_vectors(direction_left, direction);
    } 
    if(get_key("D")){
        direction = add_vectors(direction_right, direction);
    } 
    if(get_key("W")){
        direction = add_vectors(direction_up, direction);
    } 
    if(get_key("S")){
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
    if( !is_same_vector(move_direction, vector3(0, 0, 0)) ) { //when moving
        const degree = get_face_degree(move_direction);
        
        set_scale(gameObject, vector3(1.05, 0.95, 0.95));
        set_rotation_euler(gameObject, vector3(0, 0 , degree));
    } else { //not moving
        set_scale(gameObject, vector3(1, 1, 1));
        set_rotation_euler(gameObject, vector3(0, 0 , 0));
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

function start_player(gameObject){
    set_position(gameObject, vector3(-2, 2, 0));
    set_scale(gameObject, vector3(0.5, 0.5, 1));
    apply_rigidbody(gameObject);
    set_use_gravity(gameObject, false);
}
function update_player(gameObject){

    player_move(gameObject);

}


//--------------------------------------------------->//
///////////////////////////////////////////////////////

const main_cam_target = get_main_camera_following_target();
set_start(player, start_player);
set_update(player, update_player);