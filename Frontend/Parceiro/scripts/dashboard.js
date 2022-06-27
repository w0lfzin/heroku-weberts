
//OPEN STATE FILTER SECTION
function openStates(){
    if ($("#state-options")[0].style.display == "none" || $("#state-options")[0].style.display == ""){
        $("#state-options")[0].style.display = "flex"
        off = false
        $("#estados-filter")[0].style.backgroundColor = "#3468FC"
        $("#estados-filter")[0].style.color = "#FFF"
    } else{
        $("#state-options")[0].style.display = "none"
        $("#estados-filter")[0].style.backgroundColor = "#DDE6FF"
        $("#estados-filter")[0].style.color = "#373737"
    }
    
}

//OPEN PARTNER FILTER SECTION
function openPartner(){
    if ($("#partner-options")[0].style.display == "none" || $("#partner-options")[0].style.display == ""){
        $("#partner-options")[0].style.display = "flex"
        off = false
        $("#parceiros-filter")[0].style.backgroundColor = "#3468FC"
        $("#parceiros-filter")[0].style.color = "#FFF"
    } else{
        $("#partner-options")[0].style.display = "none"
        $("#parceiros-filter")[0].style.backgroundColor = "#DDE6FF"
        $("#parceiros-filter")[0].style.color = "#373737"
    }
}

//OPEN TYPE OF ANTECIPATION FILTER SECTION
function openType(){
    if ($("#type-options")[0].style.display == "none" || $("#type-options")[0].style.display == ""){
        $("#type-options")[0].style.display = "flex"
        off = false
        $("#tipos-filter")[0].style.backgroundColor = "#3468FC"
        $("#tipos-filter")[0].style.color = "#FFF"
    } else{
        $("#type-options")[0].style.display = "none"
        $("#tipos-filter")[0].style.backgroundColor = "#DDE6FF"
        $("#tipos-filter")[0].style.color = "#373737"
    }

}

//LOGOUT POPUP
function quitPopup(){
    if ($("#quitPopup")[0].style.display == "none" || $("#quitPopup")[0].style.display == ""){
        $("#quitPopup")[0].style.display = "flex"
        $("#shadow")[0].style.display = "flex"
    } else{
        $("#quitPopup")[0].style.display = "none"
        $("#shadow")[0].style.display = "none"
    }
}

function attData() {
    
    //CREATE THE OPTIONS OF STATE FILTER
    $.get("/openStates", function(result){
        let i = 0
        result.forEach(row => {
            $("#state-options")[0].innerHTML += `<div class="state-unselected"><input type="checkbox" onclick="changeState()" id="state` + i + `"><h3 id="stateText` + i + `">${row.estado}</h3></div>`;
            i++
        });
    });


    //CREATE THE OPTIONS OF PARTNER FILTER
    $.get("h/openPartner", function(result){
        var usedNames = []
        let i = 0
        result.forEach(row => {
            var currentName = row.nome
            if (!usedNames.includes(currentName)){ 
                usedNames.push(currentName)             
                $("#partner-options")[0].innerHTML += `<div class="partner-unselected"><input type="checkbox" onclick="changePartner()" id="partner` + i + `"><h3 id="partnerText` + i + `">${row.nome}</h3></div>`;
                i++
            }
    });
            }
    )

    //CREATE THE TYPE OF ANTECIPATIONS FILTER OPTIONS
    $.get("/openType", function(result){
        let i = 0
        result.forEach(row => {
            $("#type-options")[0].innerHTML += `<div class="type-unselected"><input type="checkbox" onclick="changeType()" id="type` + i + `"><h3 id="typeText` + i + `">${row.regra}</h3></div>`;
            i++
        });
    });

    //VALUES FOR AntecipaçãoxPrazo DIV
    $.get("/antecipations", function(result){
        
        $("#antecipation-value")[0].innerHTML = result[0]["COUNT (*)"];
        
    });

    //VALUES FOR PagamentosxPrazo DIV
    $.get("/fullValue", function(result){
        
        $("#montate-value")[0].innerHTML ="R$"+parseFloat(result[0]["SUM (montante)"]);
      
        
    });

    //VALUES FOR Rentabilidade Média DIV
    $.get("/profitability", function(result){
        
        $("#rentabilidade-value")[0].innerHTML =(result[0]["SUM(montante)/SUM(valor)"]*100).toFixed(0)+"%";
        
        
    });


}
attData()

//ALLOW THE FILTER TO BE OPEND
function openFilter() {
    if (document.getElementById("filterPopup").style.display == "flex") {
        document.getElementById("filterPopup").style.display = "none"
    }
    else {
        document.getElementById("filterPopup").style.display = "flex"
    }
}

//FILTERS THE RANKING BY SELECTED STATE
function changeState(){
    var state
    var scrollContainer = Array.from(document.getElementsByClassName('state-unselected'))
    for(var a = 0; a < scrollContainer.length; a++){
        if(document.getElementById("state" + a).checked){ //SEARCHES IF THERE IS ANY STATE SELECTED
            state = document.getElementById("stateText" + a).innerHTML //DEFINES THE SELECTED STATE
            var url = "/stateFilter";
            var xhttp = new XMLHttpRequest();
            xhttp.open("POST", url, false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send("estado=" + state); //SEARCHES THE DATABASE FOR INFORMATIONS RELATED TO THE SELECTED STATE
            var returnData = JSON.parse(xhttp.responseText);
            //HTML CODE THAT DEFINES EACH COLUMN OF THE RANK
            var number = '<div class="label-roll">' + 
            '<div class="label1">' + 
                '<h5>Nº</h5>' + 
                '<br>' + 
            '</div>' + 
        '</div>'
            var partner = '<div class="label-roll">' + 
            '<div class="label1">' + 
                '<h5>Parceiro</h5>' + 
                '<br>' + 
            '</div>' + 
        '</div>'
            var rule = '<div class="label-roll">' + 
            '<div class="label1">' + 
                '<h5>Tipo Solicitação</h5>' + 
            '</div>' + 
        '</div>'
            var state = '<div class="label-roll">' + 
            '<div class="label1">' + 
                '<h5>Estado</h5>' +
                '<br>' + 
            '</div>' + 
        '</div>'
            var qtd = '<div class="label-roll">' + 
            '<div class="label1">' + 
                '<h5>Qtd Solicitações</h5>' + 
            '</div>' + 
        '</div>'
            var divValue = '<div class="label-roll">' +
            '<div class="label1">' +
                '<h5>Valor Antecipado    </h5>' +
            '</div>' +
        '</div>'
            var i = 0
            var semrep = {};
            for (Element of returnData){
                if(Element.nome in semrep){ //IF THE PARTNER HAS APEARED BEFORE ON DATABASE RETURN 
                    semrep[Element.nome]["totalValue"] += Element.montante //ADDS TO PARTNER'S VALUE ON SEMREP LIST
                    semrep[Element.nome]["qtds"] += 1   //COUNTS HOW MANY TIMES PARTNER HAS ANTECIPATED 
                }else{
                    semrep[Element.nome] = {"name": Element.nome, "totalValue": Element.montante, "rule": Element.regra, "qtds": 1, "state": Element.estado}  //IN CASE PARTNER HASN'T APPEARED YET, CREATES A LINE FOR HIM ON SEMREP LIST
                }
            }
            semrep = Object.values(semrep).sort(function(a,b){return b["totalValue"]- a["totalValue"]});    //ORGANIZES THE PARTNERS IN ORDER ON RANKING
            for(Element of semrep){
            //DEFINES HTML CODE THAT WILL APEAR ON THE PAGE WITH DATA FROM DATABASE
                number += '<div class="label-roll">' + 
                '<div class="label2" id="number' + i + '">' + 
                    '<h5>' + (i + 1) + '</h5>' +
            '</div>' + 
            '</div>'
                partner += '<div class="label-roll">' +
                '<div class="label2" id="partner' + i + '">' +
                    '<h5>' + Element.name + '</h5>' +
                '</div>' + 
            '</div>'
                rule += '<div class="label-roll">' +
                '<div class="label2" id="rule' + i + '">' +
                    '<h5>' + Element.rule + '</h5>' + 
                '</div>' + 
            '</div>'
                state += '<div class="label-roll">' + 
                '<div class="label2" id="state' + i + '">'+
                    '<h5>' + Element.state + '</h5>' + 
                '</div>' + 
            '</div>'
                qtd += '<div class="label-roll">' +
                '<div class="label2" id="qtd' + i + '">' +
                    '<h5>' + Element.qtds + '</h5>' +
                '</div>' +
            '</div>'
                divValue += '<div class="label-roll">' + 
                '<div class="label2" id="value' + i + '">' +
                    '<h5>R$ ' + Element.totalValue + '</h5>' +
                '</div>' +
            '</div>'
                i++
            }
        }
        }
    if(state == undefined){    //IN CASE NO FILTERS HAVE BEEN SELECTED:
                var url = "/ranking";
                var xhttp = new XMLHttpRequest();
                xhttp.open("GET", url, false);
                xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhttp.send();   //GET NEEDED INFO FROM THE DATABASE
                var returnData = JSON.parse(xhttp.responseText);
                //HTML CODE THAT DEFINES EACH COLUMN OF THE RANK
                var number = '<div class="label-roll">' + 
                '<div class="label1">' + 
                    '<h5>Nº</h5>' + 
                    '<br>' + 
                '</div>' + 
            '</div>'
                var partner = '<div class="label-roll">' + 
                '<div class="label1">' + 
                    '<h5>Parceiro</h5>' + 
                    '<br>' + 
                '</div>' + 
            '</div>'
                var rule = '<div class="label-roll">' + 
                '<div class="label1">' + 
                    '<h5>Tipo Solicitação</h5>' + 
                '</div>' + 
            '</div>'
                var state = '<div class="label-roll">' + 
                '<div class="label1">' + 
                    '<h5>Estado</h5>' +
                    '<br>' + 
                '</div>' + 
            '</div>'
                var qtd = '<div class="label-roll">' + 
                '<div class="label1">' + 
                    '<h5>Qtd Solicitações</h5>' + 
                '</div>' + 
            '</div>'
                var divValue = '<div class="label-roll">' +
                '<div class="label1">' +
                    '<h5>Valor Antecipado    </h5>' +
                '</div>' +
            '</div>'
                var i = 0
                var semrep = {}
                for (Element of returnData){
                    if(Element.nome in semrep){ //IF THE PARTNER HAS APEARED BEFORE ON DATABASE RETURN 
                        semrep[Element.nome]["totalValue"] += Element.montante  //ADDS TO PARTNER'S VALUE ON SEMREP LIST
                        semrep[Element.nome]["qtds"] += 1   //COUNTS HOW MANY TIMES PARTNER HAS ANTECIPATED 
                    }else{
                        semrep[Element.nome] = {"name": Element.nome, "totalValue": Element.montante, "rule": Element.regra, "qtds": 1, "state": Element.estado}  //IN CASE PARTNER HASN'T APPEARED YET, CREATES A LINE FOR HIM ON SEMREP LIST
                    }
                }
                semrep = Object.values(semrep).sort(function(a,b){return b["totalValue"]- a["totalValue"]});    //ORGANIZES THE PARTNERS IN ORDER ON RANKING
                for(Element of semrep){
                   //DEFINES HTML CODE THAT WILL APEAR ON THE PAGE WITH DATA FROM DATABASE
                    number += '<div class="label-roll">' + 
                    '<div class="label2" id="number' + i + '">' + 
                        '<h5>' + (i + 1) + '</h5>' +
                '</div>' + 
                '</div>'
                    partner += '<div class="label-roll">' +
                    '<div class="label2" id="partner' + i + '">' +
                        '<h5>' + Element.name + '</h5>' +
                    '</div>' + 
                '</div>'
                    rule += '<div class="label-roll">' +
                    '<div class="label2" id="rule' + i + '">' +
                        '<h5>' + Element.rule + '</h5>' + 
                    '</div>' + 
                '</div>'
                    state += '<div class="label-roll">' + 
                    '<div class="label2" id="state' + i + '">'+
                        '<h5>' + Element.state + '</h5>' + 
                    '</div>' + 
                '</div>'
                    qtd += '<div class="label-roll">' +
                    '<div class="label2" id="qtd' + i + '">' +
                        '<h5>' + Element.qtds + '</h5>' +
                    '</div>' +
                '</div>'
                    divValue += '<div class="label-roll">' + 
                    '<div class="label2" id="value' + i + '">' +
                        '<h5>R$ ' + Element.totalValue + '</h5>' +
                    '</div>' +
                '</div>'
                    i++
                }
    }
    //PUTS THE HTML CODE ON THE PAGE
    document.getElementById('col_number').innerHTML = number
    document.getElementById('partner_col').innerHTML = partner
    document.getElementById('rule_col').innerHTML = rule
    document.getElementById('state_col').innerHTML = state
    document.getElementById('qtd').innerHTML = qtd
    document.getElementById('antecipatedValue').innerHTML = divValue
}


//FILTERS THE RANKING BY SELECTED PARTNER
function changePartner(){
    var partner
    var scrollContainer = Array.from(document.getElementsByClassName('partner-unselected'))
    for(var a = 0; a < scrollContainer.length; a++){
        if(document.getElementById("partner" + a).checked){ //SEARCHES IF THERE IS ANY STATE PARTNER
            partner = document.getElementById("partnerText" + a).innerHTML //DEFINES THE SELECTED PARTNER
            var url = "/partnerFilter";
            var xhttp = new XMLHttpRequest();
            xhttp.open("POST", url, false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send("partner=" + partner);  //SEARCHES THE DATABASE FOR INFORMATIONS RELATED TO THE SELECTED PARTNER
            var returnData = JSON.parse(xhttp.responseText);
            //HTML CODE THAT DEFINES EACH COLUMN OF THE RANK
            var number = '<div class="label-roll">' + 
            '<div class="label1">' + 
                '<h5>Nº</h5>' + 
                '<br>' + 
            '</div>' + 
        '</div>'
            var partner = '<div class="label-roll">' + 
            '<div class="label1">' + 
                '<h5>Parceiro</h5>' + 
                '<br>' + 
            '</div>' + 
        '</div>'
            var rule = '<div class="label-roll">' + 
            '<div class="label1">' + 
                '<h5>Tipo Solicitação</h5>' + 
            '</div>' + 
        '</div>'
            var state = '<div class="label-roll">' + 
            '<div class="label1">' + 
                '<h5>Estado</h5>' +
                '<br>' + 
            '</div>' + 
        '</div>'
            var qtd = '<div class="label-roll">' + 
            '<div class="label1">' + 
                '<h5>Qtd Solicitações</h5>' + 
            '</div>' + 
        '</div>'
            var divValue = '<div class="label-roll">' +
            '<div class="label1">' +
                '<h5>Valor Antecipado    </h5>' +
            '</div>' +
        '</div>'
            var semrep = {}
            var i = 0
            for (Element of returnData){
                if(Element.nome in semrep){ //IF THE PARTNER HAS APEARED BEFORE ON DATABASE RETURN 
                    semrep[Element.nome]["totalValue"] += Element.montante  //ADDS TO PARTNER'S VALUE ON SEMREP LIST
                    semrep[Element.nome]["qtds"] += 1   //COUNTS HOW MANY TIMES PARTNER HAS ANTECIPATED 
                }else{
                    semrep[Element.nome] = {"nome": Element.nome, "totalValue": Element.montante, "rule": Element.regra, "qtds": 1, "state": Element.estado}  //IN CASE PARTNER HASN'T APPEARED YET, CREATES A LINE FOR HIM ON SEMREP LIST
                }
            }
            semrep = Object.values(semrep).sort(function(a,b){return b["totalValue"]- a["totalValue"]});    //ORGANIZES THE PARTNERS IN ORDER ON RANKING
            for(Element of semrep){
                //DEFINES HTML CODE THAT WILL APEAR ON THE PAGE WITH DATA FROM DATABASE
                number += '<div class="label-roll">' + 
                '<div class="label2" id="number' + i + '">' + 
                    '<h5>' + (i + 1) + '</h5>' +
            '</div>' + 
            '</div>'
                partner += '<div class="label-roll">' +
                '<div class="label2" id="partner' + i + '">' +
                    '<h5>' + Element.nome + '</h5>' +
                '</div>' + 
            '</div>'
                rule += '<div class="label-roll">' +
                '<div class="label2" id="rule' + i + '">' +
                    '<h5>' + Element.rule + '</h5>' + 
                '</div>' + 
            '</div>'
                state += '<div class="label-roll">' + 
                '<div class="label2" id="state' + i + '">'+
                    '<h5>' + Element.state + '</h5>' + 
                '</div>' + 
            '</div>'
                qtd += '<div class="label-roll">' +
                '<div class="label2" id="qtd' + i + '">' +
                    '<h5>' + Element.qtds + '</h5>' +
                '</div>' +
            '</div>'
                divValue += '<div class="label-roll">' + 
                '<div class="label2" id="value' + i + '">' +
                    '<h5>R$ ' + Element.totalValue + '</h5>' +
                '</div>' +
            '</div>'
                i++
            }
        }
    }
    if(partner == undefined){  //IN CASE NO FILTERS HAVE BEEN SELECTED:
        for(var a = 0; a < scrollContainer.length; a++){
            if(!document.getElementById("partner" + a).checked){
                var i = 0
                var url = "/ranking";
                var xhttp = new XMLHttpRequest();
                xhttp.open("GET", url, false);
                xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhttp.send();   //GET NEEDED INFO FROM THE DATABASE
                var returnData = JSON.parse(xhttp.responseText);
                //HTML CODE THAT DEFINES EACH COLUMN OF THE RANK
                var number = '<div class="label-roll">' + 
                '<div class="label1">' + 
                    '<h5>Nº</h5>' + 
                    '<br>' + 
                '</div>' + 
            '</div>'
                var partner = '<div class="label-roll">' + 
                '<div class="label1">' + 
                    '<h5>Parceiro</h5>' + 
                    '<br>' + 
                '</div>' + 
            '</div>'
                var rule = '<div class="label-roll">' + 
                '<div class="label1">' + 
                    '<h5>Tipo Solicitação</h5>' + 
                '</div>' + 
            '</div>'
                var state = '<div class="label-roll">' + 
                '<div class="label1">' + 
                    '<h5>Estado</h5>' +
                    '<br>' + 
                '</div>' + 
            '</div>'
                var qtd = '<div class="label-roll">' + 
                '<div class="label1">' + 
                    '<h5>Qtd Solicitações</h5>' + 
                '</div>' + 
            '</div>'
                var divValue = '<div class="label-roll">' +
                '<div class="label1">' +
                    '<h5>Valor Antecipado    </h5>' +
                '</div>' +
            '</div>'
                var i = 0
                var semrep = {}
                for (Element of returnData){
                    if(Element.nome in semrep){ //IF THE PARTNER HAS APEARED BEFORE ON DATABASE RETURN 
                        semrep[Element.nome]["totalValue"] += Element.montante  //ADDS TO PARTNER'S VALUE ON SEMREP LIST
                        semrep[Element.nome]["qtds"] += 1  //COUNTS HOW MANY TIMES PARTNER HAS ANTECIPATED 
                    }else{
                        semrep[Element.nome] = {"nome": Element.nome, "totalValue": Element.montante, "rule": Element.regra, "qtds": 1, "state": Element.estado}//IN CASE PARTNER HASN'T APPEARED YET, CREATES A LINE FOR HIM ON SEMREP LIST
                    }
                }
                semrep = Object.values(semrep).sort(function(a,b){return b["totalValue"]- a["totalValue"]});   //ORGANIZES THE PARTNERS IN ORDER ON RANKING
                for(Element of semrep){
                   //DEFINES HTML CODE THAT WILL APEAR ON THE PAGE WITH DATA FROM DATABASE
                    number += '<div class="label-roll">' + 
                    '<div class="label2" id="number' + i + '">' + 
                        '<h5>' + (i + 1) + '</h5>' +
                '</div>' + 
                '</div>'
                    partner += '<div class="label-roll">' +
                    '<div class="label2" id="partner' + i + '">' +
                        '<h5>' + Element.nome + '</h5>' +
                    '</div>' + 
                '</div>'
                    rule += '<div class="label-roll">' +
                    '<div class="label2" id="rule' + i + '">' +
                        '<h5>' + Element.rule + '</h5>' + 
                    '</div>' + 
                '</div>'
                    state += '<div class="label-roll">' + 
                    '<div class="label2" id="state' + i + '">'+
                        '<h5>' + Element.state + '</h5>' + 
                    '</div>' + 
                '</div>'
                    qtd += '<div class="label-roll">' +
                    '<div class="label2" id="qtd' + i + '">' +
                        '<h5>' + Element.qtds + '</h5>' +
                    '</div>' +
                '</div>'
                    divValue += '<div class="label-roll">' + 
                    '<div class="label2" id="value' + i + '">' +
                        '<h5>R$ ' + Element.totalValue + '</h5>' +
                    '</div>' +
                '</div>'
                    i++
                }
            }
                
          }
    }
    //PUTS THE HTML CODE ON THE PAGE
    document.getElementById('col_number').innerHTML = number
    document.getElementById('partner_col').innerHTML = partner
    document.getElementById('rule_col').innerHTML = rule
    document.getElementById('state_col').innerHTML = state
    document.getElementById('qtd').innerHTML = qtd
    document.getElementById('antecipatedValue').innerHTML = divValue
}


//FILTERS THE RANKING BY SELECTED TYPE
function changeType(){
    var type
    var scrollContainer = Array.from(document.getElementsByClassName('type-unselected'))
    for(var a = 0; a < scrollContainer.length; a++){
        if(document.getElementById("type" + a).checked){    //SEARCHES IF THERE IS ANY TYPE SELECTED
            type = document.getElementById("typeText" + a).innerHTML    //DEFINES THE SELECTED TYPE
            var url = "/typeFilter";
            var xhttp = new XMLHttpRequest();
            xhttp.open("POST", url, false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send("regra=" + type);    //SEARCHES THE DATABASE FOR INFORMATIONS RELATED TO THE SELECTED TYPE
            var returnData = JSON.parse(xhttp.responseText);
            //HTML CODE THAT DEFINES EACH COLUMN OF THE RANK
            var number = '<div class="label-roll">' + 
            '<div class="label1">' + 
                '<h5>Nº</h5>' + 
                '<br>' + 
            '</div>' + 
        '</div>'
            var partner = '<div class="label-roll">' + 
            '<div class="label1">' + 
                '<h5>Parceiro</h5>' + 
                '<br>' + 
            '</div>' + 
        '</div>'
            var rule = '<div class="label-roll">' + 
            '<div class="label1">' + 
                '<h5>Tipo Solicitação</h5>' + 
            '</div>' + 
        '</div>'
            var state = '<div class="label-roll">' + 
            '<div class="label1">' + 
                '<h5>Estado</h5>' +
                '<br>' + 
            '</div>' + 
        '</div>'
            var qtd = '<div class="label-roll">' + 
            '<div class="label1">' + 
                '<h5>Qtd Solicitações</h5>' + 
            '</div>' + 
        '</div>'
            var divValue = '<div class="label-roll">' +
            '<div class="label1">' +
                '<h5>Valor Antecipado    </h5>' +
            '</div>' +
        '</div>'
            var i = 0
            var semrep = {};
            for (Element of returnData){
                if(Element.nome in semrep){ //IF THE PARTNER HAS APEARED BEFORE ON DATABASE RETURN 
                    semrep[Element.nome]["totalValue"] += Element.montante  //ADDS TO PARTNER'S VALUE ON SEMREP LIST
                    semrep[Element.nome]["qtds"] += 1  //COUNTS HOW MANY TIMES PARTNER HAS ANTECIPATED
                }else{
                    semrep[Element.nome] = {"nome": Element.nome, "totalValue": Element.montante, "rule": Element.regra, "qtds": 1, "state": Element.estado}  //IN CASE PARTNER HASN'T APPEARED YET, CREATES A LINE FOR HIM ON SEMREP LIST
                }
            }
            semrep = Object.values(semrep).sort(function(a,b){return b["totalValue"]- a["totalValue"]});    //ORGANIZES THE PARTNERS IN ORDER ON RANKING
            for(Element of semrep){
                //DEFINES HTML CODE THAT WILL APEAR ON THE PAGE WITH DATA FROM DATABASE
                number += '<div class="label-roll">' + 
                '<div class="label2" id="number' + i + '">' + 
                    '<h5>' + (i + 1) + '</h5>' +
            '</div>' + 
            '</div>'
                partner += '<div class="label-roll">' +
                '<div class="label2" id="partner' + i + '">' +
                    '<h5>' + Element.nome + '</h5>' +
                '</div>' + 
            '</div>'
                rule += '<div class="label-roll">' +
                '<div class="label2" id="rule' + i + '">' +
                    '<h5>' + Element.rule + '</h5>' + 
                '</div>' + 
            '</div>'
                state += '<div class="label-roll">' + 
                '<div class="label2" id="state' + i + '">'+
                    '<h5>' + Element.state + '</h5>' + 
                '</div>' + 
            '</div>'
                qtd += '<div class="label-roll">' +
                '<div class="label2" id="qtd' + i + '">' +
                    '<h5>' + Element.qtds + '</h5>' +
                '</div>' +
            '</div>'
                divValue += '<div class="label-roll">' + 
                '<div class="label2" id="value' + i + '">' +
                    '<h5>R$ ' + Element.totalValue + '</h5>' +
                '</div>' +
            '</div>'
                i++
            }
        }
        }
    if(type == undefined){  //IN CASE NO FILTERS HAVE BEEN SELECTED:
        for(var a = 0; a < scrollContainer.length; a++){
            if(!document.getElementById("type" + a).checked){
                var url = "/ranking";
                var xhttp = new XMLHttpRequest();
                xhttp.open("GET", url, false);
                xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhttp.send();  //GET NEEDED INFO FROM THE DATABASE
                var returnData = JSON.parse(xhttp.responseText);
                 //HTML CODE THAT DEFINES EACH COLUMN OF THE RANK
                var number = '<div class="label-roll">' + 
                '<div class="label1">' + 
                    '<h5>Nº</h5>' + 
                    '<br>' + 
                '</div>' + 
            '</div>'
                var partner = '<div class="label-roll">' + 
                '<div class="label1">' + 
                    '<h5>Parceiro</h5>' + 
                    '<br>' + 
                '</div>' + 
            '</div>'
                var rule = '<div class="label-roll">' + 
                '<div class="label1">' + 
                    '<h5>Tipo Solicitação</h5>' + 
                '</div>' + 
            '</div>'
                var state = '<div class="label-roll">' + 
                '<div class="label1">' + 
                    '<h5>Estado</h5>' +
                    '<br>' + 
                '</div>' + 
            '</div>'
                var qtd = '<div class="label-roll">' + 
                '<div class="label1">' + 
                    '<h5>Qtd Solicitações</h5>' + 
                '</div>' + 
            '</div>'
                var divValue = '<div class="label-roll">' +
                '<div class="label1">' +
                    '<h5>Valor Antecipado    </h5>' +
                '</div>' +
            '</div>'
                var i = 0
                var semrep = {}
                for (Element of returnData){
                    if(Element.nome in semrep){ //IF THE PARTNER HAS APEARED BEFORE ON DATABASE RETURN 
                        semrep[Element.nome]["totalValue"] += Element.montante  //ADDS TO PARTNER'S VALUE ON SEMREP LIST
                        semrep[Element.nome]["qtds"] += 1   //COUNTS HOW MANY TIMES PARTNER HAS ANTECIPATED 
                    }else{
                        semrep[Element.nome] = {"nome": Element.nome, "totalValue": Element.montante, "rule": Element.regra, "qtds": 1, "state": Element.estado}  //IN CASE PARTNER HASN'T APPEARED YET, CREATES A LINE FOR HIM ON SEMREP LIST
                    }
                }
                semrep = Object.values(semrep).sort(function(a,b){return b["totalValue"]- a["totalValue"]});    //ORGANIZES THE PARTNERS IN ORDER ON RANKING
                for(Element of semrep){
                    //DEFINES HTML CODE THAT WILL APEAR ON THE PAGE WITH DATA FROM DATABASE
                    number += '<div class="label-roll">' + 
                    '<div class="label2" id="number' + i + '">' + 
                        '<h5>' + (i + 1) + '</h5>' +
                '</div>' + 
                '</div>'
                    partner += '<div class="label-roll">' +
                    '<div class="label2" id="partner' + i + '">' +
                        '<h5>' + Element.nome + '</h5>' +
                    '</div>' + 
                '</div>'
                    rule += '<div class="label-roll">' +
                    '<div class="label2" id="rule' + i + '">' +
                        '<h5>' + Element.rule + '</h5>' + 
                    '</div>' + 
                '</div>'
                    state += '<div class="label-roll">' + 
                    '<div class="label2" id="state' + i + '">'+
                        '<h5>' + Element.state + '</h5>' + 
                    '</div>' + 
                '</div>'
                    qtd += '<div class="label-roll">' +
                    '<div class="label2" id="qtd' + i + '">' +
                        '<h5>' + Element.qtds + '</h5>' +
                    '</div>' +
                '</div>'
                    divValue += '<div class="label-roll">' + 
                    '<div class="label2" id="value' + i + '">' +
                        '<h5>R$ ' + Element.totalValue + '</h5>' +
                    '</div>' +
                '</div>'
                    i++
                }
            }
                
          }
    }
    //PUTS THE HTML CODE ON THE PAGE
    document.getElementById('col_number').innerHTML = number
    document.getElementById('partner_col').innerHTML = partner
    document.getElementById('rule_col').innerHTML = rule
    document.getElementById('state_col').innerHTML = state
    document.getElementById('qtd').innerHTML = qtd
    document.getElementById('antecipatedValue').innerHTML = divValue
}

function ranking(){
   //HTML CODE THAT DEFINES EACH COLUMN OF THE RANK
    var number = '<div class="label-roll">' + 
    '<div class="label1">' + 
        '<h5>Nº</h5>' + 
        '<br>' + 
    '</div>' + 
'</div>'
    var partner = '<div class="label-roll">' + 
    '<div class="label1">' + 
        '<h5>Parceiro</h5>' + 
        '<br>' + 
    '</div>' + 
'</div>'
    var rule = '<div class="label-roll">' + 
    '<div class="label1">' + 
        '<h5>Tipo Solicitação</h5>' + 
    '</div>' + 
'</div>'
    var state = '<div class="label-roll">' + 
    '<div class="label1">' + 
        '<h5>Estado</h5>' +
        '<br>' + 
    '</div>' + 
'</div>'
    var qtd = '<div class="label-roll">' + 
    '<div class="label1">' + 
        '<h5>Qtd Solicitações</h5>' + 
    '</div>' + 
'</div>'
    var divValue = '<div class="label-roll">' +
    '<div class="label1">' +
        '<h5>Valor Antecipado    </h5>' +
    '</div>' +
'</div>'
    var i = 0
    var url = "/ranking";
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", url, false);
    xhttp.send();//GET NEEDED INFO FROM THE DATABASE
    var returnData = JSON.parse(xhttp.responseText);
    var semrep = {};
    for (Element of returnData){
        if(Element.nome in semrep){ //IF THE PARTNER HAS APEARED BEFORE ON DATABASE RETURN 
            semrep[Element.nome]["totalValue"] += Element.montante  //ADDS TO PARTNER'S VALUE ON SEMREP LIST
            semrep[Element.nome]["qtds"] += 1    //COUNTS HOW MANY TIMES PARTNER HAS ANTECIPATED 
        }else{
            semrep[Element.nome] = {"nome": Element.nome, "totalValue": Element.montante, "rule": Element.regra, "qtds": 1, "state": Element.estado}  //IN CASE PARTNER HASN'T APPEARED YET, CREATES A LINE FOR HIM ON SEMREP LIST
        }
    }    
    semrep = Object.values(semrep).sort(function(a,b){return b["totalValue"]- a["totalValue"]});    //ORGANIZES THE PARTNERS IN ORDER ON RANKING
    for(Element of semrep){
        //DEFINES HTML CODE THAT WILL APEAR ON THE PAGE WITH DATA FROM DATABASE
        number += '<div class="label-roll">' + 
        '<div class="label2" id="number' + i + '">' + 
            '<h5>' + (i + 1) + '</h5>' +
       '</div>' + 
    '</div>'
        partner += '<div class="label-roll">' +
        '<div class="label2" id="partner' + i + '">' +
            '<h5>' + Element.nome + '</h5>' +
        '</div>' + 
    '</div>'
        rule += '<div class="label-roll">' +
        '<div class="label2" id="rule' + i + '">' +
            '<h5>' + Element.rule + '</h5>' + 
        '</div>' + 
    '</div>'
        state += '<div class="label-roll">' + 
        '<div class="label2" id="state' + i + '">'+
            '<h5>' + Element.state + '</h5>' + 
        '</div>' + 
    '</div>'
        qtd += '<div class="label-roll">' +
        '<div class="label2" id="qtd' + i + '">' +
            '<h5>' + Element.qtds + '</h5>' +
        '</div>' +
    '</div>'
        divValue += '<div class="label-roll">' + 
        '<div class="label2" id="value' + i + '">' +
            '<h5>R$ ' + Element.totalValue + '</h5>' +
        '</div>' +
    '</div>'
    i++
    }
    //PUTS THE HTML CODE ON THE PAGE
    document.getElementById('col_number').innerHTML = number
    document.getElementById('partner_col').innerHTML = partner
    document.getElementById('rule_col').innerHTML = rule
    document.getElementById('state_col').innerHTML = state
    document.getElementById('qtd').innerHTML = qtd
    document.getElementById('antecipatedValue').innerHTML = divValue
}

