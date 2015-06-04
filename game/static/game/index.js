
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
        setTimeout(function(){ document.getElementById("status").innerText = "Computer won!"; }, 1000);
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