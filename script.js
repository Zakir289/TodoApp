
var todoSubmit = document.getElementsByClassName('todo-submit')[0];
var todoText = document.getElementsByClassName('todo-text')[0];
var editForm = document.getElementById('edit-card');


function createItem(){
	if(todoText.value.length>0 && todoText.value.length <= 50){
todo.createElement(todoText.value);
todoText.value = "";		
	}

else{
	alert('please enter atleast one character or max of 50 characters')
}

}



todoSubmit.addEventListener('click',function(){
	createItem();
})

todoText.addEventListener('keypress', function (e) {
    var key = e.which || e.keyCode;
    if (key === 13) {
  createItem();   
    }
});

