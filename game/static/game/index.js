
var app = angular.module("myApp", ['ngAnimate', 'ngDragDrop']);
app.controller("myCtrl", function($scope) {
    $scope.base= 1;
    $scope.delta = 1;
});
app.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('[[');
  $interpolateProvider.endSymbol(']]');
});

var dragged_node;
var mode = 'easy';

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.innerText);
    dragged_node = ev.target.id;
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drop(ev) {
    ev.preventDefault();
    var data = parseInt(ev.dataTransfer.getData("text")) + parseInt(ev.target.innerText);
    console.log('data = ', data);
    if (data == 10) {
        document.getElementById("status").innerText = "You won! Congratulations! Start over again?";
        document.getElementById("yes-button").style.display = "inline";
        document.getElementById("no-button").style.display = "inline";
        document.getElementById(dragged_node).innerText = 0;
        return;
    }
    else if (data > 10) {
        document.getElementById(dragged_node).innerText = data - 10;
        document.getElementById("status").innerText = "Computer: 'I am making a move!'";
        setTimeout(function(){ comp_move(); }, 1000);
    }
    else {
        document.getElementById(dragged_node).innerText = data;
        document.getElementById("status").innerText = "Computer: 'I am making a move!'";
        setTimeout(function(){ comp_move(); }, 1000);
    }
    //ev.target.innerText = data;
    //ev.target.appendChild(document.getElementById(data));



}

function comp_move() {
    // computer makes a move

    var me_list = ['me1', 'me2'];
    var rand_me = document.getElementById(me_list[Math.floor(Math.random() * me_list.length)]);

    var comp_list = ['computer1', 'computer2'];
    var rand_comp = document.getElementById(comp_list[Math.floor(Math.random() * comp_list.length)]);

    var i;
    var j;
    var other_comp;
    if (mode == 'hard') {
        console.log('entered hard mode if condition');
        // calculate one step ahead
        for (var i = 0; i < me_list.length; i++) {
            for (var j = 0; j < comp_list.length; j++) {

                if (parseInt(document.getElementById(me_list[i]).innerText) + parseInt(document.getElementById(comp_list[j]).innerText) == 10) {
                    rand_me = document.getElementById(me);
                    rand_comp = document.getElementById(comp);
                }
            }
        }
    }
    else if (mode == 'nightmare') {
        console.log('entered nightmare mode if condition');
        // calculate one step ahead first
        console.log('nightmare mode, one step first')
        for (i = 0; i < me_list.length; i++) {
            for (j = 0; j < comp_list.length; j++) {
                if (parseInt(document.getElementById(me_list[i]).innerText) + parseInt(document.getElementById(comp_list[j]).innerText) == 10) {
                    console.log('one step gets to 10')
                    rand_me = document.getElementById(me_list[i]);
                    rand_comp = document.getElementById(comp_list[j]);
                }
            }
        }
        // calculate two steps ahead. The only case where player can win is 'attacked' by both me nodes - e.g. comp 2, 4 me 1, 5
        //console.log('me_list', me_list);
        //TODO: fix the problem of only iterating once for every move
        // solution: initialize i and j before the for loop!! otherwise they would memorize the value
        for (i = 0; i < me_list.length; i++) {
            for (j = 0; j < comp_list.length; j++) {
                // check two steps for random comp and me nodes
                console.log('me_list', me_list);
                console.log(me_list[i]);
                console.log(comp_list[j]);
                var comp_next_state = parseInt(document.getElementById(me_list[i]).innerText) + parseInt(document.getElementById(comp_list[j]).innerText);
                console.log('comp_next_state', comp_next_state)
                // if the renewed comp num + me1 node will add to 10
                if ((comp_next_state + parseInt(document.getElementById('me1').innerText)) % 10 == 0) {
                    console.log('the renewed comp num + me1 node will add to 10')
                    if ((comp_next_state + parseInt(document.getElementById('me2').innerText)) % 10 != 0 && j != 1) {
                        // check one step for comp and the other me node
                        console.log('renewed comp + me2 does not add to 10 and me2 did not contribute to comp_next_state, so select me2')
                        //todo: if comp_next_state is caused by me2, and comp + me1 = 10, do not add to me1 since it gives me1 opportunity!
                        rand_me = document.getElementById('me2');
                        rand_comp = document.getElementById(comp_list[j]);
                    }
                    else {
                        // if comp and the other me node will add to 10, we have to switch to the other comp node
                        console.log('renewed comp + me2 add to 10, have to switch to the other comp node')
                        other_comp = comp_list[Math.abs(j - 1)]; //returns 0 if comp_index is 1, returns 1 if comp_index is 0
                        if (check(other_comp, 'me1') == true) {
                            console.log('other_comp + me1 = 10, select me2')
                            rand_me = document.getElementById('me2');
                        }
                        else {
                            console.log('other_comp + me1 != 10, select me1')
                            rand_me = document.getElementById('me1');
                        }
                        rand_comp = document.getElementById(comp_list[j]);
                    }
                }
                else if ((comp_next_state + parseInt(document.getElementById('me2').innerText)) % 10 == 0) {
                    console.log('the renewed comp num + me2 node will add to 10')
                    if ((comp_next_state + parseInt(document.getElementById('me1').innerText)) % 10 != 0) {
                        // check one step for comp and the other me node
                        console.log('renewed comp + me1 does not add to 10, so select me1')
                        rand_me = document.getElementById('me1');
                        rand_comp = document.getElementById(comp_list[j]);
                    }
                    else {
                        // if comp and the other me node will add to 10, we have to switch to the other comp node
                        console.log('renewed comp + me1 add to 10, have to switch to the other comp node')
                        other_comp = comp_list[Maths.abs(j - 1)]; //returns 0 if comp_index is 1, returns 1 if comp_index is 0
                        if (check(other_comp, 'me1') == true) {
                            console.log('other_comp + me1 = 10, select me2')
                            rand_me = document.getElementById('me2');
                        }
                        else {
                            console.log('other_comp + me1 != 10, select me1')
                            rand_me = document.getElementById('me1');
                        }
                        rand_comp = document.getElementById(comp_list[j]);
                    }
                }
            }
        }
    }


    var rect_comp = rand_comp.getBoundingClientRect();
    console.log('comp coordinate', rect_comp.top, rect_comp.right, rect_comp.bottom, rect_comp.left);

    var rect_me = rand_me.getBoundingClientRect();
    console.log('me coordinate', rect_me.top, rect_me.right, rect_me.bottom, rect_me.left);

    horizontal_delta = rect_me.right - rect_comp.right;
    vertical_delta = rect_me.top - rect_comp.top;
    console.log('horizontal_delta', horizontal_delta, 'vertical_delta', vertical_delta)


    var moveBack = move(rand_comp)
        .to(0, 0);

    move(rand_comp)
        .to(horizontal_delta, vertical_delta)
        .then(moveBack)
        .end();
    //rand_comp.getContext("2d").translate(rect_comp.right - rect_me.right, rect_comp.top - rect_me.top);

    var comp_data = parseInt(rand_comp.innerText) + parseInt(rand_me.innerText);
    rand_comp.innerText = comp_data;

    if (comp_data == 10) {
        setTimeout(function(){ document.getElementById("status").innerText = "Computer won! Wanna try again to beat the computer?"; }, 1000);
        document.getElementById("yes-button").style.display = "inline";
        document.getElementById("no-button").style.display = "inline";
        rand_comp.innerText = 0;
        return;
    }
    else if (comp_data > 10) {
        rand_comp.innerText = comp_data - 10;
        setTimeout(function(){ document.getElementById("status").innerText = "Your turn!"; }, 1000);
    }
    else {
        rand_comp.innerText = comp_data;
        setTimeout(function(){ document.getElementById("status").innerText = "Your turn!"; }, 1000);
    }


}

function check(comp, me) {
        if (parseInt(document.getElementById(me).innerText) + parseInt(document.getElementById(comp).innerText) == 10) {
            return true;
        }
        else {
            return false;
        }
}

function yes() {
    document.getElementById("yes-button").style.display = "none";
    document.getElementById("no-button").style.display = "none";
    document.getElementById('me1').innerText = 1;
    document.getElementById('me2').innerText = 1;
    document.getElementById('computer1').innerText = 1;
    document.getElementById('computer2').innerText = 1;
    setTimeout(function(){ document.getElementById("status").innerText = "Your turn!"; }, 1000);
}

function no() {
    document.getElementById("status").innerText = "Till next time!";
}

function easy() {
    mode = 'easy';
    console.log(mode);
    document.getElementById('mode').innerHTML = '<h4>Easy Mode</h4>';
}

function hard() {
    mode = 'hard';
    console.log(mode);
    document.getElementById('mode').innerHTML = '<h4>Hard Mode!</h4>';
}

function nightmare() {
    mode = 'nightmare';
    console.log(mode);
    document.getElementById('mode').innerHTML = '<h4>Nightmare Mode!!<h4>';
}