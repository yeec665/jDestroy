var extensionURL = document.getElementById("extensionURL");
extensionURL = extensionURL.getAttribute("title");
var documentBody = document.getElementsByTagName("body")[0];
var gameStarted = 0;
var gameScore = 0;
var playerInterference = -1;
var ammunitionList = [];
var selectedAmmo = null;
var launchCountDown = 0;
var projectileList = [];
var barrierList = [];
var droppingList = [];
function setUpField() {
    jQuery("div.v-wrap").css("margin", "20px");
    var rubberBand = document.createElementNS("http://www.w3.org/2000/svg", "path");
    rubberBand.id = "rubberBand";
    rubberBand.setAttribute("d", "M 20,180 Q 50,180 70,180");
    rubberBand.setAttribute("fill", "none");
    rubberBand.setAttribute("stroke-width", "5px");
    rubberBand.setAttribute("stroke", "saddlebrown");
    var indicatorArc = document.createElementNS("http://www.w3.org/2000/svg", "path");
    //indicatorArc.setAttribute("d", "M 50,360 A 180,180 0 0,0 50,0");
    indicatorArc.setAttribute("d", "M 140,335.8846 A 180,180 0 0,0 140,24.1154");
    indicatorArc.setAttribute("fill", "none");
    indicatorArc.setAttribute("stroke-width", "50px");
    indicatorArc.setAttribute("stroke", "lightblue");
    var indicatorWrap = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    indicatorWrap.setAttribute("width", "280px");
    indicatorWrap.setAttribute("height", "360px");
    indicatorWrap.appendChild(rubberBand);
    indicatorWrap.appendChild(indicatorArc);
    var cataplutImg = document.createElement("img");
    cataplutImg.id = "cataplutImg";
    cataplutImg.setAttribute("src", extensionURL + "res/cataplut.png");
    var launchArea = document.createElement("div");
    launchArea.id = "launchArea";
    launchArea.appendChild(indicatorWrap);
    launchArea.appendChild(cataplutImg);
    jQuery(indicatorArc).css({
        "cursor": "pointer"
    }).mouseleave(function(event) {
        if (selectedAmmo != null && launchCountDown == 0) {
            rubberBand.setAttribute("d", "M 20,180 Q 50,180 70,180");
            selectedAmmo.wrap.style = "transform: translate(50px,180px);";
        }
    }).mousemove(function(event) {
        if (launchCountDown == 0) {
            if (selectedAmmo != null) {
                var dx = event.clientX - (launchArea.offsetLeft + 50);
                var dy = event.clientY - (launchArea.offsetTop + 180);
                var angle = Math.atan2(dy, dx);
                var cos = Math.cos(angle);
                var sin = Math.sin(angle);
                dx = 50 + 100 * Math.cos(angle);
                dy = 180 + 100 * Math.sin(angle);
                selectedAmmo.baseX = dx;
                selectedAmmo.baseY = dy;
                rubberBand.setAttribute("d", "M 20,180 Q " + (2 * dx - 50) + "," + (2 * dy - 180) + " 70,180");
                selectedAmmo.wrap.style = "transform: matrix(" + cos + "," + sin + "," + (-sin) + "," + cos + "," + dx + "," + dy + ");";
            } else if (ammunitionList.length > 0) {
                selectedAmmo = ammunitionList.pop();
            }
        }
    }).click(function(event) {
        if (selectedAmmo != null && launchCountDown == 0) {
            launchCountDown = 4;
        }
    });
    documentBody.appendChild(launchArea);
    var scorePlate = document.createElement("div");
    scorePlate.id = "scorePlate";
    scorePlate.innerHTML = "得分：0";
    documentBody.appendChild(scorePlate);
}
function createAmmunition() {
    for (var i = 0; i < 6; i++)  {
        var ammoImg = document.createElement("img");
        ammoImg.setAttribute("src", extensionURL + "res/projectile-1-1.png");
        var ammoWrap = document.createElement("div");
        ammoWrap.appendChild(ammoImg);
        ammoWrap.className = "projectile";
        var ammo = new Object();
        ammo.baseX = -92 * i;
        ammo.baseY = 318;
        ammoWrap.style = "transform: translate(" + ammo.baseX + "px," + ammo.baseY + "px);";
        ammo.state = 0;
        ammo.progress = 0;
        ammo.img = ammoImg;
        ammo.wrap = ammoWrap;
        ammunitionList.push(ammo);
        jQuery("#launchArea").append(ammoWrap);
    }
}
function collectBarrier() {
    var collection = jQuery("div#bilibiliPlayer");
    for (var i = 0; i < collection.length; i++) {
        var barrier = new Object();
        barrier.state = 6;
        barrier.cd = 0;
        barrier.obj = collection[i];
        barrierList.push(barrier);
    }
    collection = jQuery("div#slide_ad");
    for (var i = 0; i < collection.length; i++) {
        var barrier = new Object();
        barrier.state = 3;
        barrier.cd = 0;
        barrier.obj = collection[i];
        barrierList.push(barrier);
    }
    collection = jQuery("div.pic-box");
    for (var i = 0; i < collection.length; i++) {
        var barrier = new Object();
        barrier.state = 3;
        barrier.cd = 0;
        barrier.obj = collection[i];
        barrierList.push(barrier);
    }
    collection = jQuery("div.info");
    for (var i = 0; i < collection.length; i++) {
        var barrier = new Object();
        barrier.state = 1;
        barrier.cd = 0;
        barrier.obj = collection[i];
        barrierList.push(barrier);
    }
}
function ammoLoop() {
    if (ammunitionList.length > 0 && Math.random() < 0.08) {
        var ammo = ammunitionList[Math.floor(Math.random() * ammunitionList.length)];
        if (ammo.state == 0) {
            ammo.state = Math.floor(Math.random() * 14);
            ammo.progress = 0;
            switch(ammo.state) {
                case 1:
                case 2:
                case 7:
                case 9:
                    ammo.img.setAttribute("src", extensionURL + "res/projectile-1-2.png");
                    break;
                case 3:
                case 4:
                case 13:
                    ammo.img.setAttribute("src", extensionURL + "res/projectile-1-3.png");
                    break;
            }
        }
    }
    for (var i = 0; i < ammunitionList.length; i++) {
        var ammo = ammunitionList[i];
        ammo.progress++;
        switch (ammo.state) {
            case 1:
            case 2:
            case 3:
            case 4:
                if (ammo.progress > 8) {
                    ammo.img.setAttribute("src", extensionURL + "res/projectile-1-1.png");
                    ammo.state = 0;
                }
                break;
            case 5:
            case 6:
                if (ammo.progress <= 10) {
                    ammo.wrap.style = "transform: translate(" + ammo.baseX + "px," + (ammo.baseY - 25 + (ammo.progress - 5) * (ammo.progress - 5)) + "px);";
                } else {
                    ammo.wrap.style = "transform: translate(" + ammo.baseX + "px," + ammo.baseY + "px);";
                    ammo.state = 0;
                }
                break;
            case 7:
            case 8:
                if (ammo.progress <= 16) {
                    ammo.wrap.style = "transform: translate(" + ammo.baseX + "px," + (ammo.baseY - 64 + (ammo.progress - 8) * (ammo.progress - 8)) + "px);";
                } else {
                    ammo.img.setAttribute("src", extensionURL + "res/projectile-1-1.png");
                    ammo.wrap.style = "transform: translate(" + ammo.baseX + "px," + ammo.baseY + "px);";
                    ammo.state = 0;
                }
                break;
            case 9:
            case 10:
                if (ammo.progress <= 20) {
                    ammo.wrap.style = "transform: translate(" + ammo.baseX + "px," + (ammo.baseY - 100 + (ammo.progress - 10) * (ammo.progress - 10)) + "px);";
                } else {
                    ammo.img.setAttribute("src", extensionURL + "res/projectile-1-1.png");
                    ammo.wrap.style = "transform: translate(" + ammo.baseX + "px," + ammo.baseY + "px);";
                    ammo.state = 0;
                }
                break;
            case 11:
                if (ammo.progress <= 10) {
                    var angle = Math.PI / 12 * Math.sin(2 * Math.PI * ammo.progress / 10);
                    var cos = Math.cos(angle);
                    var sin = Math.sin(angle);
                    ammo.wrap.style = "transform: matrix(" + cos + "," + sin + "," + (-sin) + "," + cos + "," + ammo.baseX + "," + ammo.baseY + ");";
                } else {
                    ammo.wrap.style = "transform: translate(" + ammo.baseX + "px," + ammo.baseY + "px);";
                    ammo.state = 0;
                }
                break;
            case 12:
            case 13:
                if (ammo.progress <= 20) {
                    var angle = 2 * Math.PI * ammo.progress / 20;
                    var cos = Math.cos(angle);
                    var sin = Math.sin(angle);
                    ammo.wrap.style = "transform: matrix(" + cos + "," + sin + "," + (-sin) + "," + cos + "," + ammo.baseX + "," + (ammo.baseY - 100 + (ammo.progress - 10) * (ammo.progress - 10)) + ");";
                } else {
                    ammo.img.setAttribute("src", extensionURL + "res/projectile-1-1.png");
                    ammo.wrap.style = "transform: translate(" + ammo.baseX + "px," + ammo.baseY + "px);";
                    ammo.state = 0;
                }
                break;
        }
    }
}
function launchLoop() {
    if (launchCountDown > 0) {
        launchCountDown--;
        if (selectedAmmo != null) {
            var angle = Math.atan2(selectedAmmo.baseY - 180, selectedAmmo.baseX - 50);
            var cos = Math.cos(angle);
            var sin = Math.sin(angle);
            if (launchCountDown > 0) {
                var rate = Math.sin(0.5 * Math.PI * launchCountDown / 4);
                var dx = 50 + rate * (selectedAmmo.baseX - 50);
                var dy = 180 + rate * (selectedAmmo.baseY - 180);
                document.getElementById("rubberBand").setAttribute("d", "M 20,180 Q " + (2 * dx - 50) + "," + (2 * dy - 180) + " 70,180");
                selectedAmmo.wrap.style = "transform: matrix(" + cos + "," + sin + "," + (-sin) + "," + cos + "," + dx + "," + dy + ");";
            } else {
                var launchArea = document.getElementById("launchArea");
                var jet = new Object();
                jet.state = 1;
                jet.x = launchArea.offsetLeft + 50;
                jet.y = launchArea.offsetTop + 180;
                jet.vx = -40 * cos;
                jet.vy = -40 * sin;
                jet.a = angle;
                jet.w = 0.06 - 0.09 * Math.random();
                jet.img = selectedAmmo.img;
                jet.wrap = selectedAmmo.wrap;
                jQuery(selectedAmmo.wrap).remove();
                jet.wrap.style = "transform: matrix(" + cos + "," + sin + "," + (-sin) + "," + cos + "," + jet.x + "," + jet.y + ");";
                jQuery(documentBody).append(jet.wrap);
                selectedAmmo = null;
                projectileList.push(jet);
            }
        }
    }
}
function dropJetDebris(jet) {
    for (var i = 0; i < 3; i++) {
        var droppingImg = document.createElement("img");
        var droppingWrap = document.createElement("div");
        droppingWrap.appendChild(droppingImg);
        droppingWrap.className = "jet-debris";
        var dropping = new Object();
        dropping.ttl = Math.ceil(20 + 20 * Math.random());
        dropping.x = jet.x - 40 + 80 * Math.random();
        dropping.y = jet.y - 40 + 80 * Math.random();
        dropping.vx = -5 + 10 * Math.random();
        dropping.vy = -5 + 10 * Math.random();
        dropping.a = 2 * Math.PI * Math.random();
        dropping.w = 0.04 - 0.08 * Math.random();
        dropping.wrap = droppingWrap;
        var cos = Math.cos(dropping.a);
        var sin = Math.sin(dropping.a);
        droppingWrap.style = "transform: matrix(" + cos + "," + sin + "," + (-sin) + "," + cos + "," + dropping.x + "," + dropping.y + ");";
        if (Math.random() < 0.5) {
            droppingImg.setAttribute("src", extensionURL + "res/debris-1-1.png");
            dropping.g = 0.2;
        } else if (Math.random() < 0.5) {
            droppingImg.setAttribute("src", extensionURL + "res/debris-1-2.png");
            dropping.g = 0.3;
        } else {
            droppingImg.setAttribute("src", extensionURL + "res/debris-1-3.png");
            dropping.g = 0.1;
        }
        droppingList.push(dropping);
        documentBody.appendChild(droppingWrap);
    }
}
function dropBarrierDebris(barrier) {
    var droppingImg = document.createElement("img");
    droppingImg.setAttribute("src", extensionURL + "res/debris-1-4.png");
    var droppingWrap = document.createElement("div");
    droppingWrap.appendChild(droppingImg);
    droppingWrap.className = "barrier-debris";
    var dropping = new Object();
    dropping.ttl = 100;
    dropping.x = barrier.obj.offsetLeft + 0.5 * barrier.obj.offsetWidth;
    dropping.y = barrier.obj.offsetTop + 0.5 * barrier.obj.offsetHeight;
    dropping.vx = -5 + 10 * Math.random();
    dropping.vy = -5 + 10 * Math.random();
    dropping.a = 2 * Math.PI * Math.random();
    dropping.w = 0.1 - 0.2 * Math.random();
    dropping.g = 1.3;
    dropping.wrap = droppingWrap;
    var cos = Math.cos(dropping.a);
    var sin = Math.sin(dropping.a);
    droppingWrap.style = "transform: matrix(" + cos + "," + sin + "," + (-sin) + "," + cos + "," + dropping.x + "," + dropping.y + ");";
    droppingList.push(dropping);
    documentBody.appendChild(droppingWrap);
}
function rightCrack(obj, y) {
    var width = obj.offsetWidth;
    var height = obj.offsetHeight;
    var pointsStack = [];
    var pointsString = "";
    var x = width;
    for (var i = 0; i < 3; i++) {
        var gap = 5.5 + 3.5 * Math.sin(x + y);
        pointsString = pointsString + x + "," + (y + gap) + " ";
        pointsStack.push(x);
        pointsStack.push(y);
        x -= (0.18 + 0.12 * Math.random()) * width;
        if (y > 0.5 * height) {
            y -= (0.15 + 0.35 * Math.random()) * height;
        } else {
            y += (0.15 + 0.35 * Math.random()) * height;
        }
    }
    pointsString = pointsString + x + "," + y;
    for (var i = 0; i < 3; i++) {
        y = pointsStack.pop();
        x = pointsStack.pop();
        var gap = 5.5 + 3.5 * Math.sin(x + y);
        pointsString = pointsString + " " + x + "," + (y - gap);
    }
    var crackOverlay = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    crackOverlay.setAttribute("points", pointsString);
    crackOverlay.setAttribute("fill", "white");
    crackOverlay.setAttribute("stroke", "none");
    var svgOverlay = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgOverlay.setAttribute("width", width + "px");
    svgOverlay.setAttribute("height", height + "px");
    svgOverlay.appendChild(crackOverlay);
    jQuery(svgOverlay).css({
        "position": "absolute",
        "left": "0px",
        "top": "0px",
        "width": width + "px",
        "height": height + "px"
    });
    obj.appendChild(svgOverlay);
}
function cornerCollision(jet, dx, dy) {
    var direction = Math.atan2(dy, dx);
    var cos = Math.cos(direction);
    var sin = Math.sin(direction);
    var projection = cos * jet.vx + sin * jet.vy;
    jet.vx -= 1.6 * cos * projection;
    jet.vy -= 1.6 * sin * projection;
}
function projectileLoop() {
    projectileList.forEach(function(jet) {
        if (jet.state == 0) {
            return;
        }
        jet.vy += 1.0;
        jet.x += jet.vx;
        jet.y += jet.vy;
        jet.a += jet.w;
        barrierList.forEach(function(barrier) {
            if (barrier.state == 0 || barrier.cd > 0) {
                return;
            }
            var obj = barrier.obj;
            if (obj.offsetTop - 40 < jet.y && jet.y < obj.offsetTop + obj.offsetHeight + 40 && obj.offsetLeft - 40 < jet.x && jet.x < obj.offsetLeft + obj.offsetWidth + 40) {
                switch (barrier.state) {
                    case 6:
                        if (obj.offsetTop < jet.y && jet.y < obj.offsetTop + obj.offsetHeight) {
                            dropJetDebris(jet);
                            gameScore += 20;
                            jQuery("#scorePlate").text("得分：" + gameScore);
                            barrier.state = 5;
                            barrier.cd = 8;
                            if (jet.x > obj.offsetLeft + 0.5 * obj.offsetWidth) {
                                jet.vx = 0.7 * Math.abs(jet.vx);
                            } else {
                                jet.vx = -0.7 * Math.abs(jet.vx);
                            }
                            obj.style = "transform: rotate(-4deg);";
                            jet.w = 0.06 - 0.09 * Math.random();
                        }
                        break;
                    case 5:
                        if (obj.offsetTop < jet.y && jet.y < obj.offsetTop + obj.offsetHeight) {
                            dropJetDebris(jet);
                            gameScore += 20;
                            jQuery("#scorePlate").text("得分：" + gameScore);
                            barrier.state = 4;
                            barrier.cd = 8;
                            if (jet.x > obj.offsetLeft + 0.5 * obj.offsetWidth) {
                                jet.vx = 0.7 * Math.abs(jet.vx);
                            } else {
                                jet.vx = -0.7 * Math.abs(jet.vx);
                            }
                            obj.style = "transform: matrix(0.990268,-0.139173,0.139173,0.990268,-4,200);";
                            jet.w = 0.06 - 0.09 * Math.random();
                            playerInterference = 0;
                        }
                        break;
                    case 4:
                        dropBarrierDebris(barrier);
                        gameScore += 300;
                        jQuery("#scorePlate").text("得分：" + gameScore);
                        barrier.state = 0;
                        player.destroy();
                        playerInterference = -1;
                        break;
                    case 3:
                        if (obj.offsetTop < jet.y && jet.y < obj.offsetTop + obj.offsetHeight) {
                            dropJetDebris(jet);
                            barrier.state = 2;
                            barrier.cd = 8;
                            var move = 6 + 9 * Math.random();
                            jet.vx = 0.6 * Math.abs(jet.vx);
                            if (jet.x > obj.offsetLeft + 0.5 * obj.offsetWidth) {
                                rightCrack(obj, jet.y - obj.offsetTop);
                                move = -move;
                            } else {
                                jet.vx = -jet.vx;
                            }
                            obj.style = "transform: translate(" + move + "px,0px);";
                            jet.w = 0.06 - 0.09 * Math.random();
                            break;
                        }
                        if (obj.offsetLeft < jet.x && jet.x < obj.offsetLeft + obj.offsetWidth) {
                            dropJetDebris(jet);
                            barrier.state = 2;
                            barrier.cd = 8;
                            rightCrack(obj, jet.y - obj.offsetTop);
                            var move = 4 + 6 * Math.random();
                            jet.vy = 0.6 * Math.abs(jet.vy);
                            if (jet.y > obj.offsetTop + 0.5 * obj.offsetHeight) {
                                move = -move;
                            } else {
                                jet.vy = -jet.vy;
                            }
                            obj.style = "transform: translate(0px," + move + "px);";
                            jet.w = 0.06 - 0.09 * Math.random();
                            break;
                        }
                        var dx = jet.x - (obj.offsetLeft + obj.offsetWidth);
                        var dy = jet.y - obj.offsetTop;
                        if (dx * dx + dy * dy < 40 * 40) {
                            dropJetDebris(jet);
                            barrier.state = 2; // rotate
                            barrier.cd = 6;
                            obj.style = "transform: rotate(-4deg);";
                            cornerCollision(jet, dx, dy);
                            break;
                        }
                        dx = jet.x - (obj.offsetLeft + obj.offsetWidth);
                        dy = jet.y - (obj.offsetTop + obj.offsetHeight);
                        if (dx * dx + dy * dy < 40 * 40) {
                            dropJetDebris(jet);
                            barrier.state = 2; // rotate
                            barrier.cd = 6;
                            obj.style = "transform: rotate(4deg);";
                            cornerCollision(jet, dx, dy);
                            break;
                        }
                        break
                    case 2:
                        dropBarrierDebris(barrier);
                        gameScore += 10;
                        jQuery("#scorePlate").text("得分：" + gameScore);
                        obj.style = "opacity: 0;";
                        barrier.state = 0;
                        jet.vx *= 0.8;
                        jet.vy *= 0.8;
                        break;
                    case 1:
                        obj.style = "opacity: 0;";
                        gameScore += 5;
                        jQuery("#scorePlate").text("得分：" + gameScore);
                        barrier.state = 0;
                        jet.vx *= 0.9;
                        jet.vy *= 0.9;
                        break;
                }
            }
        });
        var cos = Math.cos(jet.a);
        var sin = Math.sin(jet.a);
        jet.wrap.style = "transform: matrix(" + cos + "," + sin + "," + (-sin) + "," + cos + "," + jet.x + "," + jet.y + ");";
        if (jet.y > 2000) {
            jet.state = 0;
        }
    });
    barrierList.forEach(function(barrier) {
        if (barrier.state != 0 && barrier.cd > 0) {
            barrier.cd--;
        }
    });
}
function droppingLoop() {
    droppingList.forEach(function(dropping) {
        if (dropping.ttl > 0) {
            dropping.ttl--;
            if (dropping.ttl == 0) {
                jQuery(dropping.wrap).remove();
            } else {
                dropping.vy += dropping.g;
                dropping.x += dropping.vx;
                dropping.y += dropping.vy;
                dropping.a += dropping.w;
                var cos = Math.cos(dropping.a);
                var sin = Math.sin(dropping.a);
                dropping.wrap.style = "transform: matrix(" + cos + "," + sin + "," + (-sin) + "," + cos + "," + dropping.x + "," + dropping.y + ");";
            }
        }
    });
}
function videoPlayerLoop() {
    if (playerInterference >= 0) {
        if (playerInterference % 12 == 0) {
            player.pause();
        }
        if (playerInterference % 12 == 6) {
            player.play();
        }
        playerInterference++;
    }
}
function gameLoop() {
    ammoLoop();
    launchLoop();
    projectileLoop();
    droppingLoop();
    videoPlayerLoop();
}
function gameStart() {
    setUpField();
    collectBarrier();
    createAmmunition();
    setInterval(gameLoop, 64);
}
function addButton() {
    var target = jQuery(".user-con.signin");
    if (target.length > 0) {
        var buttonImg = document.createElement("img");
        buttonImg.setAttribute("src", "//i0.hdslb.com/bfs/face/28f95c383f2805dbed32e93007c91ccfda28775f.jpg@70w_70h_1c_100q.webp");
        jQuery(buttonImg).css({
            "width": "100%",
            "height": "100%",
            "border-radius": "50%"
        });
        var buttonDiv = document.createElement("div");
        buttonDiv.setAttribute("title", "来嘛，来玩鸟嘛！")
        buttonDiv.appendChild(buttonImg);
        jQuery(buttonDiv).css({
            "width": "36px",
            "height": "36px",
            "border-radius": "50%",
            "cursor": "pointer"
        }).click(function() {
            if (gameStarted == 0) {
                gameStarted = 1;
                gameStart();
            }
        });
        //var buttonSpan = document.createElement("span");
        //buttonSpan.appendChild(buttonDiv);
        //var wrapDiv = document.createElement("div");
        //wrapDiv.className = "item";
        //wrapDiv.appendChild(buttonSpan);
        target.prepend(buttonDiv);
    } else {
        window.setTimeout("addButton()", 2000);
    }
}
window.setTimeout("addButton()", 2000);