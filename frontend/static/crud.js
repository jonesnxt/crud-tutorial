var crud = {};
crud.service = {};
crud.service.endpoint = "https://backend-3faa7a49-ad9d-4dac-a66a-28f7eb5c9824.koji-staging.com";
crud.ui = {};

crud.ui.getlist = function() {
    crud.service.send("/data","get", null, function(arr){        
        crud.ui.clearTable();
        arr.forEach((e) => {
          if (e.id && e.value){
            crud.ui.addRow(e.id, e.value);
          }
        });
    });
};

crud.ui.clearTable = function(){
  var tableRef = document.getElementById('crudtable').getElementsByTagName('tbody')[0];
  while(tableRef.children[1]){
    tableRef.removeChild(tableRef.children[1]);
  }   
}

crud.ui.addRow = function(id, value) {
    var tableRef = document.getElementById('crudtable').getElementsByTagName('tbody')[0];
    // Insert a row in the table at the last row
    var newRow   = tableRef.insertRow(tableRef.rows.length);
    newRow.className = 'datarow'
    newRow.id = id;

    // Insert a cell in the row at index 0
    var idCell  = newRow.insertCell(0);
    var valCell  = newRow.insertCell(1);
    var actionCell = newRow.insertCell(2);

    // Append a text node to the cell
    idCell.appendChild(document.createTextNode(id));
    valCell.appendChild(document.createTextNode(value));   
    actionCell.innerHTML = '<a href="#" onclick="return crud.ui.delete(\''+id+'\');"><i class="fas fa-minus deletebutton"></i></a>';
    actionCell.innerHTML += '<a style="padding-left:5px;" href="#" onclick="return crud.ui.update(\''+id+'\');"><i class="fas fa-pencil-alt updatebutton"></i></a>';
}

crud.ui.addNew = function(){
    var newValue = document.getElementById('newValue').value;        

     crud.service.send("/data","post", {value: newValue}, function(arr){
        console.log(arr);                
        crud.ui.addRow(arr.id, newValue); 
        document.getElementById('newValue').value = "";
    });
    return false;
}

crud.ui.delete = function(id){
    var row = document.getElementById(id.trim());
    crud.service.send('/data/'+id,'delete', null, function(res){
      console.log(res);  
    });

    row.parentNode.removeChild(row);
}

crud.ui.update = function(id){
    var newVal = prompt("Please enter a new value for "+id, "");
    var row = document.getElementById(id.trim());

    crud.service.send('/data/'+id, 'post', {id, value: newVal}, function(res){
      console.log(res);
    })
    
    row.children[1].innerHTML = newVal;
}

crud.service.send = function(endpoint, method, request_body, callback){
    var req = new XMLHttpRequest();    
    req.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            callback(myArr);
        }
    };    
    
    req.open(method.toUpperCase(), crud.service.endpoint + endpoint);           
    if (method.toUpperCase() === "POST"){
      req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      req.send(JSON.stringify(request_body));
    }else{               
      req.send();
    }
}

console.log('[koji] Frontend loaded');
if (window.parent){
window.parent.postMessage({action: 'info', payload: {message: '[koji] Frontend loaded'}}, '*');
}

crud.ui.getlist();