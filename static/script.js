document.addEventListener("DOMContentLoaded", () => {
 
    //adjustTempImg();

    createMemoryChart();
    createDiskChart();

    document.getElementById("turnoff").addEventListener("click", turnoff);
    document.getElementById("cancel").addEventListener("click", hidePswdBox);
    document.getElementById("restart").addEventListener("click", reboot);

})

function createMemoryChart(){
    var currentURL = window.location.href;
    currentURL += "memory"
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", currentURL, true);

    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            var data = this.responseText;
            data = JSON.parse(data)
            
            buildChart(data['data']);
        }
    }

    xhttp.send()
}

function buildChart(ram){
    var charta = document.getElementById("memoryChart").getContext("2d");

    windowX = window.screen.width;
    
    

    var gradient = charta.createLinearGradient(0, 0,0, 400);
    gradient.addColorStop(0, 'rgba(255, 36, 69, 0.8)');   // Start color
    gradient.addColorStop(1, 'rgba(242, 0, 174,1)');   // End color

    
    var doughnutLabel = {
        id: 'doughnut',
        beforeDatasetsDraw(chart, args, pluginOptions) {
            const { ctx } = chart;

            ctx.save();

            const x = chart.getDatasetMeta(0).data[0].x;
            const y = chart.getDatasetMeta(0).data[0].y;

            ctx.font = "bold 1rem sans-serif";
            ctx.fillStyle = "rgb(226, 226, 226)";
            ctx.textAlign = "center";

            var text = ram[1]+"Gb / "+((ram[0]+ram[1]).toFixed(1))+"Gb"
            ctx.fillText(text, x, y);

            ctx.fillText("RAM", x, y-30);
        }
    }

    var cutoutValue = 69;

    if(windowX < 630 && windowX > 450){
        cutoutValue = 70;  
    }else if(windowX <= 450){
        cutoutValue= 81;
    }

    var graph = new Chart(charta, {
        type: 'doughnut',
        data: {
            labels: [
                'used',
                'free'
              ],
              datasets: [{
                label: 'ram monitoring',
                backgroundColor: ["white", "white"],
                data: [ram[1], ram[0]],
                backgroundColor: [gradient,'rgb(75, 187, 242)'],
                borderWidth: 30,
                borderColor: 'transparent',
                hoverOffset: 4
              }]
        },
        options: {
            responsive: true,
            plugins:{
                legend: {
                    
                    labels: {
                        color: "rgb(226, 226, 226);",
                        
                        font: {
                            size:15
                        }
                    }
                }
            },
            cutout: cutoutValue,
            animation: {
                animateScale:  true	
            }
        },
        plugins: [doughnutLabel]
    });


    // var text = "Center Text";

    // // Get the center coordinates of the canvas
    // var centerX = chart.width / 2;
    // var centerY = chart.height / 2;
    
    // // Define the font properties
    // chart.font = "16px Arial";
    // chart.fillStyle = "#d6c1d0";
    // chart.textAlign = "center";
    
    // // Draw the text in the center
    // chart.fillText(text, centerX, centerY);
}


function createDiskChart(){
    var currentURL = window.location.href;
    currentURL += "diskspace"
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", currentURL, true);

    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            var data = this.responseText;
            data = JSON.parse(data)
            
            buildDiskChart(data['data']);
        }
    }

    xhttp.send()
}

function buildDiskChart(data){

    free = data[0]
    used = data[1]
    total = data[2]


    usedDiv = document.getElementById("usedDisk");

    // calculate the percentage

    perc = (used*100)/total;

    usedDiv.style.width = perc+"%";

    document.getElementById("usedSpace").textContent = total+" G";

    document.getElementById("usedInfo").textContent = used+" G";
    document.getElementById("freeInfo").textContent = free+" G"
    
}

function displayPswdBox(isTurnoff){

    text = document.getElementById("keyAction");
    actionBtn = document.getElementById("actioner");
    // replace the text and button 

    text.textContent = "REBOOT";
    actionBtn.textContent = "REBOOT";

    if(isTurnoff) {  // if user wants to turn off
        
        text.textContent = "TURN OFF";
        actionBtn.textContent = "TURN OFF"
        
    }


    document.getElementById("root-pswd").style.display = "block";
    document.getElementById("main").style.filter = "blur(10px)";
    document.getElementById("pass").value = "";
}



function hidePswdBox(){
    document.getElementById("root-pswd").style.display = "none";
    document.getElementById("main").style.filter = "blur(0px)";
    document.getElementById("pass").value = "";
}

function turnoff(){
    var isTurnoff = true;
    displayPswdBox(isTurnoff);
    document.getElementById("actioner").addEventListener("click", function(){
        actioner(isTurnoff);
    });
}


function reboot(){
    var isTurnoff = false;
    displayPswdBox(isTurnoff);
    document.getElementById("actioner").addEventListener("click", function(){
        actioner(isTurnoff);
    });
}


function actioner(isTurnoff){

    //check password 
    var correctpswd = true;

    var password = document.getElementById("pass").value;
    if(password.length > 0){

        var redirectPage = window.location.href + "turnoff";
        if(!isTurnoff){
            redirectPage = window.location.href + "reboot";
           
        }

        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", redirectPage, true);

        xhttp.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                alert(this.responseText);
                if(this.responseText == "PASSWORD DOESN'T MATCH"){
                    correctpswd = false;
                }
            }
        };



        var dati = {
            "password": password
        }

        
        xhttp.send(JSON.stringify(dati));

        if(correctpswd){
            if(isTurnoff){
                alert("TURNING OFF");
            }else{
                alert("REBOOTING");
            }
        }

        

    }else{
        alert("password is required")
    }


}