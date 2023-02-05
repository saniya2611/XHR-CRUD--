let cl = console.log;



//Ajax = Asynchronus javaScript and XML
//       It is a concept of js
//       fetchapi = html5 gives api

// http =>it is use for backend and frontend connectivity

// if we have to do interaction in between frontend and backend so it has some methods to interact 1) Get
     //  2) Post
     //  3) Patch /  put
     //  4) Delete


let xhr  =  new XMLHttpRequest()

//for example base url  => mywebsiteapi.com

//1] GET METHODs
//if we want to get all blog data from d/b  => mywebapi.com/blogs
// if we want get single blog from d/b  => GET + id  =>  mywebapi.com/blog/:id(here id stand for parames ...if  we use anything after colon(:) it is collon)
//=>  mywebapi.com/blog/1(1,2 or anything ...it is a actual value of parames)


//2]POST METHODs
//in this case we make data & send it to d/b =>  mywebapi.com/blogs
//There is no need of ID and params in this method...

//3]PATCH / PUT METHODs
//both methods are used to update data in d/b
//put   => when we want to change/update all data in d/b(mandetory to all data)
//patch => when we have to update/change a specific data then we will use patch(one or more than one)
// => mywebapi.com/blogs/:id

//4]DELETE METHODs
// => mywebapi.com/blogs/:id

//status code
//200 | 201  >> api call successfull
//201        >> create
//400        >> api call failed
//403        >> Forbidden (u will not cl api)
//404        >> api failed (url not found)

//readyState
//0          >> unsend   >> xhr object create but open method is not call yet
//1          >> open method is called  
//2          >> send method called 
//3          >> loading  >> server is loading our request
//4          >> Done     >> Request is proccessed and response is ready...(api still not successfull)
//

//ID  is not only a number but it can also be in string format

//https://jsonplaceholder.typicode.com/  <= dummy/mock api

//object === instance

let baseURL  = `https://jsonplaceholder.typicode.com/posts/`;
// cl(baseURL)
let postArray =[];

const postContainer = document.getElementById("postContainer");
const postForm = document.getElementById("postForm");
const titleControl = document.getElementById("title");
const contentControl = document.getElementById("content");
const submitBtn = document.getElementById("submitBtn");
const UpdateBtn = document.getElementById("UpdateBtn");

const createCard = (postObj) =>{
    let div = document.createElement("div");
            div.className = "card mb-4"
            div.innerHTML = ` 
                             <div class="card-header">${postObj.title}</div>
                                 <div class="card-body">${postObj.body}</div>
                                  <div class="card-footer text-right mb-4">
                                        <button class="btn btn-primary"onClick="onEdit(this)">Edit</button>
                                        <button class="btn btn-danger"onClick="onDelete(this)">Delete</button>
                             </div>
                                `
            
            postContainer.append(div)
}

const onEdit = (ele) => {
    cl(ele.closest(".card").id);
    let id = ele.closest(".card").id;
    localStorage.setItem("updateId", id);
    let getSingleObjUrl = `${baseURL}${id}`
    makeApiCall("GET", getSingleObjUrl, null);
    UpdateBtn.classList.remove('d-none')
    submitBtn.classList.add('d-none')
}
const onDelete = (ele) => {
    let deleteId = ele.closest('.card').id;
    cl(deleteId);
    let deleteUrl = '${baseURL}${deleteId}';
    makeApiCall("DELETE", deleteUrl, null)
    ele.closest('.card').remove()
}


const templating =(arr)=>{
    let result =` `;
    arr.forEach(post => {
        result +=`
              <div class="card mb-4" id=${post.id}>
                      <div class="card-header">${post.title}</div>
-                     <div class="card-body">${post.body}</div>
                      <div class="card-footer text-right mb-4">
                            <button class="btn btn-primary" onClick="onEdit(this)">Edit</button>
                            <button class="btn btn-danger"onClick="onDelete(this)">Delete</button>
                      </div>
              </div>
                `
    })
    postContainer.innerHTML=result;
}
const makeApiCall =(methodName, apiUrl,body) =>{
    xhr = new XMLHttpRequest();
    xhr.open(methodName, apiUrl);
    xhr.onload = function (){
        if(this.status === 200){
            postArray = JSON.parse(this.response);
            if(Array.isArray(JSON.parse(this.response))){
                templating(postArray)
            }else if(methodName === "GET"){
                titleControl.value = postArray.title;
                contentControl.value = postArray.body;
            }
        }else if(this.status === 201){
            createCard(body)
        }
    }
    xhr.send(JSON.stringify(body));// send data to d/b that is rsn json.stingify
}
makeApiCall("GET",baseURL,null);

//xhr.open("METHOD", "URL", "BOOLEAN") bydeafault 3rd(boolean) value is true and true value means asynchronus value...
//when we login somewhere that time we get a bearer token
//if we to handle data so we have use this token with api we should send this token
// xhr.open("GET", baseURL);//methods should be in uppercase

// xhr.onload = function (){
//     // cl(this.response)
//     //cl(this.status)
//     if(this.status === 200 || this.status === 201){
//        // cl(xhr.readyState)  // api call has some states
//         //cl(this.status)  //to check api status  //200  400
//         postArray = JSON.parse(this.response);
//        // cl(postArray)
//         templating(postArray);
//     }
// }



const onPostSubmit =(eve) => {
    eve.preventDefault();
    cl("submitted !!!");
    let obj = {
        title : titleControl.value,
        body : contentControl.value,
        userId : Math.floor(Math.random() * 11)
    }
    cl(obj);

    eve.target.reset();  //to clear form
    makeApiCall("POST",baseURL, obj)
    // let xhr = new XMLHttpRequest()
    // xhr.open("POST", baseURL, true);
    // xhr.send(JSON.stringify(obj));//post api cl
    // xhr.onload = function(){
    //     if(this.status === 200 || this.status === 201){
    //         cl(xhr.response);  /// ID
    //         obj.id = JSON.parse(xhr.response).id;
    //         cl(obj)
    //         postArray.push(obj);
    //         // templating(postArray)  <= it is not a efficient way beacause when we create new card that time all other cards are destroying and adding a new card to it...application will be slow
    //         createCard(obj);
    //     }
    // }
     // before open method we can't cl the send method..open => onload => send
}

const onPostUpdate = (eve) => {
    let id = localStorage.getItem("updateId");
    let updateUrl = `${baseURL}${id}`;
    let obj = {
        title : titleControl.value,
        body : contentControl.value
    }
    makeApiCall("PATCH", updateUrl, obj)
    postForm.reset();
    UpdateBtn.classList.add('d-none');
    submitBtn.classList.remove('d-none');
    let card = document.getElementById(id);
    cl(card);
    card.innerHTML = `
                        <div class="card-header">${obj.title}</div>
                                <div class="card-body">${obj.body}</div>
                                 <div class="card-footer text-right mb-4">
                                 <button class="btn btn-primary"onClick="onEdit(this)">Edit</button>
                                <button class="btn btn-danger"onClick="onDelete(this)">Delete</button>
                        </div>
                    `
}


postForm.addEventListener("submit",onPostSubmit)
UpdateBtn.addEventListener("click",onPostUpdate)