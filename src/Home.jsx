import React, { createContext, useCallback, useEffect, useState } from 'react'
import io from 'socket.io-client'

const socket1=io('https://spvideoapp.herokuapp.com',{transports:["websocket"]})
var caller1=[]
const Home=function(props)
{var audio = new Audio('https://dl.prokerala.com/downloads/ringtones/files/mp3/bell-4836.mp3')
console.log(audio)
    //audio.loop=true
audio.volume = 0.04
    //audio.play()
function stop(streams) {
    if (streams) {
        streams.getTracks().forEach(track => {
            track.stop()
        })
    }
}

var connection = {}
var videos = []
var devices = {
    front:1,
    back:0
}

console.log(caller1)

var configuration = {
    'iceServers': [{
        url: 'stun:stun.l.google.com:19302'
    }, {
        url: 'turn:3.143.222.94.3478',
        credential: 'root',
        username: 'user'
    }]
}

/*setTimeout(() => {
    document.getElementById('p').innerText = socket1.id
}, 3000);*/
var stream;

var rid1 = ""
useEffect(()=>{
    document.getElementById('div1').style.height=`${document.body.offsetHeight-document.getElementById('box').offsetHeight}px`
    // let interval=setInterval(() => {
    //     if(socket1.id){
    //     document.getElementById('p').innerText = socket1.id
    //         clearInterval(interval)
    // }
        
    // }, 1000);
    document.getElementById('switchaudio').onclick=()=>
{let target=document.getElementById('switchaudio')
console.log(target)
    if(target.childNodes[0].classList.toString().includes("fa-microphone-slash"))
    {
        try {
            mute('audio')
            target.childNodes[0].classList.remove("fa-microphone-slash")
            target.childNodes[0].classList.add("fa-microphone")
            
        } catch (error) {
            
        }
        
    }
    else
    {
        try {
            unmute('audio')
            target.childNodes[0].classList.remove("fa-microphone")
            target.childNodes[0].classList.add("fa-microphone-slash")
        //target.innerText='mute audio'
        } catch (error) {
            
        }
    }
}
document.getElementById('switchvideo').onclick=()=>
{
    let target=document.getElementById('switchvideo')
    if(target.childNodes[0].classList.toString().includes("fa-video-slash"))
    {
        try {
            mute('video')
            target.childNodes[0].classList.remove("fa-video-slash")
    target.childNodes[0].classList.add("fa-video")
        //target.innerText='unmute video'
            
        } catch (error) {
            
        }
        
    }
    else
    {
        try {
            unmute('video')
            target.childNodes[0].classList.remove("fa-video")
            target.childNodes[0].classList.add("fa-video-slash")
        } catch (error) {
            
        }
    }
}
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    }).then(x => {

        stream = x
        console.log(stream)
        document.getElementById('self').srcObject = stream
    })
},[])
function close_connection(rid)
{
    try {
        console.log('connection close')
    document.getElementById('receiver').childNodes.forEach(child=>{
        if(child.value===rid)
        {
            child.parentNode.removeChild(child)
        }
    })
    console.log(document.getElementById(rid))
    document.getElementById(rid).parentNode.parentNode.removeChild(document.getElementById(rid).parentNode)
    connection[rid].close()
    videos=videos.filter(p=>{return p!==rid})
    console.log('connection close')
    delete connection[rid]
        
    } catch (error) {
        
    }
    
}
function mute(s)
{
    stream.getTracks().forEach(track=>{
        if(track.kind===s)
        {//console.log(track)
            track.stop();
            //stream.removeTrack(track)
        }
    })
    console.log(stream.getTracks())
    stream.getTracks().forEach(track => {
        videos.forEach(rid => {
            connection[rid].getSenders().forEach(sender => {
                if (sender.track.type === track.type) {
                    sender.replaceTrack(track)
                }
            })
        })

    })
    document.getElementById('self').srcObject = stream
    

}
function unmute(s)
{
    var conf={}
    conf[s]=true
    navigator.mediaDevices.getUserMedia(conf).then(stream1=>{
        stream1.getTracks().forEach(track=>{
            stream.getTracks().forEach(track1=>{
                if(track.kind===track1.kind)
                {console.log(track.kind)
                    stream.removeTrack(track1)
                    stream.addTrack(track)
                }
            })
        })
    }).then(()=>{
        console.log(stream.getTracks())
    stream.getTracks().forEach(track => {
        videos.forEach(rid => {
            connection[rid].getSenders().forEach(sender => {
                if (sender.track.type === track.type) {
                    sender.replaceTrack(track)
                }
            })
        })

    })
    document.getElementById('self').srcObject = stream

    })
    }
window.onunload=window.onbeforeunload=function()
{
    for(let i in connection)
    {
        close_connection(i);
    }
}
socket1.on('create_connection', (id) => {
    
    if(connection[id]){
        console.log(connection[id])
    
}
else{
if(!caller1.includes(id)){console.log("caller is not present");caller1.push(id)}
    if(caller1.length>0){
        audio.play()
    document.getElementById('idnum').innerText = caller1[0]
    let caller = document.getElementById('callerdisplay')

    console.log('incoming call', id)
    caller.style.visibility = "visible"
    caller.style.height = "fit-content"
    rid1 = caller1[0]
    }
}

})

function receive() {
    rid1=document.getElementById('idnum').innerText
    caller1=caller1.filter(i=>{return i!==rid1})
    if(caller1.length===0)
    {
    let caller = document.getElementById('callerdisplay')
    caller.style.visibility = "hidden"

    caller.style.height = "0px"
    audio.pause()
    }
    else
    {
        document.getElementById('idnum').innerText = caller1[0]

    }
    
    call(rid1)
    console.log(rid1)
    createoffer(rid1)
}

function ignore() {
    // let caller = document.getElementById('callerdisplay')
    // caller.visibility = "hidden"
    // caller.style.height = "0px"
    rid1=document.getElementById('idnum').innerText
    caller1=caller1.filter(i=>{return i!==rid1})
    if(caller1.length===0)
    {
    let caller = document.getElementById('callerdisplay')
    caller.style.visibility = "hidden"

    caller.style.height = "0px"
    audio.pause()
    }
    else
    {
        document.getElementById('idnum').innerText = caller1[0]

    }
    audio.pause()
    rid1 = ""
}

function makecall() {
    rid1 = document.getElementById('t').value
    console.log('make call request by ', rid1)
    if(!connection[rid1]){
    call(rid1)
    socket1.emit('create_connection', rid1)
    }

}

function call(rid) {

    var remotestream = new MediaStream()

    connection[rid] = new RTCPeerConnection(configuration)
    connection[rid].dc = connection[rid].createDataChannel('signal')
    stream.getTracks().forEach(track => {
        connection[rid].addTrack(track, stream)
    })

    connection[rid].onicecandidate = function(event) {
        if (event.candidate) {
           // console.log("receiver generate ice", event.candidate)
            socket1.emit('icecandidate', {
                candidate: event.candidate,
                to: rid
            })
        }
    }
    connection[rid].ondatachannel = function(event) {
        console.log('channel event',event.channel)
        connection[rid].dc = event.channel
        //console.log(connection[rid].dc)

    }
    console.log(connection[rid].ondatachannel, connection[rid].dc)
    connection[rid].dc.onopen = function() {
        console.log('channel is open')
        let video = document.createElement('video')
        video.id = rid
        video.controls = true
        video.autoplay = true
        video.muted = true
        let div=document.createElement('div')
        let btn=document.createElement('button')
        btn.innerHTML=`<i class="fa fa-times fontawesome" aria-hidden="true"></i>`
        btn.style.visibility="hidden"
        div.style.position="relative"
        
        //btn.style.borderRadius="50%"
        btn.style.padding="5px"
        btn.style.left="50%"
        btn.style.top="0"
        btn.style.transform="translateX(-50%)"
        
        btn.style.backgroundColor="transparent"
        video.style.zIndex="-1"
        btn.onclick=function(){
            console.log(rid);
            close_connection(rid)
        }
        video.onclick=video.onpointerdown=function(){
            console.log('onclick event')
            if(btn.style.visibility=="hidden")
            {
                btn.style.visibility="visible"
                setTimeout(() => {
                    btn.style.visibility="hidden"
                }, 3000);
            }
            else
            {
                btn.style.visibility="hidden"
            }
        }
        btn.style.position='absolute'
        btn.style.zIndex="100"
        
        video.style.width = "100%"
        div.classList.add("col-lg-2" ,"col-md-3" ,"col-sm-4" ,"col-6")
        
        connection[rid].play=1
        connection[rid].full=0

            // video.width=512
        video.srcObject = remotestream
        div.appendChild(video)
        div.appendChild(btn)
        videos.push(rid)
        document.getElementById('div1').appendChild(div)
        connection[rid].onnegotiationneeded = function(event) {
            console.log("event negotiation neede")
            createoffer(rid)
        }

        let option = document.createElement("option")
        option.value = rid
        option.innerText = rid
        document.getElementById('receiver').appendChild(option)




    }
    connection[rid].dc.onclose = function(event) {
       close_connection(rid)
    }
    connection[rid].dc.onmessage = function(message) {
        console.log(message.data)
        let p = document.createElement("p")
        p.style.color = "green"
        p.style.width = "90%"
        p.style.marginLeft = "1%"
        p.style.marginTop = "2px"
        p.style.textAlign = 'left'
        p.style.padding = "5px"
        p.style.backgroundColor = "wheat"
        p.style.borderRadius = "10px"
        p.innerHTML = `<strong>By ${rid}:</strong><br>${message.data}`
            //connection[rid].dc.send(p.innerText)
        document.getElementById('commentbox').appendChild(p);
        document.getElementById('commentbox').scrollTop=document.getElementById('commentbox').scrollHeight-document.getElementById('commentbox').offsetHeight

    }



    connection[rid].ontrack = function(event) {
        console.log(event.track)
        remotestream.addTrack(event.track, remotestream)

    }



    console.log(connection[rid], rid)
}
socket1.on('user disconnected',user=>{
    console.log("user "+user+" disconnected")
    if(connection[user])
    {
        close_connection(user)
    }
})
socket1.on('setice', async message => {
    if (connection[message.to]) {
        if (message.iceCandidate) {
            try {
                //console.log("it is setice receiver",message.iceCandidate)
                await connection[message.to].addIceCandidate(message.iceCandidate);
            } catch (e) {
                console.error('Error adding received ice candidate', e);
            }
        }
    }
})
socket1.on('answer', async(res) => {
    if (connection[res.to]) {
        //console.log(res)
        try {
            let remoteDesc = new RTCSessionDescription(res.answer);
            await connection[res.to].setRemoteDescription(remoteDesc);
        } catch (error) {
            console.log(error)
        }


        //console.log(connection[res.to].dc)


        console.log("call answered")
    }
})
socket1.on('offer', async message => {
    if (connection[message.to]) {
       // console.log(message.offer)
        await connection[message.to].setRemoteDescription(new RTCSessionDescription(message.offer))
        createanswer(message.to)
    }
})
async function createoffer(to) {
    let offer = await connection[to].createOffer()
    await connection[to].setLocalDescription(offer)
    console.log(offer, to)
    socket1.emit('makeCall', {
        offer: offer,
        to: to
    })
}
async function createanswer(to) {
    let answer = await connection[to].createAnswer()
    console.log(answer)
    await connection[to].setLocalDescription(answer)
    socket1.emit('respondcall', {
        'answer': answer,
        'to': to
    });
}

function changefront() {
    stop(stream)
    navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: 'user'
        },
        audio: true
            /*{
                            channelCount: 1,
                            sampleRate: 16000,
                            sampleSize: 16,
                            volume: 1
                        }*/
    }).then(stream1 => {
        if(devices.back)
        {
            devices.back=0
        devices.front=1
        }
        
        stream = stream1
        stream1.getTracks().forEach(track => {
            videos.forEach(rid => {
                connection[rid].getSenders().forEach(sender => {
                    if (sender.track.type === track.type) {
                        sender.replaceTrack(track)
                    }
                })
            })
            document.getElementById('self').srcObject = stream

        })
    }).catch(error => {
        //document.getElementById('front').parentNode.removeChild(document.getElementById('front'))
        delete devices.back
        changeback()
    })
}

function changeback() {
    stop(stream)
    navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: {
                exact: 'environment'
            }
        },
        audio: true
    }).then(stream1 => {
        if(devices.front){
        devices.back=1
        devices.front=0
        }
        stream = stream1
        stream1.getTracks().forEach(track => {
            videos.forEach(rid => {
                connection[rid].getSenders().forEach(sender => {
                    if (sender.track.type === track.type) {
                        sender.replaceTrack(track)
                    }
                })
            })

        })
        document.getElementById('self').srcObject = stream
    }).catch(error => {
        console.log('back camera not working')
        //document.getElementById('back').parentNode.removeChild(document.getElementById('back'))
        delete devices.back
        console.log(devices)
        changefront()
    })
}

function changeCamera() {
    console.log(devices)
    if('front' in devices && 'back' in devices)
    {
        if(devices.front===1 && devices.back===0 )
    {
        changeback()
        return;
    }
    if(devices.front===0 && devices.back===1 )
    {
        changefront()
        return;
    }
    }
    

    

}

function change1() {
    if ('mediaDevices' in navigator && 'getDisplayMedia' in navigator.mediaDevices) {
        navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true
            }).then(stream => {
                //window.alert('screenshare supports')
                let p = document.createElement('p')
                p.innerText = 'sharescreen supported'
                document.body.appendChild(p)
                stream.getTracks().forEach(track => {
                    videos.forEach(rid => {
                        connection[rid].getSenders().forEach(sender => {
                            if (sender.track.type === track.type) {
                                sender.replaceTrack(track)
                            }
                        })
                    })

                })
            })
            .catch(() => {
                /* document.getElementById('chg1').parentNode.removeChild(document.getElementById('chg1'))
                 let p=document.createElement('p')
                 p.innerText='sharescreen not supported'
                 document.body.appendChild(p)*/
                //alert('sharescreen not supported')
            })
    } else {
        document.getElementById('chg1').parentNode.removeChild(document.getElementById('chg1'))
            //let p=document.createElement('p')
            //p.innerText='sharescreen not supported'
            //document.body.appendChild(p)
    }
}

function sendmessage() {
    if (document.getElementById('send').value.trim()!=="") {
        if(document.getElementById('receiver').value === "")
        {
            videos.forEach(x=>{
                connection[x].dc.send(document.getElementById('send').value)
            })
        }
        else{
        connection[document.getElementById('receiver').value].dc.send(document.getElementById('send').value)
        }
        let p = document.createElement("p")
        p.style.color = "red"
        p.style.width = "90%"
        p.style.textAlign = 'left'
        p.style.marginLeft = "9%"
        p.style.marginTop = "2px"
        p.style.padding = "5px"
        p.style.backgroundColor = "wheat"
        p.style.borderRadius = "10px"
        p.innerHTML = `<strong>To ${document.getElementById('receiver').value}: </strong><br>${document.getElementById("send").value}`
            //connection[rid].dc.send(p.innerText)
        document.getElementById('commentbox').appendChild(p);
        document.getElementById('commentbox').scrollTop=document.getElementById('commentbox').scrollHeight-document.getElementById('commentbox').offsetHeight
        document.getElementById('send').value=""
    }
}
function toggle()
{//console.log(event.target.childNodes[0],event.target)
    let target=document.getElementById('up')
    document.getElementById('div2').classList.toggle('m-fadeOut')
    document.getElementById('div2').classList.toggle('m-fadeIn')
    
    if(target.classList.toString().includes('fa-chevron-circle-up'))
    {
        target.classList.remove('fa-chevron-circle-up')
        target.classList.add('fa-chevron-circle-down')
    }
    else
    {
        target.classList.remove('fa-chevron-circle-down')
        target.classList.add('fa-chevron-circle-up')
    }
}


function check(event) {
    if (event.keyCode === 13) {
        sendmessage()
    }
}
function sendFile()
{
    const file = document.getElementById('file').files[0];
  console.log(`File is ${[file.name, file.size, file.type, file.lastModified].join(' ')}`);

  // Handle 0 size files.
  let unique=`${file.name}$$$${new Date()}`
  let seqnum=0

  
  const chunkSize = 16200;
  let chunks=[]
  let fileReader = new FileReader();
  let offset = 0;
  fileReader.addEventListener('error', error => console.error('Error reading file:', error));
  fileReader.addEventListener('abort', event => console.log('File reading aborted:', event));
  fileReader.addEventListener('load', e => {
    console.log('FileRead.onload ', e);
    let data={
        name:unique,
        seq:seqnum,
        status:206,
        file:e.target.result
    }
    if(offset+e.target.result.byteLength>=file.size)
    {
        data.status=200
    }
    chunks.push(e.target.result)
    //connection[rid].dc.send(data);
    offset += e.target.result.byteLength;
    //sendProgress.value = offset;
    if (offset < file.size) {
        seqnum++;
      readSlice(offset);
    }
    else
    {
        let url=URL.createObjectURL(new Blob(chunks))
        let p = document.createElement("p")
        p.style.color = "red"
        p.style.width = "90%"
        p.style.textAlign = 'left'
        p.style.marginLeft = "9%"
        p.style.marginTop = "2px"
        p.style.padding = "5px"
        p.style.backgroundColor = "wheat"
        p.style.borderRadius = "10px"
        p.innerHTML = `<strong>To ${document.getElementById('receiver').value}: </strong><br><a href=${url} download=${unique.split('$$$')[0]}>${unique.split('$$$')[0]}</a>`
            //connection[rid].dc.send(p.innerText)
        document.getElementById('commentbox').appendChild(p);
        document.getElementById('commentbox').scrollTop=document.getElementById('commentbox').scrollHeight-document.getElementById('commentbox').offsetHeight
        document.getElementById('file').value=""

    }
  });
  const readSlice = o => {
    console.log('readSlice ', o);
    const slice = file.slice(offset, o + chunkSize);
    fileReader.readAsArrayBuffer(slice);
  };
  readSlice(0);
}
function copytoclipboard()
{
    let s=socket1.id
let input=document.createElement('input')
input.type='text'
input.value=s
//input.style.visibility="hidden"
document.body.appendChild(input)
input.select()
input.focus()
document.execCommand('copy')
input.parentNode.removeChild(input)

}
window.onresize=function()
{
    document.getElementById('div1').style.height=`${document.body.offsetHeight-document.getElementById('box').offsetHeight}px`
}

    
    return(
        
        <>
        <center>
            
        </center>
        <div className="box" style={{boxShadow:"1px 1px 10px 1px whitesmoke"}} id="box">
        <div style={{padding:"10px"}}>    
        <center>    
        {/* <p id='p'>{socket1.id}</p> */}
            
        <form onSubmit={makecall} method="dialog" className="form-inline">
            <input type="text" name="t" id="t" required placeholder="enter receiver id" />
            <div className="btn-group">
            <input className="btn-sm btn-primary" type="submit" value="submit" />
            <div style={{margin:"0",borderRadius:"50%",width:"40px",height:"40px",position:"relative"}} className="btn btn-success" data-toggle="tooltip" title="copy your id" onClick={copytoclipboard} ><i style={{fontSize:"150%",position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",color:"whitesmoke",backgroundColor:"transparent"}} class="fas fa-clone"></i></div>

            
            </div>
            
        </form>
        <div id='btns'>
        <div style={{margin:"5px",borderRadius:"50%",width:"40px",height:"40px",position:"relative",zIndex:"-1"}} className="btn btn-danger" onClick={change1} data-toggle="tooltip" title="present screen" ><i style={{fontSize:"150%",position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",color:"whitesmoke",backgroundColor:"transparent"}} class="fas fa-desktop"></i></div>

        <div style={{margin:"5px",borderRadius:"50%",width:"40px",height:"40px",position:"relative",zIndex:"-1"}} className="btn btn-danger" onClick={changeCamera} data-toggle="tooltip" title="switch camera" ><i style={{fontSize:"150%",position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",color:"whitesmoke",backgroundColor:"transparent"}} class="fas fa-sync"></i></div>
        <div style={{margin:"5px",borderRadius:"50%",width:"40px",height:"40px",position:"relative",zIndex:"-1"}} className="btn btn-danger" id="switchaudio"><i style={{fontSize:"150%",position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",color:"whitesmoke",backgroundColor:"transparent"}} class="fas fa-microphone-slash"></i></div>
        <div style={{margin:"5px",borderRadius:"50%",width:"40px",height:"40px",position:"relative",zIndex:"-1"}} className="btn btn-danger" id="switchvideo"><i style={{fontSize:"150%",position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",color:"whitesmoke",backgroundColor:"transparent"}} class="fas fa-video-slash"></i></div>
        
        


        
        </div>
        
        </center>
        
            
        
        
        
        </div>
        <div style={{display:"grid",placeItems:"center"}}>
        <video src="" style={{width:"60%"}} id="self" autoPlay muted>
            
        </video>
        </div>
        </div>
        
        <div id="div1" className="col-12" style={{display:"flex",flexWrap:"wrap",overflowY:"scroll"}}>
            


        </div>
        <div id="div2" className="m-fadeOut" style={{width:"98vw",position:"absolute",left:"50%",transform:"translateX(-50%)",bottom:"5px",zIndex:"100"}}>
        
        <div id="commentbox" style={{position:"relative",width:"100%",height:"40vh",backgroundColor:"whitesmoke",marginLeft:"50%",transform:"translateX(-50%)",overflowY:"scroll"}}>
        <strong style={{fontSize:"1.5em"}}>Select receiver: </strong> 
        <select style={{position:"absolute",left:"5px",bottom:"5px"}} name="receiver" id="receiver" style={{padding:"3px"}}>
                <option value="" >All</option>
            </select>
        <div style={{position:"absolute",left:"0",bottom:"0"}} className="btn-group-sm">
            <button className="btn-sm btn-primary" onClick={()=>{
                document.getElementById('send').style.visibility="visible"
                document.getElementById('fileform').style.visibility="hidden"
            }}>text</button>
            <button className="btn-sm btn-danger" onClick={()=>{

                document.getElementById('send').style.visibility="hidden"
                document.getElementById('fileform').style.visibility="visible"
            }}>file</button>
        </div>

</div>
{/* <form onSubmit={sendmessage} method="dialog"> */}
            <center>
                <div style={{width:"100%",heigth:"70px",padding:"0",position:"relative"}}>
                <textarea  style={{width:"100%",height:"70px",visibility:"visible"}} id="send" placeholder="write message and press enter to send!" onKeyPress={(event)=>{if(event.which===13){console.log(event.which);sendmessage()}}}></textarea>
                <div id="fileform" style={{visibility:"hidden",position:"absolute",top:"0",left:"0",width:"100%",backgroundColor:"gray"}}>
                    <form className="form-inline" onSubmit={sendFile} method="dialog" >
                        <div className="form-group">
                        <input type="file" name="file" id="file" required />
                        <input className="btn-sm btn-success" type="submit" value="sendfile" />
                        </div>
                        
                    </form>
                </div>

                </div>
            
            
            {/* <p></p> */}
            {/* <textarea name="" id="" cols="30" rows="10"></textarea> */}
            {/* <input type="text" style={{width:"100%"}} id="send" placeholder="write message" onKeyPress={(event)=>{if(event.which===13){console.log(event.which);sendmessage()}}} /> */}
            
            {/* <input type="submit" value="SEND MESSAGE" /> */}
            </center>
        {/* </form> */}
        </div>
        

        <div>
        <div id="callerdisplay" style={{position:"absolute",borderRadius:"10px",padding:"5px",backgroundColor:"gray",width:"fit-content",left:"50%",top:"4%",transform:"translate(-50%,0)",border:"2px solid black",boxShadow:"-5px -5px 8px 5px red",overflow:"hidden",height:"0",visibility:"hidden",zIndex:"100"}}>
            <p style={{textAlign:"center"}} id="idnum"></p>
            <div style={{display:"flex",justifyContent:"space-around"}}>
                <figure onClick={receive}>
                    <img src="https://png.pngitem.com/pimgs/s/207-2074671_free-green-phone-icon-hd-png-download.png" style={{borderRadius:"50%"}} height="50" width="50" alt="" />
                    <figcaption>Receive</figcaption>
                </figure>
                <figure onClick={ignore}>
                    <img src="https://image.shutterstock.com/image-vector/decline-phone-call-button-handset-260nw-1141358105.jpg" style={{borderRadius:"50%"}} height="50" width="50" alt="" />
                    <figcaption>Ignore</figcaption>
                </figure>
            </div>
            

        </div>
        </div>
        <button onClick={toggle} className="btn btn-primary" style={{position:"absolute",bottom:"10px",right:"10px",zIndex:"100"}}><i id="up" style={{fontSize:"30px"}} class="fa fa-chevron-circle-up" data-toggle="tooltip" title="open message panel" aria-hidden="true"></i></button>
        
       
        </>
    )
}
export default Home