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

function openCities(){
    if ($("#city-options")[0].style.display == "none" || $("#city-options")[0].style.display == ""){
        $("#city-options")[0].style.display = "flex"
        off = false
        $("#cidades-filter")[0].style.backgroundColor = "#3468FC"
        $("#cidades-filter")[0].style.color = "#FFF"
    } else{
        $("#city-options")[0].style.display = "none"
        $("#cidades-filter")[0].style.backgroundColor = "#DDE6FF"
        $("#cidades-filter")[0].style.color = "#373737"
    }

}
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

function openPeriod(){
    if ($("#period-options")[0].style.display == "none" || $("#period-options")[0].style.display == ""){
        $("#period-options")[0].style.display = "flex"
        off = false
        $("#periodos-filter")[0].style.backgroundColor = "#3468FC"
        $("#periodos-filter")[0].style.color = "#FFF"
    } else{
        $("#period-options")[0].style.display = "none"
        $("#periodos-filter")[0].style.backgroundColor = "#DDE6FF"
        $("#periodos-filter")[0].style.color = "#373737"
    }

}

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

// const { Console } = require("console")

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

    $.get("http://localhost:3031/stateFilter", function(resultado){
        resultado.forEach(row => {
            $("#state-options")[0].innerHTML += `<div class="state-unselected" onclick="changeStatus(this)">${row.estado}</div>`;
        });
    });

    $.get("http://localhost:3031/cityFilter", function(resultado){
        resultado.forEach(row => {
            $("#city-options")[0].innerHTML += `<div class="city-unselected" onclick="changeStatus(this)">${row.cidade}</div>`;
        });
    });

    $.get("http://localhost:3031/partnerFilter", function(resultado){
        resultado.forEach(row => {
            $("#partner-options")[0].innerHTML += `<div class="partner-unselected" onclick="changeStatus(this)">${row.nome}</div>`;
        });
    });

    $.get("http://localhost:3031/periodFilter", function(resultado){
        resultado.forEach(row => {
            $("#period-options")[0].innerHTML += `<div class="period-unselected" onclick="changeStatus(this)">${row.data_recebimento}</div>`;
        });
    });

    $.get("http://localhost:3031/typeFilter", function(resultado){
        resultado.forEach(row => {
            $("#type-options")[0].innerHTML += `<div class="type-unselected" onclick="changeStatus(this)">${row.regra}</div>`;
        });
    });


    $.get("http://localhost:3031/antecipations", function(resultado){
        
        $("#antecipation-value")[0].innerHTML = resultado[0]["COUNT (*)"];
        
    });

    $.get("http://localhost:3031/montante", function(resultado){
        
        $("#montate-value")[0].innerHTML ="R$"+parseFloat(resultado[0]["SUM (montante)"]);
      
        
    });

    $.get("http://localhost:3031/rentabilidade", function(resultado){
        
        $("#rentabilidade-value")[0].innerHTML =(resultado[0]["SUM(montante)/SUM(valor)"]*100).toFixed(0)+"%";
        
        
    });


}
attData()

function openFilter() {
    if (document.getElementById("filterPopup").style.display == "flex") {
        document.getElementById("filterPopup").style.display = "none"
    }
    else {
        document.getElementById("filterPopup").style.display = "flex"
    }
}

function changeStatus(event) {
    var value = event.parentElement.id
    

    if (event.className == "state-unselected" || event.className == "city-unselected" || event.className == "partner-unselected" || event.className == "period-unselected" || event.className == "type-unselected")
        switch (value) {
            case "state-options":
                event.className = "state-selected"
                break
            case "city-options":
                event.className = "city-selected"
                break
            case "partner-options":
                event.className = "partner-selected"
                break
            case "period-options":
                event.className = "period-selected"
                break
            case "type-options":
                event.className = "type-selected"
                break
        }
    else {
        switch (value) {
            case "state-options":
                event.className = "state-unselected"
                break
            case "city-options":
                event.className = "city-unselected"
                break
            case "partner-options":
                event.className = "partner-unselected"
                break
            case "period-options":
                event.className = "period-unselected"
                break
            case "type-options":
                event.className = "type-unselected"
                break
        }
    }
    filter()
}

function filter() {
    var stateVector = document.getElementsByClassName("state-selected");
    var stateFiltered = [];
    for(var i = 0; i < stateVector.length; i++){
        stateFiltered.push(stateVector[i].innerText)
        
    }
    var cityVector = document.getElementsByClassName("city-selected");
    var cityFiltered = [];
    for(var i = 0; i < cityVector.length; i++){
        cityFiltered.push(cityVector[i].innerText)
        
    }
    var partnerVector = document.getElementsByClassName("partner-selected");
    var partnerFiltered = [];
    for(var i = 0; i < partnerVector.length; i++){
        partnerFiltered.push(partnerVector[i].innerText)
        
    }
    var periodVector = document.getElementsByClassName("period-selected");
    var periodFiltered = [];
    for(var i = 0; i < periodVector.length; i++){
        periodFiltered.push(periodVector[i].innerText)
        
    }
    var typeVector = document.getElementsByClassName("type-selected");
    var typeFiltered = [];
    for(var i = 0; i < typeVector.length; i++){
        typeFiltered.push(typeVector[i].innerText)
        
    }

        var estado_hotel = stateFiltered
        var cidade_hotel = cityFiltered
        var nome_hotel = partnerFiltered
        var data_recebimento_antecipacao = periodFiltered
        var regra_antecipacao = typeFiltered
        
        await(
            $.ajax({
                dataType: "json",
                contentType: "application/json",
                url: "http://127.0.0.1:3031/hotel",
                type: "post",
                cors: true,
                headers: {
                    'Acces-Control-Allow-Origin': '*',
                },
                data: JSON.stringify({ estado_hotel: estado_hotel,
                     cidade_hotel: cidade_hotel, 
                     nome_hotel: nome_hotel 
                  }),
                success: function (resultData) {
                    console.log("Sucesso")
                    getSkills();
                }
            }))
            await(
            $.ajax({
                dataType: "json",
                contentType: "application/json",
                url: "http://127.0.0.1:3031/antecipacao",
                type: "post",
                cors: true,
                headers: {
                    'Acces-Control-Allow-Origin': '*',
                },
                data: JSON.stringify({ data_recebimento_antecipacao: data_recebimento_antecipacao, 
                    regra_antecipacao: regra_antecipacao
                  }),
                success: function (resultData) {
                    console.log("Sucesso")
                    getSkills();
                }
            }))

            
}

function ranking(){
    var nomes_usados_qtd = []
    var nomes_usados_rank = []
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
    var regra = '<div class="label-roll">' + 
    '<div class="label1">' + 
        '<h5>Tipo Solicitação</h5>' + 
    '</div>' + 
'</div>'
    var estado = '<div class="label-roll">' + 
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
    var divValor = '<div class="label-roll">' +
    '<div class="label1">' +
        '<h5>Valor Antecipado    </h5>' +
    '</div>' +
'</div>'
    var qtd_ant = 0
    var i = 0
    var valor = 0
    var url = "http://127.0.0.1:3031/ranking";
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", url, false);
    xhttp.send();//A execução do script pára aqui até a requisição retornar do servidor
    var retorno = JSON.parse(xhttp.responseText);
    for (Element of retorno){
            var nome_atual = Element.nome
            if (nomes_usados_qtd.includes(nome_atual)){
                break
            }else{
            for(Element2 of retorno){
                if(nome_atual == Element2.nome){
                    qtd_ant++
                    valor += Element2.montante
                }
            }
            nomes_usados_qtd.push(nome_atual)
        }
        if (nomes_usados_rank.includes(nome_atual)){
            break
        }else{
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
        regra += '<div class="label-roll">' +
        '<div class="label2" id="regra' + i + '">' +
            '<h5>' + Element.regra + '</h5>' + 
        '</div>' + 
    '</div>'
        estado += '<div class="label-roll">' + 
        '<div class="label2" id="estado' + i + '">'+
            '<h5>' + Element.estado + '</h5>' + 
        '</div>' + 
    '</div>'
        qtd += '<div class="label-roll">' +
        '<div class="label2" id="qtd' + i + '">' +
            '<h5>' + qtd_ant + '</h5>' +
        '</div>' +
    '</div>'
        divValor += '<div class="label-roll">' + 
        '<div class="label2" id="value' + i + '">' +
            '<h5>R$ ' + valor + '</h5>' +
        '</div>' +
    '</div>'
        i++
        qtd_ant = 0
        nomes_usados_rank.push(nome_atual)
        valor = 0
    }
}
    document.getElementById('col_number').innerHTML = number
    document.getElementById('partner_col').innerHTML = partner
    document.getElementById('rule_col').innerHTML = regra
    document.getElementById('state_col').innerHTML = estado
    document.getElementById('qtd').innerHTML = qtd
    document.getElementById('antecipatedValue').innerHTML = divValor
}