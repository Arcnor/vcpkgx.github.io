
var DataStore=null;
var result = [];
var curpage = 0;
var nbItemPerPage = 100;

fetch("/data/libs.json")
    .then(response => response.json())
    .then(data => {
        DataStore = data;
        search();
    });


function search(){
    var searchbox = document.getElementById("searchbox");
    var regexopt = document.getElementById("regexopt");
    var cleanclass = searchbox.parentNode.className;
    // searchbox.parentNode.className+= " is-loading";
    output = document.getElementById("searchResults");
    if(!DataStore){
        waiting =true
        return
    }
    console.log( )
    console.time("query");
    if(!regexopt.checked){
        result = Object.keys(DataStore).filter(key => key.indexOf(searchbox.value) !== -1);
        
    }else{
        result = Object.keys(DataStore).filter(key => key.match(searchbox.value));
    }
    console.timeEnd("query");

    curpage = 0;
    renderResult();
    updatePageBtnState();

    
    // searchbox.parentNode.className = cleanclass;
}
function renderResult(){
    console.time("clear");
    output.textContent ='';
    console.timeEnd("clear");

    console.time("render");
    var resultsNB = document.getElementById("resultsNB");
    resultsNB.innerHTML = result.length.toString();
    for(let match of result.slice(nbItemPerPage*curpage,nbItemPerPage*(curpage+1))){
        renderRow(match);
    }
    console.timeEnd("render");

}
function renderRow(itemName){
    var output = document.getElementById("searchResults");
    var entry = document.createElement("tr");
    entry.className = "container";
    entry.addEventListener("click",function(){displayModal(itemName,DataStore[itemName]);}, false);
    entry.onmouseenter
    var name = document.createElement("th");
    name.innerHTML = itemName;
    entry.appendChild(name);

    var description = document.createElement("td");
    description.innerHTML = DataStore[itemName].Description;
    entry.appendChild(description);

    var version = document.createElement("td");
    version.innerHTML = DataStore[itemName].Version;
    entry.appendChild(version);

    var moreinfo = document.createElement("td");
    var moreinfobtn = document.createElement("a");
    moreinfobtn.innerHTML = '<span class="icon"><i class="fas fa-info fa-lg"></i></span>';
    moreinfobtn.className = "button is-text";

    moreinfo.appendChild(moreinfobtn);
    entry.appendChild(moreinfo);

    output.appendChild(entry)
}

function displayModal(name, data){
    var modalbase = document.getElementById("modalbase");
    modalbase.className = "modal is-active";

    var modalname = document.getElementById("modalname");
    modalname.innerHTML = name;

    var modalversion = document.getElementById("modalversion");
    modalversion.innerHTML = DataStore[name].Version;

    var modaldescription = document.getElementById("modaldescription");
    modaldescription.innerHTML = DataStore[name].Description;

    var modalbdepends = document.getElementById("modalbdepends");
    modalbdepends.textContent = '';
    for(let item of DataStore[name]["Build-Depends"]){
        var tag = document.createElement("span");
        tag.innerText = item;
        tag.className = "tag";
        modalbdepends.appendChild(tag);
    }
}

function hiddeModal(){
    var modalbase = document.getElementById("modalbase");
    modalbase.className = "modal"
}

function nextpage(){
    curpage++;
    renderResult();
    updatePageBtnState();
}

function prevpage(){
    curpage--;
    renderResult();
    updatePageBtnState();

}

function updatePageBtnState(){
    var nextbtn = document.getElementById("nextbtn");
    var prevbtn = document.getElementById("prevbtn");
    
    if(result.length<=nbItemPerPage*(curpage+1)){
        nextbtn.disabled = true;
    }else{
        nextbtn.disabled = false;

    }
    if(curpage <=0){
        curpage = 0;
        prevbtn.disabled = true;

    }else{
        prevbtn.disabled = false;

    }
}

// function clicksearch(){
//     searchbutton = document.getElementById("searchbutton")
//     // searchbutton.className+= " is-loading"
//     search()
//     // searchbutton.className.replace(" is-loading", "");
// }